import fs from 'node:fs';
import path from 'node:path';
import { FIXED_INPUT } from '../src/state/initial-state.js';

const appUrl = process.env.APP_URL || 'http://127.0.0.1:8080';
const endpoint = process.env.CDP_URL || 'http://127.0.0.1:9335';
const output = process.env.SCREENSHOT_DIR || 'artifacts/qa/prompt12-current';
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
  ['T01', async () => {
    await pendingRequest(); await familyReply();
    assert((await state()).task.status === 'CONFIRMED','Acceptance completed the task');
    await step('elder-result','小梅答应陪你去');
    await screenshot('T01-elder-accepted');
    await step('trigger-reminder','该准备出发了');
    await step('ask-complete','这件事已经办完了吗？');
    await step('complete-task','这件事已完成');
    const s = await state();
    assert(s.task.status === 'COMPLETED' && s.task.reminderAt === null && s.collaborationRequest.status === 'ACCEPTED','Completion mismatch');
  }],
  ['T02', async () => {
    await relationship(); await confirmed(); await step('keep-private','只提醒你自己');
    await step('family-request','暂时没有新请求');
    assert((await state()).collaborationRequest.sharedFields === null && !(await body()).includes('公交卡年审'),'Private task visible in family UI');
  }],
  ['T03', async () => {
    await pendingRequest(); await step('withdraw-request','确定撤回陪同请求');
    await step('confirm-withdraw-request','陪同请求已撤回');
    await step('family-request','原请求已结束'); await step('open-family-request','陪同请求已撤回');
    assert(!await evaluate('!!document.querySelector("[data-action=ask-accept-request]")'),'Withdrawn request still actionable');
    const s = await state();
    assert(s.task.status === 'CONFIRMED' && s.task.reminderAt.includes('08:30') && s.collaborationRequest.status === 'WITHDRAWN','Withdrawal removed reminder');
  }],
  ['T04', async () => {
    await pendingRequest(); await step('cancel-task','确定取消整件事');
    await step('confirm-cancel-task','这件事已取消');
    await step('family-request','原请求已结束'); await step('open-family-request','这件事已取消');
    const s = await state();
    assert(s.task.status === 'CANCELLED' && s.task.reminderAt === null && s.collaborationRequest.status === 'INVALIDATED','Cancellation mismatch');
    assert(!await evaluate('!!document.querySelector("[data-action=ask-accept-request]")'),'Cancelled request still actionable');
  }],
  ['T05', async () => {
    await pendingRequest(); await step('mark-no-response','小梅还没有回复');
    assert((await state()).collaborationRequest.response === null,'No response became acceptance');
    await screenshot('T05-no-response');
    await step('continue-waiting','已经发给小梅');
    assert((await state()).collaborationRequest.status === 'PENDING','Continue waiting mismatch');
  }],
  ['T06', async () => {
    await pendingRequest(); await familyReply('decline'); await step('elder-declined','小梅这次不能陪同');
    const s = await state();
    assert(s.task.status === 'CONFIRMED' && s.task.reminderAt.includes('08:30') && s.collaborationRequest.status === 'DECLINED','Decline cancelled task');
  }],
  ['T07', async () => {
    await step('task-input','你想记什么事？'); await input('#task-input', FIXED_INPUT);
    await step('simulate-parse-failure','这次没能整理出来');
    assert((await state()).task.rawInput === FIXED_INPUT,'AI failure lost raw input');
    await step('show-manual-form','手动填写这件事');
    await input('#manual-title','办理公交卡年审'); await input('#manual-time','09:00'); await input('#manual-location','社区服务中心');
    await step('manual-fill-task','再看一遍'); await step('confirm-task','这件事已记好');
    assert((await state()).task.rawInput === FIXED_INPUT && (await state()).task.status === 'CONFIRMED','Manual recovery failed');
  }],
  ['T08', async () => {
    await relationship(); await confirmed(); await sharePreview();
    await step('simulate-send-failure','这次没有发出去'); await screenshot('T08-send-failure');
    await step('role-family','暂时没有新请求');
    assert(!(await body()).includes('公交卡年审'),'Failed send leaked task');
    await step('role-elder','今天要记什么事？'); await step('saved-task','这件事已记好'); await send();
    const s = await state();
    assert(s.collaborationRequest.sendAttempts === 2 && s.requestHistory.length === 0 && s.task.reminderAt.includes('08:30'),'Retry duplicated or lost task');
    await step('family-request','有 1 个待回复请求');
  }],
  ['T09', async () => {
    await pendingRequest(); await familyReply(); await step('elder-result','小梅答应陪你去');
    await step('start-post-accept-edit','修改已保存的时间'); await step('continue-post-edit','把时间改到下午 2:00？'); await step('confirm-post-accept-change','旧答复已失效；尚未重新发送');
    let s = await state();
    assert(s.task.version === 2 && s.task.details.time === '14:00' && s.task.reminderAt.includes('13:30') && s.collaborationRequest.status === 'INVALIDATED','Old acceptance inherited or automatic send');
    await screenshot('T09-before-renewed-consent');
    await sharePreview(); assert((await body()).includes('下午 2:00'),'Preview retained old time');
    await step('send-request','正在发给小梅'); await wait(400);
    await step('family-request','有 1 个待回复请求'); await step('open-family-request','张阿姨希望你陪同');
    s = await state();
    assert((await body()).includes('下午 2:00') && !(await body()).includes('下午 1:30'),'Family sees wrong time or private reminder');
    assert(s.collaborationRequest.status === 'PENDING' && s.collaborationRequest.taskVersion === 2 && s.collaborationRequest.response === null && s.requestHistory.length === 1 && s.requestHistory[0].status === 'INVALIDATED','New request version mismatch');
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
