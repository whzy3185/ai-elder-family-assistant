import { renderApp } from './views.js';
import { FIXED_INPUT } from './state/initial-state.js';
import { inferScreenId } from './screen-catalog.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time = value => value === '14:00' ? '下午 2:00' : value === '08:00' ? '上午 8:00' : '上午 9:00';
const reminder = s => s.task.reminderAt?.includes('13:30') ? '下午 1:30' : s.task.reminderAt?.includes('07:30') ? '上午 7:30' : s.task.reminderAt ? '上午 8:30' : '已停止';
const b = (label, action, style = '') => `<button type="button" class="button ${style}" data-action="${action}">${label}</button>`;
const card = (title, body) => `<article class="card"><h2>${title}</h2><p>${body}</p></article>`;
const page = (title, status, body, actions) => `<section class="page"><h1 tabindex="-1">${title}</h1><p class="status" role="status">${status}</p>${body}<div class="page-actions">${actions}</div></section>`;
const shared = s => card('本次安排', `${esc(s.task.details?.title)}<br>10 月 7 日${time(s.task.details?.time)} · ${esc(s.task.details?.location)}<br>希望小梅陪同（是否发送由你决定）。`);

export function renderReleaseApp(input, catalog = []) {
  let state = input;
  const request = state.collaborationRequest;
  if (state.currentView === 'ELDER_ACCEPTED' && request.status !== 'ACCEPTED') state = { ...state, currentView: 'ELDER_HOME' };
  if (state.currentView === 'TASK_SAVED' && state.task.status !== 'CONFIRMED') state = { ...state, currentView: state.task.status === 'CANCELLED' ? 'TASK_CANCELLED' : state.task.status === 'COMPLETED' ? 'TASK_COMPLETED' : 'ELDER_HOME' };
  let content = renderApp(state).match(/<main>([\s\S]*?)<\/main>/)[1];
  const d = state.task.details;
  const view = state.currentView;
  if (view === 'TASK_UNDERSTOOD') content = page('请核对系统理解','尚未保存，需要你确认',shared(state)+card('提醒与依据',`${reminder(state)}提醒。仅整理当前原话：${esc(state.task.rawInput)}。没有查询政策、材料或资格。`),b('内容正确，继续确认','back-confirm')+b('修改时间','edit-time','secondary'));
  if (view === 'TASK_CONFIRM') content = page(state.task.wasCorrected ? '再看一遍' : '时间可能不对',state.task.wasCorrected ? '确认后才会记好' : '识别错误',card('你的原话',esc(state.task.rawInput))+card('系统理解',`事情：${esc(d.title)}<br>日期：10 月 7 日<br>时间：${time(d.time)}<br>地点：${esc(d.location)}<br>个人提醒：${reminder(state)}<br>陪同意图：希望小梅陪同`)+card('整理依据',state.task.parsingStatus === 'MANUAL' ? '这些字段由你手动填写；仍需最后确认。' : '仅整理上方原话，没有查询政策、材料或资格。请核对时间，系统可能听错。')+(state.formError ? `<p role="alert">${esc(state.formError)}</p>` : ''),state.task.wasCorrected ? b('确认记好','confirm-task')+b('返回修改','edit-time','secondary') : b('改时间','edit-time')+b('返回输入','task-input','secondary'));
  if (view === 'TASK_INPUT') content = page('你想记什么事？','等待输入',`<label class="input-label" for="task-input">可以说，也可以手动填写</label><textarea id="task-input">${esc(state.task.status === 'EMPTY' ? (state.task.rawInput || FIXED_INPUT) : state.task.rawInput)}</textarea><p class="hint">本演示只模拟公交卡年审案例，不调用真实语音或 AI。其他内容请手动填写；空白不能创建事务。</p>`,b('帮我整理','submit-task')+b('使用预置语音示例（模拟）','use-voice-example','secondary')+b('改为手动填写','show-manual-form','secondary')+b('演示信息缺失','simulate-missing','secondary')+b('演示无法整理','simulate-parse-failure','secondary')+b('返回，保留内容','elder-home','secondary'));
  if (view === 'TASK_PROCESSING') content = content.replace('</div></section>', `${b('返回，暂停整理','task-input','secondary')}</div></section>`);
  if (view === 'TASK_PARSE_FAILED') content = content.replace('</div></section>', `${b('再试一次','retry-parse','secondary')}</div></section>`);
  if (view === 'TASK_MISSING' && !state.task.rawInput.trim()) content = page('还没有填写这件事','必要信息缺失',card('输入为空','没有听清任何事务内容。你可以返回输入，也可以直接手动填写；不会自动保存或告诉家属。'),b('手动填写','show-manual-form')+b('返回输入','task-input','secondary'));
  if (view === 'TASK_MANUAL_FORM') {
    const draft = { title: '办理公交卡年审', time: '09:00', location: '社区服务中心', ...state.manualDraft };
    content = page('手动填写这件事','原话保留，不使用 AI',`${card('你的原话',esc(state.task.rawInput || '尚未输入原话，可以直接填写下方预置案例。'))}<label class="input-label" for="manual-title">事情</label><input id="manual-title" data-field="title" value="${esc(draft.title)}" maxlength="60"><p>日期：10 月 7 日（固定演示日期）</p><label class="input-label" for="manual-time">时间</label><select id="manual-time" data-field="time"><option value="09:00" ${draft.time === '09:00' ? 'selected' : ''}>上午 9:00</option><option value="14:00" ${draft.time === '14:00' ? 'selected' : ''}>下午 2:00</option></select><label class="input-label" for="manual-location">地点</label><input id="manual-location" data-field="location" value="${esc(draft.location)}" maxlength="60"><p>提醒：自动提前 30 分钟。陪同意图不等于授权共享。</p>${state.formError ? `<p role="alert">${esc(state.formError)}</p>` : ''}`,b('填好了，继续确认','manual-fill-task')+b('返回原话','task-input','secondary'));
  }
  if (view === 'TASK_SAVED') {
    const statuses = { NONE:'还没有告诉小梅', INVALIDATED:'旧请求已失效；新安排还没有发送', WITHDRAWN:'陪同请求已撤回', PENDING:'等待小梅回复', NO_RESPONSE:'小梅还没有回复', ACCEPTED:'小梅答应陪同', DECLINED:'小梅这次不能陪同', CHANGE_PROPOSED:'小梅提出改期建议' };
    const invite = ['NONE','INVALIDATED','WITHDRAWN'].includes(request.status) && state.relationship.status === 'ACTIVE';
    content = page('这件事已记好','个人事务已保存',shared(state)+card('个人提醒与协作',`提醒：${reminder(state)}<br>家属：${statuses[request.status] || '等待你决定'}`),(invite ? b('请小梅陪同','ask-share') : b('查看协作结果','view-request-result'))+b('修改时间','start-post-accept-edit','secondary')+b('模拟到提醒时间','trigger-reminder','secondary')+b('这件事办完了','ask-complete','secondary')+b('取消整件事','cancel-task','danger'));
    if (request.status === 'NONE') content = content.replace('<div class="page-actions">', `<div class="page-actions">${b('只提醒我自己','keep-private','secondary')}${state.relationship.status !== 'ACTIVE' ? b('建立家庭协作','relationship','secondary') : ''}`);
  }
  if (view === 'SHARE_DECISION') content = page('要请小梅陪同吗？','个人提醒已经保存',shared(state)+card('还没有告诉小梅','请她陪同前，你还会看到这次共享的内容。选择只提醒自己，她不会看到这件事。'),b('请小梅陪同，查看共享','start-share')+b('只提醒我自己','keep-private','secondary')+b('返回事务详情','saved-task','secondary'));
  if (view === 'SHARE_REVIEW') content = content.replace('</div></section>', `${b('她能看到什么','view-permissions','secondary')}</div></section>`);
  if (view === 'REQUEST_SENDING') content = page('正在发给小梅','还未送达',shared(state)+card('个人提醒仍保留','发送成功后才会显示“已经发给小梅”。'),b('继续，查看发送结果','finish-sending')+b('返回共享预览','start-share','secondary'));
  if (view === 'REQUEST_SENT') content = content.replace('<div class="page-actions">',`<div class="page-actions">${b('查看等待状态','wait-request')}`).replace(/class="button primary"([^>]*data-action="family-request")/,'class="button secondary"$1');
  if (view === 'REQUEST_WAITING') content = page('正在等小梅回复','已发送，还没有答应',shared(state)+card('个人提醒仍在',`${reminder(state)}照常提醒。你可以继续等待，也可以只撤回陪同请求。`),b('返回事务详情','saved-task')+b('撤回陪同请求','withdraw-request','danger')+b('演示还未回应','mark-no-response','secondary'));
  if (view === 'CHANGE_ACCEPTED' || view === 'POST_ACCEPT_CHANGED') content = page('已改到下午 2:00','旧答复已失效；尚未重新发送',shared(state)+card('提醒已经同步',`${reminder(state)}提醒。是否重新请小梅陪同，由你决定。`),b('查看共享，重新询问小梅','start-share')+b('只保留自己的事务','saved-task','secondary'));
  if (view === 'CHANGE_REJECTED') content = page('保留上午 9:00','仍在等待小梅回应',shared(state)+card('原安排没有改变','你没有接受下午 2:00 的建议。未回应不能当作已答应。'),b('继续等待','continue-waiting')+b('撤回陪同请求','withdraw-request','danger'));
  if (view === 'POST_ACCEPT_EDIT') content = page('把时间改到下午 2:00？','旧请求和答复不会继承',shared(state)+card('修改后的安排','下午 2:00 办理，下午 1:30 提醒。确认修改仅保存个人事务，不会自动再告诉小梅。'),b('确认修改','confirm-post-accept-change')+b('不修改','saved-task','secondary'));
  if (view === 'TASK_EDIT_IMPACT') content = page('修改已保存的时间','请先了解对陪同安排的影响',shared(state)+card('旧请求和答复将失效','修改保存后，小梅原来的回应不会继承。是否按新时间再请她陪同，需要你重新查看共享内容并确认。'),b('继续修改时间','continue-post-edit')+b('暂不修改','saved-task','secondary'));
  if (view === 'TASK_REMINDER') content = page('该准备出发了','提醒已触发',shared(state)+card('陪同情况',request.status === 'ACCEPTED' && request.taskVersion === state.task.version ? '小梅已答应本次陪同。' : request.status === 'NONE' ? '你选择自己安排，没有通知小梅。' : '小梅还没有答应当前安排，请按自己的实际情况决定。'),b('知道了，去办事','ask-complete')+b('返回事务详情','saved-task','secondary'));
  if (view === 'ELDER_HOME' && state.task.status !== 'EMPTY') content = page('今天要记什么事？',state.task.status === 'CANCELLED' ? '这件事已取消' : state.task.status === 'COMPLETED' ? '这件事已完成' : state.task.status === 'CONFIRMED' ? '已有一件事务' : '输入尚未保存',d ? shared(state)+card('提醒状态',reminder(state)) : card('输入已经保留',esc(state.task.rawInput)),['CONFIRMED','CANCELLED','COMPLETED'].includes(state.task.status) ? b('查看这件事','saved-task')+(state.task.status !== 'CONFIRMED' ? b('记一件新事','task-input','secondary') : '') : b('继续填写','task-input'));
  if (view === 'PERMISSIONS') content = page('她能看到什么？','只有你主动分享的本次事务',card('可以看到','事情、日期、时间、地点、希望陪同。')+card('不能看到','你的提醒时间、原话、其他事务、历史和位置。')+card('不能代替你决定','小梅不能修改、取消或完成你的事务。建立关系不会自动共享。'),b('知道了','return-view'));
  if (view === 'RELATIONSHIP_CONFIRM') content = page('同意与小梅建立协作？','请核对：小梅（女儿）',card('仍然逐次确认','建立关系只打开协作通道。每件事都要由你确认共享，她看不到其他提醒或历史。'),b('确认同意','establish-relationship')+b('返回，不建立','relationship','secondary'));
  if (view === 'RELATIONSHIP') {
    content = content.replace('data-action="establish-relationship"','data-action="ask-establish-relationship"').replace('data-action="elder-home">取消二维码','data-action="cancel-qr">取消二维码');
    content = content.replace('</div></section>',`${b('她能看到什么','view-permissions','secondary')}${state.relationship.status === 'ACTIVE' ? b('结束家庭协作','ask-end-relationship','danger') : ''}</div></section>`);
    if (state.relationship.status === 'ENDED') content = page('家庭协作已结束','不能再共享或回应',card('个人提醒仍保留','旧请求已失效。重新建立关系也不会自动恢复旧授权。'),b('重新邀请小梅','show-qr')+b('返回首页','elder-home','secondary'));
    if (state.currentRole === 'FAMILY' && state.relationship.status === 'DECLINED') content = page('张阿姨暂不同意','没有建立关系',card('不能查看事务','张阿姨仍可使用自己的个人提醒。'),b('返回家属首页','family-home'));
    if (state.currentRole === 'FAMILY' && state.relationship.status === 'ENDED') content = page('家庭协作已结束','不能处理旧请求',card('权限已经结束','张阿姨的个人事务仍属于她；你不能再回应旧陪同请求。'),b('返回家属首页','family-home'));
  }
  if (view === 'RELATIONSHIP_END_CONFIRM') content = page('结束家庭协作？','现有陪同请求也会失效',card('不会取消个人事务','结束后，小梅不能继续回应旧请求；个人提醒照常保留。'),b('确认结束协作','end-relationship','danger')+b('暂不结束','relationship','secondary'));
  if (view === 'RELATIONSHIP_ENDED') content = page('家庭协作已结束','旧请求已失效',card('不会取消个人事务','自己的提醒仍有效；对方不能再处理旧请求。'),b('返回首页',state.currentRole === 'FAMILY' ? 'family-home' : 'elder-home'));
  if (view === 'FAMILY_REQUEST' && ['PENDING','NO_RESPONSE'].includes(request.status)) content = page('张阿姨希望你陪同','等待你的回复',card(esc(request.sharedFields.title),`10 月 7 日${time(request.sharedFields.time)} · ${esc(request.sharedFields.location)}<br>希望你陪同。`)+card('你只能回应这一次','看不到她的原话或提醒；不能修改、取消或完成她的事务。'),b('我可以陪你','ask-accept-request')+b('这次不能陪同','ask-decline-request','secondary')+b('建议改到下午 2:00','ask-propose-change','secondary'));
  if (['FAMILY_ACCEPT_CONFIRM','FAMILY_DECLINE_CONFIRM','FAMILY_PROPOSE_CONFIRM'].includes(view)) {
    const accept = view === 'FAMILY_ACCEPT_CONFIRM', decline = view === 'FAMILY_DECLINE_CONFIRM';
    content = page(accept ? '确认这次可以陪同？' : decline ? '确认这次不能陪同？' : '建议改到下午 2:00？','只回应当前请求',card('本次安排',`${esc(request.sharedFields?.title)} · ${time(request.sharedFields?.time)}`)+card('回应的影响',accept ? '告诉张阿姨你可以陪同，不会标记事务完成。' : decline ? '告诉张阿姨这次不能陪同，不会取消她的事务。' : '只是建议；张阿姨同意后才会改时间，之后仍需重新共享。'),b(accept ? '确认可以陪' : decline ? '确认不能陪' : '提交改期建议',accept ? 'accept-request' : decline ? 'decline-request' : 'propose-change')+b('返回，不发送','open-family-request','secondary'));
  }
  if (view === 'FAMILY_REQUEST' && ['ACCEPTED','DECLINED','CHANGE_PROPOSED'].includes(request.status)) {
    const labels = { ACCEPTED:'你已答应陪同', DECLINED:'你已回复不能陪同', CHANGE_PROPOSED:'你已建议改期，等待张阿姨决定' };
    content = page(labels[request.status],'本次回应已发送',card('已共享的安排',`${esc(request.sharedFields?.title)} · ${time(request.sharedFields?.time)} · ${esc(request.sharedFields?.location)}`)+card('事务由张阿姨决定','你的回应不会自动完成、取消或修改她的事务。'),b('返回列表','family-home'));
  }
  if (view === 'FAMILY_REQUEST' && ['NONE','SENDING','WITHDRAWN','INVALIDATED'].includes(request.status)) content = page(state.task.status === 'CANCELLED' ? '这件事已取消' : request.status === 'WITHDRAWN' ? '陪同请求已撤回' : ['NONE','SENDING'].includes(request.status) ? '暂时没有新请求' : '旧请求已失效','不能回应',card('没有可处理的请求','请回到列表查看当前有效请求。'),b('返回列表','family-home'));
  if (view === 'FAMILY_HOME' && state.relationship.status !== 'ACTIVE') content = page('张阿姨的协作请求','暂时没有新请求',card('没有有效家庭协作关系','看不到张阿姨的事务。必须双方建立关系，再由她逐件分享。'),b('查看家庭协作','relationship'));
  if (view === 'FAMILY_HOME' && request.status === 'NO_RESPONSE') content = content.replace('已回复','有 1 个待回复请求').replace('<div class="page-actions">',`<div class="page-actions">${b('查看请求','open-family-request')}`);
  if (view === 'FAMILY_HOME' && ['ACCEPTED','DECLINED','CHANGE_PROPOSED'].includes(request.status)) content = content.replace('<div class="page-actions">',`<div class="page-actions">${b('查看已回应请求','open-family-request')}`);
  if (view === 'FAMILY_HOME' && request.status === 'SENDING') content = page('张阿姨的协作请求','暂时没有新请求',card('只有发送成功才可见','张阿姨尚未发来可以处理的请求。'),b('查看家庭协作','relationship'));
  if (['FAMILY_ACCEPTED','FAMILY_DECLINED','FAMILY_CHANGE_PROPOSED'].includes(view)) content = content.replace('<div class="page-actions">',`<div class="page-actions">${b('返回请求列表','family-home')}`).replace(/class="button primary"([^>]*data-action="elder-(result|declined|change-proposed)")/,'class="button secondary"$1');
  if (view === 'RESET_CONFIRM') content = page('恢复初始演示？','只清空这份浏览器中的模拟数据',card('将清空','家庭关系、个人事务、请求和场景均恢复首次使用，演示时钟回到 10 月 6 日 20:00。'),b('确认恢复初始演示','reset','danger')+b('返回演示控制台','demo','secondary'));
  if (view === 'RESET_RESULT') content = page('已恢复初始演示','无关系、无事务、无请求',card('固定演示时钟','2026 年 10 月 6 日 20:00。'),b('开始演示','elder-home'));
  if (view === 'SETTINGS') content = page('显示设置','按自己的阅读习惯选择',card('当前显示',`${state.settings?.largeText ? '大字' : '标准字体'}；${state.settings?.highContrast ? '高对比已开启' : '标准对比度'}`)+card('默认也可直接使用','正文 20px，按钮不小于 56px。大字模式 24px；高对比模式提高辅助文字对比。'),b('使用大字','large-text')+b('使用高对比','high-contrast','secondary')+b('恢复标准显示','standard-display','secondary')+b('返回首页','elder-home','secondary'));
  if (view === 'DEMO') {
    content = content.replace('data-action="reset"','data-action="ask-reset"');
    content = content.replace('<div class="page-actions">',`<details class="screen-index"><summary>按编号查看全部页面与状态（${catalog.length} 项）</summary>${catalog.map(item => `<button type="button" class="catalog-link" data-action="load-screen" data-screen="${item.id}">${item.id} · ${esc(item.name)}</button>`).join('')}</details><div class="page-actions">`);
  }
  content = content.replace(/<h1(?![^>]*tabindex)/g,'<h1 tabindex="-1"').replace(/<p class="status">/g,'<p class="status" role="status">');
  content = content.replace(/data-action="(accept-request|decline-request|propose-change)"/g, `data-action="$1" data-request-id="${esc(request.id)}"`);
  content = content.replace('<section class="page">',`<section class="page" data-screen-id="${inferScreenId(state)}">`);
  const role = state.currentRole === 'FAMILY' ? '家属端 · 小梅' : '老人端 · 张阿姨';
  const classes = `${state.settings?.largeText ? ' large-text' : ''}${state.settings?.highContrast ? ' high-contrast' : ''}`;
  return `<div class="app-shell${classes}"><header class="topbar"><strong>${role}</strong><span class="version">Prototype 0.12</span></header><main>${content}</main><nav class="product-nav" aria-label="当前角色导航">${b('首页',state.currentRole === 'FAMILY' ? 'family-home' : 'elder-home','secondary')}${b('家庭协作','relationship','secondary')}${state.currentRole === 'ELDER' ? b('显示设置','settings','secondary') : ''}</nav><aside class="demo-tools" aria-label="独立演示工具"><span>演示工具：角色切换不是产品权限</span><div>${b('老人端','role-elder','secondary')}${b('家属端','role-family','secondary')}${b('演示控制','demo','secondary')}</div></aside></div>`;
}
