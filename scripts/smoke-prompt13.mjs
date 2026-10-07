import fs from 'node:fs';
import path from 'node:path';
import { FIXED_INPUT } from '../src/state/initial-state.js';

const appUrl = process.env.APP_URL || 'http://127.0.0.1:8080';
const endpoint = process.env.CDP_URL || 'http://127.0.0.1:9335';
const output = process.env.SCREENSHOT_DIR || 'artifacts/qa/prompt13-browser';
fs.mkdirSync(output, { recursive: true });
const pages = await fetch(`${endpoint}/json/list`).then(r => r.json());
const tab = pages.find(p => p.type === 'page' && p.url.startsWith(appUrl));
if (!tab) throw new Error(`Open ${appUrl} in a Chrome CDP session first`);
const socket = new WebSocket(tab.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
socket.addEventListener('message', e => {
  const message = JSON.parse(e.data);
  if (pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
});
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once:true }); socket.addEventListener('error', reject, { once:true }); });
function call(method, params = {}) {
  const id = ++sequence;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise(resolve => pending.set(id, resolve));
}
async function evaluate(expression) {
  const r = await call('Runtime.evaluate', { expression, returnByValue:true, awaitPromise:true });
  if (r.error || r.result?.exceptionDetails) throw new Error(JSON.stringify(r));
  return r.result.result.value;
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const state = () => evaluate(`JSON.parse(localStorage.getItem('elder-family-assistant/state/v1'))`);
const body = () => evaluate('document.body.innerText');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const trace = [];
async function step(action, expected, delay = 65) {
  const position = await evaluate(`(() => { const el=document.querySelector('[data-action="${action}"]'); if(!el || el.disabled) return null; el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
  assert(position, `Missing enabled control: ${action}`);
  await call('Input.dispatchMouseEvent', { type:'mousePressed', ...position, button:'left', clickCount:1 });
  await call('Input.dispatchMouseEvent', { type:'mouseReleased', ...position, button:'left', clickCount:1 });
  await wait(delay);
  const text = await body();
  trace.push({ action, expected, actualView:(await state()).currentView });
  assert(!expected || text.includes(expected), `After ${action}: expected ${expected}; saw ${text.slice(0,500)}`);
}
async function input(selector, value) {
  await evaluate(`(() => { const el=document.querySelector(${JSON.stringify(selector)}); el.value=${JSON.stringify(value)}; el.dispatchEvent(new Event('input',{bubbles:true})); })()`);
}
async function screenshot(name) {
  await evaluate('window.scrollTo(0,0)');
  const metrics = await call('Page.getLayoutMetrics');
  const height = Math.ceil(metrics.result.cssContentSize.height);
  const image = await call('Page.captureScreenshot', { format:'png', captureBeyondViewport:true, clip:{x:0,y:0,width:390,height,scale:1} });
  fs.writeFileSync(path.join(output, `${name}.png`), Buffer.from(image.result.data,'base64'));
}
async function reset() {
  await step('demo','演示控制台');
  await step('ask-reset','恢复初始演示？');
  await step('reset','已恢复初始演示');
  await step('elder-home','今天要记什么事？');
  const s = await state();
  assert(s.task.status === 'EMPTY' && s.relationship.status === 'UNLINKED' && s.collaborationRequest.status === 'NONE','Reset did not restore initial state');
}
async function relationship() {
  await step('relationship','邀请小梅建立家庭协作');
  await step('show-qr','二维码已准备好');
  await step('family-relationship','扫描张阿姨的二维码');
  await step('family-scan','正在等张阿姨确认');
  await step('elder-relationship','小梅想和你建立协作');
  await step('ask-establish-relationship','同意与小梅建立协作？');
  assert((await state()).relationship.status === 'PENDING_ELDER','Consent happened before confirmation');
  await step('establish-relationship','已建立家庭协作');
  await step('elder-home','今天要记什么事？');
}
async function confirmed() {
  await step('task-input','你想记什么事？');
  await input('#task-input', FIXED_INPUT);
  await step('submit-task','正在帮你整理');
  await wait(500);
  const error = await body();
  assert(error.includes('上午 8:00') && error.includes('上午 7:30'),'Expected preset recognition error');
  await step('edit-time','改成几点？');
  await step('set-time-nine','再看一遍');
  const corrected = await body();
  assert(corrected.includes('上午 9:00') && corrected.includes('上午 8:30'),'Reminder did not follow corrected time');
  await step('confirm-task','这件事已记好');
}
async function sharePreview() {
  if(await evaluate('!!document.querySelector("[data-action=ask-share]")')) await step('ask-share','要请小梅陪同吗？');
  await step('start-share','这次小梅会看到');
}
async function send() {
  await sharePreview();
  assert(!(await body()).includes('上午 8:30'),'Personal reminder leaked to shared preview');
  await step('send-request','正在发给小梅');
  await wait(400);
  assert((await body()).includes('已经发给小梅'),'Sending did not finish');
  assert((await state()).collaborationRequest.status === 'PENDING','Request not pending');
}
async function pendingRequest() { await relationship(); await confirmed(); await send(); }
async function familyReply(kind = 'accept') {
  await step('family-request','有 1 个待回复请求');
  await step('open-family-request','张阿姨希望你陪同');
  const text = await body();
  assert(text.includes('上午 9:00') && !text.includes('上午 8:30') && !text.includes(FIXED_INPUT),'Shared fields or privacy wrong');
  await step(kind === 'accept' ? 'ask-accept-request' : 'ask-decline-request',kind === 'accept' ? '确认这次可以陪同？' : '确认这次不能陪同？');
  await step(kind === 'accept' ? 'accept-request' : 'decline-request',kind === 'accept' ? '已回复可以陪同' : '已回复不能陪同');
}
const tests = [
  ['A07-repeat-send',async()=>{
    await relationship(); await confirmed(); await sharePreview();
    await evaluate("(() => { const el=document.querySelector('[data-action=send-request]'); el.click(); el.click(); })()");
    await wait(450); const s=await state();
    assert(s.collaborationRequest.status==='PENDING' && s.collaborationRequest.sendAttempts===1 && s.requestHistory.length===0,'Duplicate send created a second request');
  }],
  ['A08-repeat-accept',async()=>{
    await pendingRequest(); await step('family-request','有 1 个待回复请求'); await step('open-family-request','张阿姨希望你陪同');
    await step('ask-accept-request','确认这次可以陪同？');
    await evaluate("(() => { const el=document.querySelector('[data-action=accept-request]'); el.click(); el.click(); })()");
    assert((await state()).collaborationRequest.status==='ACCEPTED' && (await state()).task.status==='CONFIRMED','Repeat acceptance mismatch');
  }],
  ['A12-back-draft',async()=>{
    await step('task-input','你想记什么事？'); await input('#task-input','我的草稿');
    await step('elder-home','输入尚未保存'); await step('task-input','你想记什么事？');
    assert(await evaluate("document.querySelector('#task-input').value==='我的草稿'"),'Back lost draft');
    await input('#task-input',''); await step('elder-home','输入尚未保存'); await step('task-input','你想记什么事？');
    assert(await evaluate("document.querySelector('#task-input').value===''"),'Cleared input replaced with default');
  }],
  ['A17-refresh-saved',async()=>{
    await pendingRequest(); await familyReply(); const before=await state();
    await evaluate('location.reload(); true'); await wait(400); const after=await state();
    assert(JSON.stringify(before)===JSON.stringify(after),'Refresh changed saved state');
    await step('elder-result','小梅答应陪你去');
  }],
  ['A17-refresh-sending',async()=>{
    await relationship(); await confirmed(); await sharePreview(); await step('send-request','正在发给小梅',0);
    await evaluate('location.reload(); true'); await wait(400);
    assert((await state()).currentView==='REQUEST_SEND_FAILED' && (await state()).collaborationRequest.status==='NONE','Interrupted send stuck or fake success');
    await step('send-request','正在发给小梅'); await wait(400);
    assert((await state()).collaborationRequest.status==='PENDING','Interrupted send cannot retry');
  }],
  ['proposal-elder-control',async()=>{
    await pendingRequest(); await step('family-request','有 1 个待回复请求'); await step('open-family-request','张阿姨希望你陪同');
    await step('ask-propose-change','建议改到下午 2:00？'); await step('propose-change','已建议下午 2:00');
    assert((await state()).task.details.time==='09:00','Family changed elder task'); await step('elder-change-proposed','由你决定是否修改');
    await step('reject-proposed-change','保留上午 9:00'); await step('role-family','有 1 个待回复请求');
    await step('open-family-request','张阿姨希望你陪同'); await step('ask-accept-request','确认这次可以陪同？'); await step('accept-request','已回复可以陪同');
  }],
  ['send-back-retry',async()=>{
    await relationship(); await confirmed(); await sharePreview(); await step('send-request','正在发给小梅',0);
    await step('start-share','这次小梅会看到',0); await wait(400);
    assert((await state()).collaborationRequest.status==='NONE','Returned send left pending or stuck');
    await step('send-request','正在发给小梅'); await wait(400); assert((await state()).collaborationRequest.status==='PENDING','Cannot retry after return');
  }],
];
const results = [];
await call('Page.enable');
await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await evaluate('location.reload(); true'); await wait(500);
for (const [id, run] of tests) {
  const start = trace.length;
  try {
    await reset(); await run(); await screenshot(id);
    results.push({id,status:'PASS',steps:trace.slice(start),finalState:await state(),screenshot:`${id}.png`});
    console.log(`${id} PASS`);
  } catch (error) {
    results.push({id,status:'FAIL',error:error.message,steps:trace.slice(start),finalState:await state()});
    await screenshot(`${id}-FAIL`); console.log(`${id} FAIL: ${error.message}`);
  }
}
const externalResources = await evaluate(`performance.getEntriesByType('resource').map(e=>e.name).filter(url=>new URL(url).origin!==location.origin)`);
const report = {testedAt:new Date().toISOString(),url:appUrl,viewport:'390x844',status:results.every(r=>r.status==='PASS') && externalResources.length===0 ? 'PASS':'FAIL',externalResources,results};
fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2)+'\n');
socket.close();
console.log(JSON.stringify({status:report.status,tests:results.map(({id,status})=>({id,status})),externalResources,output}));
if (report.status !== 'PASS') process.exitCode=1;
