import fs from 'node:fs';
import {screenDefinitions} from '../src/screen-catalog.js';
import {connectBrowser} from './browser-session.mjs';
const b=await connectBrowser(),output=process.env.SCREENSHOT_DIR||'artifacts/qa/senior-usability';fs.mkdirSync(output,{recursive:true});
const scan=`(()=>{
 const root=document.querySelector('[data-product-surface]'),issues=[],width=innerWidth;
 const rgb=c=>(c.match(/[\\d.]+/g)||[]).map(Number),lum=c=>{const a=rgb(c).slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});return a[0]*.2126+a[1]*.7152+a[2]*.0722;};
 const bg=e=>{for(let n=e;n;n=n.parentElement){const c=getComputedStyle(n).backgroundColor,a=rgb(c);if(a.length===3||a[3]===1)return c;}return 'rgb(255,255,255)';};
 const visible=e=>e.getBoundingClientRect().height>0&&getComputedStyle(e).visibility!=='hidden';
 const controls=[...root.querySelectorAll('button,input,select,textarea,summary,a')].filter(visible);
 for(const e of controls){const r=e.getBoundingClientRect();if(r.height<48||r.width<48)issues.push({type:'touch-size',text:e.innerText||e.id,width:r.width,height:r.height});}
 for(const e of [...root.querySelectorAll('p,dt,dd,label,button,h1,h2,small,summary')].filter(visible)){
 const s=getComputedStyle(e),size=parseFloat(s.fontSize);if(size<18)issues.push({type:'font-size',text:e.innerText.slice(0,40),size});
 const a=lum(s.color),c=lum(bg(e)),ratio=(Math.max(a,c)+.05)/(Math.min(a,c)+.05),required=size>=24||size>=18.66&&parseInt(s.fontWeight)>=700?3:4.5;
 if(ratio<required)issues.push({type:'contrast',text:e.innerText.slice(0,40),ratio,required});
 }
 for(const e of [...root.querySelectorAll('*')].filter(visible)){const r=e.getBoundingClientRect();if(r.left<-.5||r.right>width+.5)issues.push({type:'overflow',text:e.innerText.slice(0,30),left:r.left,right:r.right});}
 return {screen:root.querySelector('.page').dataset.screenId,title:root.querySelector('h1').innerText,issues,width,controls:controls.length,visibleText:root.innerText};
})()`;
const results=[];await b.navigate('/review');
for(const item of screenDefinitions.filter(i=>!i.id.startsWith('DM-'))){
 await b.click('.screen-index summary');await b.click(`[data-screen="${item.id}"]`);const standard=await b.evaluate(scan);
 await b.screenshot(output+'/'+item.id+'.png','[data-product-surface]');
 await b.call('Emulation.setDeviceMetricsOverride',{width:195,height:422,deviceScaleFactor:2,mobile:true});const zoom=await b.evaluate(scan);
 await b.call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await b.evaluate(`document.querySelector('[data-product-surface]').classList.add('large-text')`);const largeText=await b.evaluate(scan);await b.evaluate(`document.querySelector('[data-product-surface]').classList.remove('large-text')`);
 results.push({id:item.id,standard,zoom200Equivalent:zoom,largeText});
 if(standard.issues.length||zoom.issues.length||largeText.issues.length)console.log(item.id,JSON.stringify({standard:standard.issues,zoom:zoom.issues,large:largeText.issues}));
}
await b.click('.screen-index summary');await b.click('[data-screen="EL-TASK-01"]');await b.evaluate('document.querySelector("h1").focus()');
await b.call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await b.call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
const keyboard=await b.evaluate(`({focused:document.activeElement.id,outline:getComputedStyle(document.activeElement).outlineStyle,label:document.querySelector('label[for=task-input]').innerText})`);
const status=results.every(r=>![...r.standard.issues,...r.zoom200Equivalent.issues,...r.largeText.issues].length)&&keyboard.focused==='task-input'?'PASS':'FAIL';
fs.writeFileSync(output+'/audit.json',JSON.stringify({status,testedAt:new Date().toISOString(),count:results.length,keyboard,results},null,2));b.close();console.log(status+' '+results.length+' product pages, keyboard '+keyboard.focused);if(status==='FAIL')process.exitCode=1;
