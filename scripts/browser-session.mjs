import fs from 'node:fs';
export async function connectBrowser() {
 const appUrl=process.env.APP_URL||'http://127.0.0.1:8080',endpoint=process.env.CDP_URL||'http://127.0.0.1:9335';
 const tabs=await fetch(`${endpoint}/json/list`).then(r=>r.json()),tab=tabs.find(t=>t.type==='page'&&t.url.startsWith(appUrl));
 if(!tab)throw Error('Open the application in the QA browser session');
 const socket=new WebSocket(tab.webSocketDebuggerUrl),pending=new Map();let seq=0;
 socket.addEventListener('message',e=>{const r=JSON.parse(e.data);if(pending.has(r.id)){pending.get(r.id)(r);pending.delete(r.id);}});
 await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
 const call=(method,params={})=>{const id=++seq;socket.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(Error('Browser command timed out: '+method));},15000);pending.set(id,result=>{clearTimeout(timer);resolve(result);});});};
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.error||r.result?.exceptionDetails)throw Error(JSON.stringify(r));return r.result.result.value;};
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const navigate=async route=>{await call('Page.navigate',{url:appUrl+route});await wait(180);};
 const click=async selector=>{const pos=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e||e.disabled)throw Error('Missing enabled control: '+${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await call('Input.dispatchMouseEvent',{type:'mousePressed',...pos,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',...pos,button:'left',clickCount:1});await wait(45);};
 const screenshot=async (file,selector)=>{await evaluate('window.scrollTo(0,0)');const clip=selector?await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1};})()`):{x:0,y:0,width:390,height:Math.ceil((await call('Page.getLayoutMetrics')).result.cssContentSize.height),scale:1};const r=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip});fs.writeFileSync(file,Buffer.from(r.result.data,'base64'));};
 await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 return {call,evaluate,wait,navigate,click,screenshot,close:()=>socket.close(),appUrl};
}
