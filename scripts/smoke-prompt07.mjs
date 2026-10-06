import fs from 'node:fs';
import path from 'node:path';

const endpoint = process.env.CDP_URL || 'http://127.0.0.1:9334';
const pages = await fetch(`${endpoint}/json/list`).then(response => response.json());
const page = pages.find(item => item.type === 'page' && item.url.startsWith('http://127.0.0.1:4173'));
if (!page) throw new Error('Prototype page not found');

const socket = new WebSocket(page.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
});
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

function call(method, params = {}) {
  const id = ++sequence;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise(resolve => pending.set(id, resolve));
}

async function evaluate(expression) {
  const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.error || response.result?.exceptionDetails) throw new Error(JSON.stringify(response));
  return response.result.result.value;
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const textIncludes = text => evaluate(`document.body.innerText.includes(${JSON.stringify(text)})`);
const click = action => evaluate(`(() => { const node=document.querySelector('[data-action="${action}"]'); if(!node) return false; node.click(); return true; })()`);
const assert = (condition, message) => { if (!condition) throw new Error(message); };

await call('Page.enable');
await evaluate(`localStorage.clear(); location.reload(); true`);
await wait(500);
assert(await textIncludes('今天要记什么事？'), 'Home page did not load');
assert(await click('task-input'), 'Task input entry missing');
await wait(80);
assert(await textIncludes('你想记什么事？'), 'Task input page missing');
assert(await click('submit-task'), 'Submit action missing');
await wait(80);
assert(await textIncludes('正在帮你整理'), 'Processing state missing');
await wait(600);
assert(await textIncludes('看看我理解得对不对'), 'Confirmation page missing');
assert(await textIncludes('上午 8:30'), 'Synchronized reminder missing');
assert(await click('confirm-task'), 'Confirm task action missing');
await wait(80);
assert(await textIncludes('这件事已记好'), 'Saved result missing');

await call('Page.reload', { ignoreCache: true });
await wait(500);
assert(await textIncludes('这件事已记好'), 'Saved result did not persist after refresh');
assert(await click('role-family'), 'Family role switch missing');
await wait(80);
assert(await textIncludes('暂时没有新请求'), 'Family empty request state missing');

const state = await evaluate(`JSON.parse(localStorage.getItem('elder-family-assistant/state/v1'))`);
assert(state.task.status === 'CONFIRMED', 'Shared task state changed after role switch');
assert(state.currentRole === 'FAMILY', 'Current role was not persisted');

await click('role-elder');
await wait(80);
const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
const output = path.resolve('artifacts', 'qa', 'prompt07-main-flow.png');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, Buffer.from(screenshot.result.data, 'base64'));

socket.close();
console.log(JSON.stringify({ status: 'PASS', steps: 10, persistedTask: state.task.status, screenshot: output }));
