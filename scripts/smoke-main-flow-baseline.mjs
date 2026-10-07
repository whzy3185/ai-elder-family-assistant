import fs from 'node:fs';
import path from 'node:path';

const endpoint = process.env.CDP_URL || 'http://127.0.0.1:9335';
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
const text = () => evaluate('document.body.innerText');
const click = action => evaluate(`(() => { const node=document.querySelector('[data-action="${action}"]'); if(!node) return false; node.click(); return true; })()`);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
async function step(action, expected, delay = 70) { assert(await click(action), `Missing action: ${action}`); await wait(delay); const body = await text(); assert(body.includes(expected), `Expected after ${action}: ${expected}`); }

await call('Page.enable');
await wait(500);
await evaluate('localStorage.clear(); location.reload(); true');
await wait(450);
await step('relationship', '邀请小梅建立家庭协作');
await step('show-qr', '二维码已准备好');
await step('family-relationship', '扫描张阿姨的二维码');
await step('family-scan', '正在等张阿姨确认');
await step('elder-relationship', '小梅想和你建立协作');
await step('establish-relationship', '已建立家庭协作');
await step('elder-home', '今天要记什么事？');
await step('task-input', '你想记什么事？');
await step('submit-task', '正在帮你整理');
await wait(520);
let body = await text();
assert(body.includes('时间可能不对') && body.includes('上午 8:00') && body.includes('上午 7:30'), 'Fixed recognition error is inconsistent');
await step('edit-time', '改成几点？');
await step('set-time-nine', '再看一遍');
body = await text();
assert(body.includes('上午 9:00') && body.includes('上午 8:30'), 'Corrected task and reminder are inconsistent');
await step('confirm-task', '这件事已记好');
await step('start-share', '这次小梅会看到');
body = await text();
assert(!body.includes('上午 8:30'), 'Private reminder leaked into share review');
await step('send-request', '已经发给小梅');
await step('family-request', '有 1 个待回复请求');
await step('open-family-request', '张阿姨希望你陪同');
body = await text();
assert(body.includes('上午 9:00') && !body.includes('上午 8:30'), 'Family did not receive final time or saw private reminder');
await step('accept-request', '已回复可以陪同');
let state = await evaluate(`JSON.parse(localStorage.getItem('elder-family-assistant/state/v1'))`);
assert(state.collaborationRequest.status === 'ACCEPTED', 'Request was not accepted');
assert(state.task.status === 'CONFIRMED', 'Accepted request incorrectly completed task');
await step('elder-result', '小梅答应陪你去');
await step('trigger-reminder', '该准备出发了');
await step('ask-complete', '这件事已经办完了吗？');
await step('complete-task', '这件事已完成');
state = await evaluate(`JSON.parse(localStorage.getItem('elder-family-assistant/state/v1'))`);
assert(state.task.status === 'COMPLETED', 'Elder completion did not complete task');
assert(state.currentRole === 'ELDER', 'Task completion was not performed by elder role');
const externalResources = await evaluate(`performance.getEntriesByType('resource').map(entry => entry.name).filter(url => new URL(url).origin !== location.origin)`);
assert(externalResources.length === 0, `Unexpected external runtime requests: ${externalResources.join(', ')}`);

const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
const output = path.resolve(process.env.SCREENSHOT_OUTPUT || path.join('artifacts', 'qa', 'main-flow-completed-baseline.png'));
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, Buffer.from(screenshot.result.data, 'base64'));
socket.close();
console.log(JSON.stringify({ status: 'PASS', steps: 23, taskStatus: state.task.status, requestStatus: state.collaborationRequest.status, externalRequests: externalResources.length, screenshot: output }));
