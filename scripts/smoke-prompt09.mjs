import fs from 'node:fs';
import path from 'node:path';

const endpoint = process.env.CDP_URL || 'http://127.0.0.1:9336';
const appUrl = process.env.APP_URL || 'http://127.0.0.1:4173';
const screenshotDir = process.env.SCREENSHOT_DIR || path.join('artifacts', 'qa', 'prompt09');
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
async function step(action, expected, delay = 60) { assert(await click(action), `Missing action: ${action}`); await wait(delay); assert((await bodyText()).includes(expected), `Expected after ${action}: ${expected}`); }
async function reset() { await evaluate('localStorage.clear(); location.reload(); true'); await wait(300); }
async function screenshot(name) {
  const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const output = path.resolve(screenshotDir, `${name}.png`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, Buffer.from(shot.result.data, 'base64'));
}
async function establishRelationship() {
  await step('relationship', '邀请小梅建立家庭协作');
  await step('show-qr', '二维码已准备好');
  await step('family-relationship', '扫描张阿姨的二维码');
  await step('family-scan', '正在等张阿姨确认');
  await step('elder-relationship', '小梅想和你建立协作');
  await step('establish-relationship', '已建立家庭协作');
  await step('elder-home', '今天要记什么事？');
}
async function saveCorrectedTask() {
  await step('task-input', '你想记什么事？');
  await step('submit-task', '正在帮你整理');
  await wait(520);
  assert((await bodyText()).includes('时间可能不对'), 'Expected recognition error');
  await step('edit-time', '改成几点？');
  await step('set-time-nine', '再看一遍');
  await step('confirm-task', '这件事已记好');
}
async function createPendingRequest() {
  await establishRelationship();
  await saveCorrectedTask();
  await step('start-share', '这次小梅会看到');
  await step('send-request', '已经发给小梅');
}

await call('Page.enable');
await wait(300);
const passed = [];

// A — decline relationship, then save private reminder.
await reset();
await step('relationship', '邀请小梅建立家庭协作');
await step('show-qr', '二维码已准备好');
await step('family-relationship', '扫描张阿姨的二维码');
await step('family-scan', '正在等张阿姨确认');
await step('elder-relationship', '小梅想和你建立协作');
await step('decline-relationship', '仍可使用个人提醒');
await step('task-input', '你想记什么事？');
await step('submit-task', '正在帮你整理'); await wait(520);
await step('edit-time', '改成几点？'); await step('set-time-nine', '再看一遍'); await step('confirm-task', '个人提醒已保存');
let current = await state();
assert(current.relationship.status === 'DECLINED' && current.task.status === 'CONFIRMED', 'Scenario A state mismatch');
await screenshot('A-relationship-declined-private-reminder'); passed.push('A');

// B — keep private, family sees nothing.
await reset(); await establishRelationship(); await saveCorrectedTask();
await step('keep-private', '只提醒你自己');
await step('family-request', '暂时没有新请求');
current = await state(); assert(current.collaborationRequest.status === 'NONE', 'Scenario B leaked a request');
await screenshot('B-private-only-family-empty'); passed.push('B');

// C — missing fields, fill and continue.
await reset(); await step('task-input', '你想记什么事？');
await step('simulate-missing', '还缺两项信息');
await step('fill-missing', '再看一遍');
await step('confirm-task', '这件事已记好');
current = await state(); assert(current.task.status === 'CONFIRMED', 'Scenario C did not recover');
await screenshot('C-missing-fields-recovered'); passed.push('C');

// D — parse failure, preserve input, manual form, continue.
await reset(); await step('task-input', '你想记什么事？');
await step('simulate-parse-failure', '原话已经保留');
const rawBeforeManual = (await state()).task.rawInput;
await step('show-manual-form', '手动填写这件事');
await step('manual-fill-task', '再看一遍');
await step('confirm-task', '这件事已记好');
current = await state(); assert(current.task.rawInput === rawBeforeManual && current.task.status === 'CONFIRMED', 'Scenario D lost raw input or did not recover');
await screenshot('D-parse-failure-manual-recovered'); passed.push('D');

