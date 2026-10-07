import { DEMO_SCENARIOS, FIXED_INPUT } from './state/initial-state.js';

const escapeHtml = value => String(value ?? '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
const roleLabel = role => role === 'FAMILY' ? '家属端 · 小梅' : '老人端 · 张阿姨';
const displayTime = value => value === '14:00' ? '下午 2:00' : value === '09:00' ? '上午 9:00' : value === '08:00' ? '上午 8:00' : value || '未填写';
const displayReminder = value => value?.includes('13:30') ? '下午 1:30' : value?.includes('08:30') ? '上午 8:30' : value?.includes('07:30') ? '上午 7:30' : '未设置';

function page(title, status, body, actions = '') {
  return `<section class="page"><h1>${title}</h1><p class="status">${status}</p>${body}<div class="page-actions">${actions}</div></section>`;
}
function button(label, action, style = 'primary') { return `<button class="button ${style}" type="button" data-action="${action}">${label}</button>`; }
function card(title, body, className = '') { return `<article class="card ${className}"><h2>${title}</h2><p>${body}</p></article>`; }
function fields(rows) { return `<dl class="details">${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>`; }

function taskConfirmation(state) {
  const d = state.task.details;
  const corrected = state.task.wasCorrected;
  return page(corrected ? '再看一遍' : '时间可能不对', corrected ? '确认后才会记好' : '识别错误', `${card(corrected ? '最终安排' : '你刚才说', corrected ? `明天${displayTime(d.time)}去${d.location}办理公交卡年审。` : `你说的是上午 9:00；系统暂时整理成了${displayTime(d.time)}。`)}${fields([['事情', d.title], ['时间', displayTime(d.time)], ['地点', d.location], ['提醒', displayReminder(state.task.reminderAt)]])}<p class="hint">${corrected ? '确认以后只保存个人事务和提醒，还不会告诉小梅。' : '请先修正时间；提醒时间会自动同步。'}</p>`, corrected ? button('确认记好', 'confirm-task') + button('返回修改', 'edit-time', 'secondary') : button('改时间', 'edit-time') + button('返回输入', 'task-input', 'secondary'));
}

function elderView(state) {
  const d = state.task.details;
  switch (state.currentView) {
    case 'TASK_INPUT': return page('你想记什么事？', '等待输入', `<label class="input-label" for="task-input">可以说，也可以手动填写</label><textarea id="task-input" data-test="task-input">${escapeHtml(state.task.rawInput || FIXED_INPUT)}</textarea><p class="hint">演示使用预置内容，不会调用真实语音或 AI。</p>`, button('帮我整理', 'submit-task') + button('演示信息缺失', 'simulate-missing', 'secondary') + button('演示无法整理', 'simulate-parse-failure', 'secondary'));
    case 'TASK_PROCESSING': return page('正在帮你整理', '处理中', `${card('你刚才说', escapeHtml(state.task.rawInput))}<p class="hint">这里只整理当前输入，不会创建事务或通知家属。</p>`, button('立即显示结果', 'finish-parsing', 'secondary'));
    case 'TASK_MISSING': return page('还缺两项信息', '没有替你猜', `${card('已经听清', '事情：办理公交卡年审<br>日期：明天')}${fields([['时间', '还没说'], ['地点', '还没说']])}<p class="hint">补齐以后才能继续确认。</p>`, button('补为上午 9:00、社区服务中心', 'fill-missing') + button('返回重新说', 'task-input', 'secondary'));
    case 'TASK_PARSE_FAILED': return page('这次没能整理出来', '原话已经保留', `${card('你的原话', escapeHtml(state.task.rawInput))}<p class="hint">不会丢掉内容，也不会擅自创建事务。</p>`, button('改为手动填写', 'show-manual-form') + button('返回重新说', 'task-input', 'secondary'));
    case 'TASK_MANUAL_FORM': return page('手动填写这件事', '不用再说一遍', `${fields([['事情', '办理公交卡年审'], ['日期', '明天（10 月 7 日）'], ['时间', '上午 9:00'], ['地点', '社区服务中心'], ['提醒', '提前 30 分钟']])}<p class="hint">原输入仍保留，仅用表单补全结构化内容。</p>`, button('填好了，继续确认', 'manual-fill-task') + button('返回原话', 'parse-failed', 'secondary'));
    case 'TASK_CONFIRM': return taskConfirmation(state);
    case 'TASK_EDIT_TIME': return page('改成几点？', '只修改时间', `${card('其他内容保持不变', '事项、日期、地点和家属意图都不会改变。')}${fields([['当前', displayTime(d.time)], ['改为', '上午 9:00'], ['提醒将变为', '上午 8:30']])}`, button('改成上午 9:00', 'set-time-nine') + button('不改了', 'back-confirm', 'secondary'));
    case 'TASK_SAVED': return page('这件事已记好', '个人提醒已保存', `${card(`${displayTime(d.time)} · ${d.title}`, `明天去${d.location}。`, 'success-card')}<div class="notice"><strong>提醒：</strong>${displayReminder(state.task.reminderAt)}<br><strong>家属：</strong>还没有告诉小梅</div>`, state.relationship.status === 'ACTIVE' ? button('请小梅陪同', 'start-share') + button('只提醒我自己', 'keep-private', 'secondary') + button('取消整件事', 'cancel-task', 'danger') : button('先建立家庭协作', 'relationship') + button('只提醒我自己', 'keep-private', 'secondary') + button('取消整件事', 'cancel-task', 'danger'));
    case 'PRIVATE_ONLY': return page('只提醒你自己', '没有告诉小梅', `${card(`${displayTime(d.time)} · ${d.title}`, `${displayReminder(state.task.reminderAt)}提醒仍然有效。`, 'success-card')}<p class="hint">家属端没有生成任何请求，也看不到这件事。</p>`, button('查看小梅端', 'family-request') + button('返回首页', 'elder-home', 'secondary'));
    case 'SHARE_REVIEW': return page('这次小梅会看到', '等待你确认共享', `${card('只分享这五项', '不会分享提醒时间、语音原话、位置或其他事务。')}${fields([['事情', d.title], ['日期', '明天（10 月 7 日）'], ['时间', displayTime(d.time)], ['地点', d.location], ['希望她', '陪同']])}`, button('发给小梅', 'send-request') + button('演示发送失败', 'simulate-send-failure', 'secondary') + button('暂不发送', 'saved-task', 'secondary'));
    case 'REQUEST_SEND_FAILED': return page('这次没有发出去', '可以重试', `${card('个人事务没有受影响', `${displayReminder(state.task.reminderAt)}的提醒仍然存在。`)}<div class="notice">小梅端没有请求；重试成功后只会生成一条。</div>`, button('重新发送', 'send-request') + button('暂不发送', 'saved-task', 'secondary'));
    case 'REQUEST_SENT': return page('已经发给小梅', '等待回应', `${card(`${d.title} · ${displayTime(d.time)}`, '请求已经送出；个人提醒仍然有效。')}<div class="notice">接下来可以切换到小梅端回应，或演示暂未回应。</div>`, button('切换到小梅端', 'family-request') + button('演示还未回应', 'mark-no-response', 'secondary') + button('撤回陪同请求', 'withdraw-request', 'danger') + button('取消整件事', 'cancel-task', 'danger'));
    case 'REQUEST_NO_RESPONSE': return page('小梅还没有回复', '未回应不等于拒绝', `${card('你的事务照常保留', `${displayReminder(state.task.reminderAt)}仍会提醒你。`)}<p class="hint">你可以继续等，也可以只撤回陪同请求。</p>`, button('继续等一等', 'continue-waiting') + button('撤回陪同请求', 'withdraw-request', 'danger'));
    case 'REQUEST_WITHDRAW_CONFIRM': return page('确定撤回陪同请求？', '只撤回协作', `${card('不会取消你的事务', `${displayTime(d.time)}的事务和${displayReminder(state.task.reminderAt)}提醒都会保留。`)}<p class="hint">撤回后，小梅不能再回应这条请求。</p>`, button('确认撤回请求', 'confirm-withdraw-request', 'danger') + button('继续等待', 'continue-waiting', 'secondary'));
    case 'REQUEST_WITHDRAWN': return page('陪同请求已撤回', '个人提醒仍然有效', `${card(d.title, `${displayTime(d.time)}的事务没有取消，${displayReminder(state.task.reminderAt)}仍会提醒。`, 'success-card')}<p class="hint">小梅不能再回应这条请求。</p>`, button('查看小梅端', 'family-request') + button('返回首页', 'elder-home', 'secondary'));
    case 'ELDER_ACCEPTED': return page('小梅答应陪你去', '已接受陪同请求', `${card('协作结果', `小梅会在明天${displayTime(d.time)}陪你去${d.location}。`, 'success-card')}<p class="hint">陪同请求已接受，但公交卡年审还没有完成。</p>`, button('修改时间', 'start-post-accept-edit', 'secondary') + button('模拟到提醒时间', 'trigger-reminder') + button('取消整件事', 'cancel-task', 'danger'));
    case 'ELDER_DECLINED': return page('小梅这次不能陪同', '你的事务继续', `${card(d.title, `${displayTime(d.time)}照常办理，${displayReminder(state.task.reminderAt)}仍会提醒。`)}<p class="hint">家属拒绝没有取消你的事务。</p>`, button('返回首页', 'elder-home'));
    case 'ELDER_CHANGE_PROPOSED': return page('小梅建议改到下午 2:00', '由你决定是否修改', `${card('当前安排', `${displayTime(d.time)} · ${d.location}`)}<p class="hint">小梅不能直接修改你的事务。</p>`, button('接受，改到下午 2:00', 'accept-proposed-change') + button('不改，仍是上午 9:00', 'reject-proposed-change', 'secondary'));
    case 'CHANGE_ACCEPTED': return page('已改到下午 2:00', '由张阿姨确认修改', `${card(d.title, `${displayTime(d.time)}办理，${displayReminder(state.task.reminderAt)}提醒。`, 'success-card')}`, button('返回首页', 'elder-home'));
    case 'CHANGE_REJECTED': return page('保留上午 9:00', '没有修改你的事务', `${card(d.title, `${displayTime(d.time)}办理，${displayReminder(state.task.reminderAt)}提醒。`, 'success-card')}`, button('返回首页', 'elder-home'));
    case 'POST_ACCEPT_EDIT': return page('把时间改到下午 2:00？', '旧陪同答复不会自动继承', `${fields([['原时间', displayTime(d.time)], ['新时间', '下午 2:00'], ['新提醒', '下午 1:30']])}<p class="hint">确认后旧请求会失效，并给小梅生成一条新的待回复请求。</p>`, button('确认修改并重新询问', 'confirm-post-accept-change') + button('不修改', 'elder-result', 'secondary'));
    case 'POST_ACCEPT_CHANGED': return page('时间已改，正在等新回复', '旧接受已失效', `${card('新安排', `明天${displayTime(d.time)} · ${d.location}`)}${fields([['旧请求', '已失效'], ['新请求', '等待小梅回复'], ['提醒', displayReminder(state.task.reminderAt)]])}`, button('切换到小梅端', 'family-request'));
    case 'TASK_CANCELLED': return page('这件事已取消', '提醒和协作请求均已失效', `${card(d?.title || '公交卡年审', '不会再提醒；小梅不能继续回应原请求。')}<p class="hint">取消整件事不同于只撤回陪同请求。</p>`, button('查看小梅端', 'family-request') + button('返回首页', 'elder-home', 'secondary'));
    case 'TASK_CANCEL_CONFIRM': return page('确定取消整件事？', '这会同时停止提醒和协作', `${card(d.title, `${displayTime(d.time)}的事务将取消，${displayReminder(state.task.reminderAt)}提醒也会停止。`)}<p class="hint">如果只是不需要陪同，请改为撤回陪同请求。</p>`, button('确认取消整件事', 'confirm-cancel-task', 'danger') + button('先不取消', 'cancel-task-back', 'secondary'));
    case 'RELATIONSHIP_DECLINED': return page('暂不建立家庭协作', '仍可使用个人提醒', `${card('没有共享任何信息', '小梅看不到你的事务；你仍然可以正常记事和设置提醒。')}`, button('继续记事', 'task-input') + button('返回首页', 'elder-home', 'secondary'));
    case 'TASK_REMINDER': return page('该准备出发了', '提醒已触发', `${card(`今天${displayTime(d.time)}`, `去${d.location}${d.title}。`)}<div class="notice">小梅已答应陪同。</div>`, button('知道了，去办事', 'ask-complete'));
    case 'TASK_COMPLETE_CONFIRM': return page('这件事已经办完了吗？', '需要你确认', card('确认完成', '只有现实中的公交卡年审已经办完，才选择完成。'), button('这件事办完了', 'complete-task') + button('还没有', 'reminder-view', 'secondary'));
    case 'TASK_COMPLETED': return page('这件事已完成', '由张阿姨确认完成', `${card(d.title, '提醒已停止；小梅此前的陪同回应保留为结果记录。', 'success-card')}<p class="hint">家属接受陪同没有自动完成事务。</p>`, button('返回首页', 'elder-home'));
    default: {
      const complete = state.task.status === 'COMPLETED';
      const hasTask = ['CONFIRMED', 'COMPLETED'].includes(state.task.status);
      return page('今天要记什么事？', complete ? '事务已完成' : hasTask ? '已有 1 件事务' : '还没有事务', hasTask ? card(d.title, `明天${displayTime(d.time)} · ${d.location}<br>${displayReminder(state.task.reminderAt)}提醒`) : card('从这里开始', '点“记一件事”，说出或手动填写一件日常事务。'), button('记一件事', 'task-input') + button('家庭协作', 'relationship', 'secondary'));
    }
  }
}

function familyView(state) {
  const request = state.collaborationRequest;
  const shared = request.sharedFields;
  if (state.currentView === 'FAMILY_REQUEST' && shared) {
    if (request.status !== 'PENDING') return page('这条请求不能再回应', request.status === 'WITHDRAWN' ? '张阿姨已撤回' : '请求已失效', card(shared.title, '原请求已结束，不能接受、拒绝或建议改期。'), button('返回列表', 'family-home'));
    return page('张阿姨希望你陪同', '等待你的回复', `${card(shared.title, `10 月 7 日${displayTime(shared.time)}，${shared.location}；${shared.help}。`)}${fields([['可见范围', '事项、时间、地点、陪同请求'], ['不可操作', '不能改、删或标记完成']])}`, button('我可以陪你', 'accept-request') + button('这次不能陪同', 'decline-request', 'secondary') + button('建议改到下午 2:00', 'propose-change', 'secondary'));
  }
  if (state.currentView === 'FAMILY_ACCEPTED' && shared) return page('已回复可以陪同', '已接受请求', `${card('张阿姨会看到', `你可以在明天${displayTime(shared.time)}陪同。`, 'success-card')}<p class="hint">事务仍需张阿姨自己确认完成。</p>`, button('切换到张阿姨端', 'elder-result'));
  if (state.currentView === 'FAMILY_DECLINED' && shared) return page('已回复不能陪同', '事务仍属于张阿姨', card('张阿姨会看到', '你这次不能陪同；她自己的事务和提醒不会被取消。'), button('切换到张阿姨端', 'elder-declined'));
  if (state.currentView === 'FAMILY_CHANGE_PROPOSED' && shared) return page('已建议下午 2:00', '等待张阿姨决定', card('你只是提出建议', '原时间不会自动改变。'), button('切换到张阿姨端', 'elder-change-proposed'));
  const unavailable = ['WITHDRAWN', 'INVALIDATED'].includes(request.status);
  const noRequest = request.status === 'NONE';
  const title = noRequest ? '暂时没有新请求' : request.status === 'PENDING' ? '有 1 个待回复请求' : unavailable ? '原请求已结束' : '已回复';
  const body = noRequest
    ? card('你只会看到她主动发送的事情', '不会显示她的其他提醒、位置、历史或语音原话。')
    : card(shared?.title || '公交卡年审', unavailable ? '这条请求已经撤回或失效，不能再回应。' : `明天${displayTime(shared?.time)} · ${shared?.location}`);
  return page('张阿姨的协作请求', title, body, request.status === 'PENDING' ? button('查看请求', 'open-family-request') + button('切换到张阿姨端', 'role-elder', 'secondary') : unavailable ? button('查看已结束请求', 'open-family-request') + button('切换到张阿姨端', 'role-elder', 'secondary') : button('切换到张阿姨端', 'role-elder', 'secondary'));
}

function relationshipView(state) {
  const status = state.relationship.status;
  if (state.currentRole === 'FAMILY') {
    if (status === 'QR_READY') return page('扫描张阿姨的二维码', '等待扫码', card('申请成为协助者', '建立后只能收到张阿姨主动发来的具体请求。'), button('模拟扫码并申请', 'family-scan') + button('取消', 'family-home', 'secondary'));
    if (status === 'PENDING_ELDER') return page('正在等张阿姨确认', '申请待确认', card('暂时不能查看任何事务', '请让张阿姨在自己的设备上决定是否同意。'), button('切换到张阿姨确认', 'elder-relationship'));
    return page('家庭协作', status === 'ACTIVE' ? '已和张阿姨建立协作' : '尚未建立关系', card('你的权限', status === 'ACTIVE' ? '只能回应她主动发来的单次请求，不能修改、删除或完成她的事务。' : '需要张阿姨主动显示二维码。'), button('返回家属首页', 'family-home'));
  }
  if (status === 'UNLINKED') return page('邀请小梅建立家庭协作', '首次建立关系', card('双方共同确认', '二维码只用于确认身份，不会自动共享事务、位置或历史。'), button('显示二维码', 'show-qr') + button('以后再说', 'elder-home', 'secondary'));
  if (status === 'QR_READY') return page('二维码已准备好', '等小梅扫码', card('让小梅使用她的设备扫码', '扫码后还需要你亲自同意。'), button('切换到小梅扫码', 'family-relationship') + button('取消二维码', 'elder-home', 'secondary'));
  if (status === 'PENDING_ELDER') return page('小梅想和你建立协作', '需要你确认', `${card('请核对身份', '小梅（女儿）提出申请。她不会自动看到你的提醒、历史或位置。')}<div class="notice">每件事务仍需单独确认共享。</div>`, button('同意建立', 'establish-relationship') + button('暂不同意', 'decline-relationship', 'secondary'));
  if (status === 'DECLINED') return page('暂不建立家庭协作', '没有共享信息', card('你仍可使用个人提醒', '小梅看不到你的事务、提醒、位置或历史。'), button('继续记事', 'task-input') + button('重新邀请', 'show-qr', 'secondary'));
  return page('已建立家庭协作', '关系已确认', card('每件事仍需单独确认', '小梅只能看到你主动发给她的具体请求。'), button('继续记事', 'elder-home') + button('切换小梅查看', 'family-relationship', 'secondary'));
}

function demoView(state) {
  const scenarioButtons = DEMO_SCENARIOS.map(([id, label]) => `<button class="scenario-button${state.demoScenario === id ? ' selected' : ''}" type="button" data-action="load-demo-scenario" data-scenario="${id}"><strong>${label}</strong><span>${id}</span></button>`).join('');
  return page('演示控制台', '评审快捷入口', `<div class="demo-warning"><strong>演示控制，不属于老人真实产品功能</strong><br>加载场景会使用完整快照，清除前一个场景的全部状态。</div>${card('Fixed Demo Clock', new Date(state.demoClock).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }))}<section><h2>快速切换角色</h2><div class="role-buttons">${button('打开老人端', 'role-elder', 'secondary')}${button('打开家属端', 'role-family', 'secondary')}</div></section><section><h2>加载完整场景</h2><div class="scenario-grid">${scenarioButtons}</div></section><p class="hint">所有 AI、消息、失败、时钟与提醒均为本地预置模拟，不会调用真实服务。</p>`, button('Reset All Demo Data', 'reset', 'danger'));
}

export function renderApp(state) {
  const content = state.currentView.startsWith('FAMILY') ? familyView(state) : state.currentView === 'RELATIONSHIP' ? relationshipView(state) : state.currentView === 'DEMO' ? demoView(state) : elderView(state);
  return `<div class="app-shell"><header class="topbar"><div><span class="avatar">${state.currentRole === 'FAMILY' ? '梅' : '张'}</span><strong>${roleLabel(state.currentRole)}</strong></div><span class="version">Prototype 0.11</span></header><main>${content}</main><nav class="bottom-nav" aria-label="主要导航"><button data-action="role-elder" class="${state.currentRole === 'ELDER' ? 'active' : ''}">老人端</button><button data-action="role-family" class="${state.currentRole === 'FAMILY' ? 'active' : ''}">家属端</button><button data-action="relationship">协作</button><button data-action="demo">演示</button></nav></div>`;
}
