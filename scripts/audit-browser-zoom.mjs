// Use a dedicated desktop Chrome profile with partition.default_zoom_level.x
// set to Math.log(2)/Math.log(1.2). Chrome itself applies 200% page zoom.
// CDP metrics below request pixel ratio 1; the measured ratio 2 proves that
// this is browser zoom, rather than a deviceScaleFactor=2 approximation.
import fs from 'node:fs';
import {connectBrowser} from './browser-session.mjs';
import {screenDefinitions} from '../src/screen-catalog.js';
const b=await connectBrowser(),out='artifacts/qa/browser-zoom';
fs.mkdirSync(out,{recursive:true});
await b.call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
const browser=(await b.call('Browser.getVersion')).result,results=[];
await b.navigate('/review');
for(const item of screenDefinitions.filter(x=>!x.id.startsWith('DM-'))){
  await b.click('.screen-index summary');await b.click(`[data-screen="${item.id}"]`);
  const metrics=await b.evaluate(`(()=>{const p=document.querySelector('[data-product-surface]');return {innerWidth,devicePixelRatio,visualWidth:visualViewport.width,productWidth:p.getBoundingClientRect().width,scrollWidth:p.scrollWidth,clientWidth:p.clientWidth,title:p.querySelector('h1').innerText,buttons:[...p.querySelectorAll('button')].map(e=>({text:e.innerText,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))};})()`);
  const issues=[];
  if(metrics.innerWidth!==195||metrics.devicePixelRatio!==2)issues.push('Browser zoom is not 200%');
  if(metrics.scrollWidth>metrics.clientWidth+2)issues.push('Horizontal overflow');
  if(metrics.buttons.some(x=>x.width<48||x.height<48))issues.push('Touch target below 48 CSS px');
  await b.evaluate('window.scrollTo(0,0)');
  const shot=await b.call('Page.captureScreenshot',{format:'png'});
  fs.writeFileSync(`${out}/${item.id}.png`,Buffer.from(shot.result.data,'base64'));
  results.push({id:item.id,status:issues.length?'FAIL':'PASS',metrics,issues});
}
await b.click('[data-scenario="RECOGNITION_ERROR"]');await b.navigate('/');
const action=async name=>b.click(`[data-action="${name}"]`);
for(const name of ['edit-time','set-time-nine','confirm-task','ask-share','start-share','send-request'])await action(name);
await b.wait(450);await b.navigate('/family');
for(const name of ['open-family-request','ask-accept-request','accept-request'])await action(name);
await b.navigate('/');await action('saved-task');await action('view-request-result');
await action('saved-task');await action('ask-complete');await action('complete-task');
const state=await b.evaluate(`JSON.parse(localStorage.getItem('elder-family-assistant/state/v1'))`);
const zoomedWorkflow=state.task.status==='COMPLETED'&&state.task.reminderAt===null&&state.collaborationRequest.status==='ACCEPTED';
const status=results.every(x=>x.status==='PASS')&&zoomedWorkflow?'PASS':'FAIL';
fs.writeFileSync(out+'/results.json',JSON.stringify({status,testedAt:new Date().toISOString(),browser,method:'Chrome default page zoom 200%, CDP physical viewport 390x844 and requested deviceScaleFactor=1',count:results.length,zoomedWorkflow,results},null,2));
b.close();console.log(`${results.length} product pages at actual browser 200% zoom: ${status}`);
if(status==='FAIL')process.exitCode=1;