// E — first send fails, retry yields one request.
await reset(); await establishRelationship(); await saveCorrectedTask();
await step('start-share', '这次小梅会看到');
await step('simulate-send-failure', '这次没有发出去');
current = await state(); assert(current.collaborationRequest.status === 'NONE' && current.task.reminderAt, 'Scenario E failure state mismatch');
await step('send-request', '已经发给小梅');
current = await state(); assert(current.collaborationRequest.status === 'PENDING' && current.requestHistory.length === 0, 'Scenario E retry duplicated request');
await screenshot('E-send-retry-single-request'); passed.push('E');

// F and I — no response, continue waiting, then withdraw; family cannot answer.
await reset(); await createPendingRequest();
await step('mark-no-response', '小梅还没有回复');
await step('continue-waiting', '已经发给小梅');
await step('mark-no-response', '小梅还没有回复');
await step('withdraw-request', '确定撤回陪同请求');
await step('confirm-withdraw-request', '陪同请求已撤回');
await step('family-request', '原请求已结束');
await step('open-family-request', '这条请求不能再回应');
current = await state(); assert(current.collaborationRequest.status === 'WITHDRAWN' && current.task.reminderAt, 'Scenario F/I mismatch');
await screenshot('F-I-no-response-withdrawn'); passed.push('F', 'I');

// G — family declines, task remains.
await reset(); await createPendingRequest();
await step('family-request', '有 1 个待回复请求');
await step('open-family-request', '张阿姨希望你陪同');
await step('decline-request', '已回复不能陪同');
await step('elder-declined', '小梅这次不能陪同');
current = await state(); assert(current.task.status === 'CONFIRMED' && current.task.reminderAt, 'Scenario G cancelled task');
await screenshot('G-family-declined-task-kept'); passed.push('G');

// H1 — proposal rejected, original time remains.
await reset(); await createPendingRequest();
await step('family-request', '有 1 个待回复请求'); await step('open-family-request', '张阿姨希望你陪同');
await step('propose-change', '已建议下午 2:00'); await step('elder-change-proposed', '由你决定是否修改');
await step('reject-proposed-change', '保留上午 9:00');
current = await state(); assert(current.task.details.time === '09:00', 'Scenario H reject changed time');
await screenshot('H1-change-rejected-original-time');

// H2 — proposal accepted, elder changes time.
await reset(); await createPendingRequest();
await step('family-request', '有 1 个待回复请求'); await step('open-family-request', '张阿姨希望你陪同');
await step('propose-change', '已建议下午 2:00'); await step('elder-change-proposed', '由你决定是否修改');
await step('accept-proposed-change', '已改到下午 2:00');
current = await state(); assert(current.task.details.time === '14:00' && current.task.reminderAt.includes('13:30'), 'Scenario H accept did not change time');
await screenshot('H2-change-accepted-by-elder'); passed.push('H');

// J — cancel entire task and block family response.
await reset(); await createPendingRequest();
await step('cancel-task', '确定取消整件事');
await step('confirm-cancel-task', '这件事已取消');
await step('family-request', '原请求已结束');
await step('open-family-request', '这条请求不能再回应');
current = await state(); assert(current.task.status === 'CANCELLED' && current.task.reminderAt === null && current.collaborationRequest.status === 'INVALIDATED', 'Scenario J mismatch');
await screenshot('J-task-cancelled-request-invalidated'); passed.push('J');

// K — accepted request, elder changes time, old acceptance invalidated, new pending.
await reset(); await createPendingRequest();
await step('family-request', '有 1 个待回复请求'); await step('open-family-request', '张阿姨希望你陪同');
await step('accept-request', '已回复可以陪同'); await step('elder-result', '小梅答应陪你去');
await step('start-post-accept-edit', '旧陪同答复不会自动继承');
await step('confirm-post-accept-change', '旧接受已失效');
await step('family-request', '有 1 个待回复请求');
current = await state();
assert(current.task.version === 2 && current.collaborationRequest.status === 'PENDING' && current.requestHistory[0].status === 'INVALIDATED', 'Scenario K versioning mismatch');
assert(current.collaborationRequest.sharedFields.time === '14:00' && current.collaborationRequest.response === null, 'Scenario K inherited old response');
await screenshot('K-old-acceptance-invalidated-new-pending'); passed.push('K');

socket.close();
console.log(JSON.stringify({ status: 'PASS', scenarios: passed, count: passed.length, screenshots: path.resolve(screenshotDir) }));
