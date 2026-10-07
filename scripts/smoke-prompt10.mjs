import fs from 'node:fs';
import path from 'node:path';

const endpoint = process.env.CDP_URL || 'http://127.0.0.1:9337';
const appUrl = process.env.APP_URL || 'http://127.0.0.1:4173';
const pages = await fetch(`${endpoint}/json/list`).then(response => response.json());
const page = pages.find(item => item.type === 'page' && item.url.startsWith(appUrl));
if (!page) throw new Error('Prototype page not found');
const socket = new WebSocket(page.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
});
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
function call(method, params = {}) { const id = ++sequence; socket.send(JSON.stringify({ id, method, params })); return new Promise(resolve => pending.set(id, resolve)); }
async function evaluate(expression) { const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (response.error || response.result?.exceptionDetails) throw new Error(JSON.stringify(response)); return response.result.result.value; }
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const bodyText = () => evaluate('document.body.innerText');
const state = () => evaluate(`JSON.parse(localStorage.getItem('elder-family-assistant/state/v1'))`);
async function click(action) { return evaluate(`(() => { const node=document.querySelector('[data-action="${action}"]'); if(!node) return false; node.click(); return true; })()`); }
async function step(action, expected) { assert(await click(action), `Missing action: ${action}`); await wait(80); assert((await bodyText()).includes(expected), `Expected after ${action}: ${expected}`); }
async function openDemo() { await step('demo', '演示控制，不属于老人真实产品功能'); }
async function loadScenario(id, expectedText, expectedState) {
  const loaded = await evaluate(`(() => { const node=document.querySelector('[data-action="load-demo-scenario"][data-scenario="${id}"]'); if(!node) return false; node.click(); return true; })()`);
  assert(loaded, `Missing scenario: ${id}`);
  await wait(80);
  assert((await bodyText()).includes(expectedText), `Scenario ${id} did not render ${expectedText}`);
  const snapshot = await state();
  assert(snapshot.demoScenario === id, `Scenario id mismatch for ${id}`);
  assert(snapshot.requestHistory.length === 0, `Prior request history leaked into ${id}`);
  for (const [key, value] of Object.entries(expectedState)) {
    const actual = key.split('.').reduce((current, segment) => current?.[segment], snapshot);
    assert(actual === value, `Scenario ${id}: ${key} expected ${value}, got ${actual}`);
  }
}

await call('Page.enable');
await wait(300);
await evaluate('localStorage.clear(); location.reload(); true');
await wait(300);
await openDemo();
const controllerText = await bodyText();
assert(controllerText.includes('Fixed Demo Clock') && controllerText.includes('Reset All Demo Data'), 'Controller controls missing');

const controllerShot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
const controllerOutput = path.resolve(process.env.SCREENSHOT_OUTPUT || path.join('artifacts', 'qa', 'prompt10-demo-controller.png'));
fs.mkdirSync(path.dirname(controllerOutput), { recursive: true });
fs.writeFileSync(controllerOutput, Buffer.from(controllerShot.result.data, 'base64'));

const scenarios = [
  ['INITIAL', '今天要记什么事？', { 'task.status': 'EMPTY', 'relationship.status': 'UNLINKED' }],
  ['MAIN_FLOW', '这件事已记好', { 'task.status': 'CONFIRMED', 'collaborationRequest.status': 'NONE' }],
  ['RECOGNITION_ERROR', '时间可能不对', { 'task.details.time': '08:00' }],
  ['MISSING_INFORMATION', '还缺两项信息', { 'task.status': 'MISSING_REQUIRED' }],
  ['AI_FAILURE', '这次没能整理出来', { 'task.status': 'PARSE_FAILED' }],
  ['SEND_FAILURE', '这次没有发出去', { 'collaborationRequest.status': 'NONE', 'collaborationRequest.sendAttempts': 1 }],
  ['PENDING_FAMILY', '张阿姨希望你陪同', { 'currentRole': 'FAMILY', 'collaborationRequest.status': 'PENDING' }],
  ['ACCEPTED', '小梅答应陪你去', { 'collaborationRequest.status': 'ACCEPTED', 'task.status': 'CONFIRMED' }],
  ['DECLINED', '小梅这次不能陪同', { 'collaborationRequest.status': 'DECLINED' }],
  ['CHANGE_PROPOSED', '小梅建议改到下午 2:00', { 'task.details.time': '09:00', 'collaborationRequest.status': 'CHANGE_PROPOSED' }],
  ['WITHDRAWN', '陪同请求已撤回', { 'collaborationRequest.status': 'WITHDRAWN', 'task.status': 'CONFIRMED' }],
  ['CANCELLED', '这件事已取消', { 'task.status': 'CANCELLED', 'task.reminderAt': null, 'collaborationRequest.status': 'INVALIDATED' }],
  ['REMINDER_TRIGGER', '该准备出发了', { 'demoClock': '2026-10-07T08:30:00+08:00', 'task.status': 'CONFIRMED' }],
];

for (const [id, text, expected] of scenarios) {
  await loadScenario(id, text, expected);
  await openDemo();
}

await step('role-family', '张阿姨的协作请求');
assert((await state()).currentRole === 'FAMILY', 'Family role shortcut failed');
await openDemo();
await step('role-elder', '今天要记什么事？');
assert((await state()).currentRole === 'ELDER', 'Elder role shortcut failed');
await openDemo();
await loadScenario('ACCEPTED', '小梅答应陪你去', { 'collaborationRequest.status': 'ACCEPTED' });
await openDemo();
await step('reset', '今天要记什么事？');
const resetState = await state();
assert(resetState.demoScenario === 'NORMAL' && resetState.task.status === 'EMPTY' && resetState.relationship.status === 'UNLINKED', 'Reset did not restore initial state');

socket.close();
console.log(JSON.stringify({ status: 'PASS', scenarios: scenarios.length, roleShortcuts: 2, reset: true, screenshot: controllerOutput }));
