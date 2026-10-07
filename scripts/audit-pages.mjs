import fs from 'node:fs';
import path from 'node:path';
import { screenDefinitions } from '../src/screen-catalog.js';
const endpoint=process.env.CDP_URL || 'http://127.0.0.1:9335';
const appUrl=process.env.APP_URL || 'http://127.0.0.1:8080';
const output=process.env.SCREENSHOT_DIR || 'artifacts/qa/prompt14-pages';
fs.mkdirSync(output,{recursive:true});
const pages=await fetch(`${endpoint}/json/list`).then(r=>r.json());
const page=pages.find(p=>p.type==='page' && p.url.startsWith(appUrl));
if(!page) throw Error('Open prototype in a CDP Chrome session');
const socket=new WebSocket(page.webSocketDebuggerUrl),pending=new Map(); let seq=0;
socket.addEventListener('message',e=>{const r=JSON.parse(e.data);if(pending.has(r.id)){pending.get(r.id)(r);pending.delete(r.id);}});
await new Promise(resolve=>socket.addEventListener('open',resolve,{once:true}));
const call=(method,params={})=>{const id=++seq;socket.send(JSON.stringify({id,method,params}));return new Promise(resolve=>pending.set(id,resolve));};
async function evaluate(expression){const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.error || r.result.exceptionDetails)throw Error(JSON.stringify(r));return r.result.result.value;}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function click(selector){const pos=await evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)throw Error('Missing control');el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await call('Input.dispatchMouseEvent',{type:'mousePressed',...pos,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...pos,button:'left',clickCount:1});await wait(35);}
const scan=`(()=>{
 const width=innerWidth,issues=[];
 const rgb=c=>(c.match(/[\\d.]+/g)||[]).map(Number);
 const lum=c=>{const a=rgb(c).slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});return a[0]*.2126+a[1]*.7152+a[2]*.0722;};
 const background=el=>{for(let n=el;n;n=n.parentElement){const bg=getComputedStyle(n).backgroundColor,a=rgb(bg);if(a.length===3||a[3]===1)return bg;}return 'rgb(255,255,255)';};
 const controls=[...document.querySelectorAll('.page button,.page input,.page select,.page textarea,.product-nav button,.demo-tools button')].filter(e=>e.getBoundingClientRect().height>0);
 for(const e of controls){const r=e.getBoundingClientRect();if(r.height<48||r.width<48)issues.push({type:'touch-size',text:e.innerText||e.id,w:r.width,h:r.height});}
 for(const e of document.querySelectorAll('.page p,.page dt,.page dd,.page label,.page button,.page h1,.page h2')){
  const r=e.getBoundingClientRect();if(!r.height)continue;const s=getComputedStyle(e),size=parseFloat(s.fontSize);
  if(size<18)issues.push({type:'font-size',text:e.innerText.slice(0,40),size});
  const a=lum(s.color),b=lum(background(e)),contrast=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),required=size>=24 && parseInt(s.fontWeight)>=700?3:4.5;
  if(contrast<required)issues.push({type:'contrast',text:e.innerText.slice(0,40),contrast,required,fg:s.color,bg:background(e)});
 }
 for(const e of document.querySelectorAll('.app-shell *')){const r=e.getBoundingClientRect();if(!r.height)continue;if(r.left<-.5||r.right>width+.5)issues.push({type:'overflow',tag:e.tagName,text:e.innerText.slice(0,30),left:r.left,right:r.right,width});}
 const main=document.querySelector('.page');
 return {screen:main.dataset.screenId,title:main.querySelector('h1')?.innerText,status:main.querySelector('[role=status]')?.innerText,issues,viewport:width,height:document.documentElement.scrollHeight,controls:controls.length};
})()`;
const results=[];
await call('Page.enable');
await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await evaluate('location.reload(); true');await wait(300);
for(const item of screenDefinitions){
 await click('[data-action=demo]');await click('.screen-index summary');await click(`[data-screen="${item.id}"]`);
 const standard=await evaluate(scan);if(standard.screen!==item.id)throw Error(`Wrong rendered screen ${item.id}`);
 await evaluate('window.scrollTo(0,0)');const metrics=await call('Page.getLayoutMetrics');
 const picture=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:390,height:Math.ceil(metrics.result.cssContentSize.height),scale:1}});
 fs.writeFileSync(path.join(output,`${item.id}.png`),Buffer.from(picture.result.data,'base64'));
 // 200% browser zoom equivalent: half CSS viewport at same physical width.
 await call('Emulation.setDeviceMetricsOverride',{width:195,height:422,deviceScaleFactor:2,mobile:true});
 const zoom=await evaluate(scan);
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 results.push({id:item.id,standard,zoom200:zoom});
 console.log(`${item.id}: ${standard.issues.length}/${zoom.issues.length} issues`);
}
await click('[data-action=demo]');await click('.screen-index summary');await click('[data-screen="EL-TASK-01"]');
await evaluate("document.querySelector('h1').focus()");
await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
const keyboard=await evaluate("({focused:document.activeElement.id,outline:getComputedStyle(document.activeElement).outlineStyle,label:document.querySelector('label[for=task-input]')?.innerText})");
const report={testedAt:new Date().toISOString(),url:appUrl,count:results.length,status:results.every(r=>!r.standard.issues.length&&!r.zoom200.issues.length)&&keyboard.focused==='task-input'?'PASS':'FAIL',keyboard,results};
fs.writeFileSync(path.join(output,'audit.json'),JSON.stringify(report,null,2)+'\n');socket.close();console.log(JSON.stringify({status:report.status,count:report.count,keyboard,output}));if(report.status!=='PASS')process.exitCode=1;
