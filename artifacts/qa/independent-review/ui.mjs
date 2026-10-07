import fs from 'node:fs';
const out='artifacts/qa/independent-review';
const pages=await fetch('http://127.0.0.1:9336/json/list').then(r=>r.json());
const page=pages.find(p=>p.type==='page'&&p.url.startsWith('http://127.0.0.1:8080'));
const socket=new WebSocket(page.webSocketDebuggerUrl); const pending=new Map();let seq=0;
socket.addEventListener('message',e=>{const r=JSON.parse(e.data);if(pending.has(r.id)){pending.get(r.id)(r);pending.delete(r.id)}});
await new Promise(r=>socket.addEventListener('open',r,{once:true}));
export async function call(method,params={}){let id=++seq;socket.send(JSON.stringify({id,method,params}));const r=await new Promise(resolve=>pending.set(id,resolve));if(r.error)throw Error(JSON.stringify(r.error));return r.result;}
export async function read(expression){const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
export const wait=ms=>new Promise(r=>setTimeout(r,ms));
export async function click(selector){const pos=await read(`(()=>{let e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing '+${JSON.stringify(selector)});e.scrollIntoView({block:'center'});let r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await call('Input.dispatchMouseEvent',{type:'mousePressed',...pos,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...pos,button:'left',clickCount:1});await wait(100);}
export async function action(a){await click(`[data-action="${a}"]`)}
export async function input(selector,value){await click(selector);for(const type of ['keyDown','keyUp'])await call('Input.dispatchKeyEvent',{type,key:'a',code:'KeyA',windowsVirtualKeyCode:65,modifiers:8});await call('Input.insertText',{text:value});}
export async function snap(name){await read('window.scrollTo(0,0)');const metrics=await call('Page.getLayoutMetrics');const pic=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:390,height:Math.ceil(metrics.cssContentSize.height),scale:1}});fs.writeFileSync(`${out}/${name}.png`,Buffer.from(pic.data,'base64'));const state=await read(`({screen:document.querySelector('.page')?.dataset.screenId,title:document.querySelector('h1')?.innerText,text:document.querySelector('.page')?.innerText,controls:[...document.querySelectorAll('button,input,textarea,select,summary')].map(e=>({text:e.innerText||e.id,action:e.dataset.action,screen:e.dataset.screen,scenario:e.dataset.scenario,disabled:e.disabled})),storage:{...localStorage}})`);fs.appendFileSync(`${out}/operations.jsonl`,JSON.stringify({time:new Date().toISOString(),name,...state})+'\n');console.log(JSON.stringify({name,screen:state.screen,title:state.title,text:state.text,controls:state.controls.filter(c=>c.action&&!["elder-home","family-home","relationship","settings","role-elder","role-family","demo"].includes(c.action))}));return state;}
export async function init(){await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});}
export function close(){socket.close()}
await init();
