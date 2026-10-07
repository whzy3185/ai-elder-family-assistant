import fs from 'node:fs';
import path from 'node:path';
import { FIXED_INPUT } from '../src/state/initial-state.js';

const appUrl = process.env.APP_URL || 'http://127.0.0.1:8080';
const endpoint = process.env.CDP_URL || 'http://127.0.0.1:9335';
const output = process.env.SCREENSHOT_DIR || 'artifacts/qa/prompt14-keyboard';
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
async function step(action, expected, delay=65) {
  let found=false;
  for(let i=0;i<80;i++){
    if(await evaluate(`document.activeElement?.dataset.action===${JSON.stringify(action)}`)){found=true;break;}
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  }
  assert(found,`Keyboard cannot reach ${action}`);
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
  await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await wait(delay);
  assert((await body()).includes(expected),`Keyboard action ${action} did not show ${expected}`);
  trace.push({action,expected,actualView:(await state()).currentView});
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
await call('Page.enable');
await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await evaluate('location.reload(); true');await wait(300);
await reset();await pendingRequest();await familyReply();await step('elder-result','小梅答应陪你去');
await step('trigger-reminder','该准备出发了');await step('ask-complete','这件事已经办完了吗？');await step('complete-task','这件事已完成');
const final=await state();assert(final.task.status==='COMPLETED'&&final.task.reminderAt===null,'Keyboard completion mismatch');
await screenshot('keyboard-completed');
fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({status:'PASS',testedAt:new Date().toISOString(),mode:'Tab and Enter for every button; preset input written into editable textarea',steps:trace,finalState:final},null,2)+'\n');
socket.close();console.log('Keyboard main flow PASS');
