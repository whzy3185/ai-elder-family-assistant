const endpoint = process.env.CDP_URL || 'http://127.0.0.1:9333';
const pages = await fetch(`${endpoint}/json/list`).then(response => response.json());
const page = pages.find(item => item.type === 'page' && item.url.includes('local-prototype/index.html'));
if (!page) throw new Error('Local prototype page not found');

const socket = new WebSocket(page.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  pending.get(message.id)(message);
  pending.delete(message.id);
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

const expression = `(() => {
  const issues = [];
  const rows = [...document.querySelectorAll('.screen-wrap')].map(wrap => {
    const screen = wrap.querySelector('.screen');
    const rect = screen.getBoundingClientRect();
    const font = getComputedStyle(screen).fontFamily;
    const controls = [...screen.querySelectorAll('.action')];
    const internals = [...screen.querySelectorAll('.card, .field')];
    const id = wrap.id;
    if (Math.round(rect.width) !== 390 || Math.round(rect.height) !== 844) issues.push({ id, type: 'viewport', width: rect.width, height: rect.height });
    if (screen.scrollHeight > screen.clientHeight + 1) issues.push({ id, type: 'screen-overflow', scrollHeight: screen.scrollHeight, clientHeight: screen.clientHeight });
    for (const node of internals) if (node.scrollHeight > node.clientHeight + 1) issues.push({ id, type: 'internal-overflow', className: node.className, scrollHeight: node.scrollHeight, clientHeight: node.clientHeight });
    for (const node of controls) if (node.getBoundingClientRect().height < 56) issues.push({ id, type: 'short-control', height: node.getBoundingClientRect().height });
    if (!font.includes('Noto Sans SC')) issues.push({ id, type: 'font', font });
    if (!controls.length) issues.push({ id, type: 'no-next-step' });
    return { id, controlCount: controls.length, width: rect.width, height: rect.height };
  });
  const ids = rows.map(row => row.id);
  return { screenCount: rows.length, uniqueCount: new Set(ids).size, issues, rows };
})()`;

const response = await call('Runtime.evaluate', { expression, returnByValue: true });
socket.close();
if (response.error || response.result?.exceptionDetails) throw new Error(JSON.stringify(response));
const audit = response.result.result.value;
console.log(JSON.stringify(audit, null, 2));
if (audit.screenCount !== 65 || audit.uniqueCount !== 65 || audit.issues.length) process.exitCode = 1;
