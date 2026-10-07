import { FIXED_INPUT } from './state/initial-state.js';
import { inferScreenId } from './screen-catalog.js';
import { productCopy } from './product-copy.js';
import { renderReviewTools } from './review-views.js';

export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const time = value => ({'14:00':'下午 2:00','09:00':'上午 9:00','08:00':'上午 8:00'}[value] || '还没填写');
export const button = (label, action, style = 'primary', attrs = '') => `<button type="button" class="button ${style}" data-action="${action}" ${attrs}>${esc(label)}</button>`;
const reminder = s => s.task.reminderAt?.includes('13:30') ? '下午 1:30' : s.task.reminderAt?.includes('07:30') ? '上午 7:30' : s.task.reminderAt ? '上午 8:30' : '已停止';
const note = (text, name='') => `<div class="note">${name ? `<p class="secondary-text">${esc(name)}</p>` : ''}<p>${esc(text)}</p></div>`;
const raw = s => s.task.rawInput ? `<details class="original"><summary>看看刚才说的话</summary><p>${esc(s.task.rawInput)}</p></details>` : '';
const schedule = (d, extra='') => d ? `<div class="schedule"><p class="date-line">10月7日 · 星期三</p><p class="time-display">${time(d.time)}</p><h2>${esc(d.title)}</h2><p class="place">${esc(d.location || '地点还没填写')}</p>${extra}</div>` : '';
const actions = html => `<div class="page-actions">${html}</div>`;
const familyStatus = s => ({NONE:'还没有告诉小梅',INVALIDATED:'时间改过了，还没有再问小梅',WITHDRAWN:'已经撤回陪同请求',PENDING:'等小梅回复',NO_RESPONSE:'小梅还没有回复',ACCEPTED:'小梅可以陪你去',DECLINED:'小梅这次不能陪你',CHANGE_PROPOSED:'小梅想下午2:00去'}[s.collaborationRequest.status] || '还没有告诉小梅');

function home(s) {
  const d=s.task.details, live=s.task.status==='CONFIRMED', ended=['COMPLETED','CANCELLED'].includes(s.task.status);
  const day=new Date(s.demoClock).toLocaleDateString('zh-CN',{timeZone:'Asia/Shanghai',day:'2-digit'}), today=new Date(s.demoClock).toLocaleDateString('zh-CN',{timeZone:'Asia/Shanghai',month:'numeric',weekday:'long'});
  return `<div class="calendar-heading"><span class="calendar-date">${day}<small>${today}</small></span><span class="greeting-note">把要办的事<br>一件件记好</span></div>${d && (live||ended) ? `<button class="agenda-entry" data-action="saved-task"><span class="secondary-text">${ended ? s.task.status==='COMPLETED'?'已经办完':'已经取消' : '10月7日'}</span><strong>${esc(d.title)}</strong><span>${time(d.time)} · ${esc(d.location)}</span>${live?`<span class="reply-line">${familyStatus(s)}</span>`:''}<span class="entry-link">查看这件事 →</span></button>` : `<div class="empty-page"><div class="notebook-mark" aria-hidden="true">一</div><p>${s.task.rawInput?'刚才写的内容还在。':'明天要办什么事？'}<br>${s.task.rawInput?'接着写，就不会忘。':'现在记下，到了时间提醒你。'}</p></div>`}${actions(button(live?'查看这件事':s.task.rawInput&&!ended?'继续填写':'记一件事',live?'saved-task':'task-input'))}<button class="text-button" data-action="settings">字太小？调整阅读方式</button>`;
}
function relationship(s) {
  const status=s.relationship.status, family=s.currentRole==='FAMILY';
  const person=`<div class="person"><span class="person-avatar" aria-hidden="true">${family?'张':'梅'}</span><div><h2>${family?'妈妈 · 张阿姨':'小梅 · 女儿'}</h2><p class="secondary-text">${status==='ACTIVE'?'已经建立家庭协作':'每件事，都尊重她的决定'}</p></div></div>`;
  if(status==='ACTIVE')return person+note(family?'妈妈主动发来一件事时，你可以答复是否陪同，或建议另一个时间。':'你需要陪同时，可以把那件事发给小梅。她看不到你的其他事情。')+actions(button(family?'查看消息':'回到事情',family?'family-home':'elder-home')+(family?'':button('她能看到什么？','view-permissions','text'))+button('结束家庭协作','ask-end-relationship','danger'));
  if(['ENDED','DECLINED'].includes(status))return person+note(status==='ENDED'?'之前的陪同安排不再继续。':'还没有建立家庭协作。')+actions(button('返回',family?'family-home':'elder-home')+(!family?button('重新邀请小梅','show-qr','secondary'):''));
  if(family)return person+note(status==='QR_READY'?'妈妈已邀请你。确认是妈妈后，向她申请建立协作。':status==='PENDING_ELDER'?'申请已经送出，等妈妈亲自确认。':'请妈妈先在“家人”里邀请你。')+actions((status==='QR_READY'?button('向妈妈申请','family-scan'):'')+button('回到消息','family-home','secondary'));
  if(status==='PENDING_ELDER')return person+note('请确认这是你的女儿小梅。建立协作后，每件事仍要你同意才会告诉她。')+actions(button('是小梅，同意建立','ask-establish-relationship')+button('这次先不同意','decline-relationship','secondary')+button('她能看到什么？','view-permissions','text'));
  if(status==='QR_READY')return person+`<div class="invitation"><strong>请小梅打开邀请</strong><p>小梅申请后，还需要你亲自同意。</p><p class="secondary-text">请小梅在她的设备上打开你的邀请。</p></div>`+actions(button('取消这次邀请','cancel-qr','secondary'));
  return person+note('小梅可以收到你发来的陪同请求。你仍自己决定每件事，不会自动分享。')+actions(button('邀请小梅','show-qr')+button('以后再说','elder-home','secondary'));
}
function familyContent(s) {
  const r=s.collaborationRequest,d=r.sharedFields, view=s.currentView, valid=s.relationship.status==='ACTIVE' && s.task.status==='CONFIRMED' && r.taskVersion===s.task.version;
  const returnList=button('回到消息','family-home');
  if(view==='FAMILY_HOME') {
    const visible=d&&s.relationship.status==='ACTIVE'&&!['NONE','SENDING'].includes(r.status);
    return `<div class="person compact"><span class="person-avatar" aria-hidden="true">张</span><p>妈妈 · 张阿姨</p></div>${visible ? `<button class="agenda-entry" data-action="open-family-request"><span class="secondary-text">${{PENDING:'等你回复',NO_RESPONSE:'等你回复',ACCEPTED:'你可以陪同',DECLINED:'这次不能陪同',CHANGE_PROPOSED:'等妈妈决定',WITHDRAWN:'陪同已撤回',INVALIDATED:'安排已更新，等妈妈再告诉你'}[r.status]}</span><strong>${esc(d.title)}</strong><span>${r.status==='INVALIDATED'?'原来：':''}10月7日 ${time(d.time)}</span><span>${esc(d.location)}</span><span class="entry-link">查看消息 →</span></button>` : `<div class="empty-page"><p>现在没有新消息。<br>妈妈需要陪同时，会告诉你。</p></div>${actions(button('看看家庭协作','relationship','secondary'))}`}`;
  }
  if(view==='FAMILY_REQUEST') {
    if(!valid||['NONE','SENDING','WITHDRAWN','INVALIDATED'].includes(r.status))return note(s.task.status==='CANCELLED'?'这次不用再安排陪同。':r.status==='WITHDRAWN'?'妈妈自己的事情和提醒仍保留。':s.relationship.status!=='ACTIVE'?'家庭协作已经结束，不再处理之前的陪同安排。':'妈妈还没有发来新的安排。她再告诉你后，才能确认陪同。')+actions(returnList);
    if(!['PENDING','NO_RESPONSE'].includes(r.status))return schedule(d)+note({ACCEPTED:'你已告诉妈妈：我可以陪你。',DECLINED:'你已告诉妈妈：这次不能陪同。',CHANGE_PROPOSED:'你已建议下午2:00去，等妈妈决定。'}[r.status])+actions(returnList);
    return schedule(d)+`<p class="request-message">妈妈：希望你能陪我去。</p>`+actions(button('我可以陪你','ask-accept-request')+button('这次不能陪同','ask-decline-request','secondary')+(d.time!=='14:00'?button('建议下午2:00去','ask-propose-change','text'):'')+button('返回消息','family-home','text'));
  }
  if(['FAMILY_ACCEPT_CONFIRM','FAMILY_DECLINE_CONFIRM','FAMILY_PROPOSE_CONFIRM'].includes(view)) {
    const accept=view==='FAMILY_ACCEPT_CONFIRM', decline=view==='FAMILY_DECLINE_CONFIRM';
    if(!valid||!['PENDING','NO_RESPONSE'].includes(r.status)||(!accept&&!decline&&d.time==='14:00'))return note('这条安排已更新，请返回查看。')+actions(returnList);
    return schedule(d)+(!accept&&!decline?note('建议改到下午2:00，由妈妈决定是否修改。'):'')+actions(button(accept?'确认可以陪':decline?'确认不能陪':'把建议告诉妈妈',accept?'accept-request':decline?'decline-request':'propose-change','primary',`data-request-id="${esc(r.id)}"`)+button('先不发送','open-family-request','secondary'));
  }
  return schedule(d)+actions(returnList);
}
function productContent(s) {
  const v=s.currentView,d=s.task.details,r=s.collaborationRequest;
  if(v==='RELATIONSHIP')return relationship(s);
  if(v==='PERMISSIONS')return `<dl class="permission-list"><div><dt>她能看到</dt><dd>你发给她的事情、日期、时间、地点，以及希望她陪同。</dd></div><div><dt>只属于你</dt><dd>提醒时间、刚才说的话、其他事情和位置。</dd></div><div><dt>由你决定</dt><dd>修改时间、取消事情、确认办完。</dd></div></dl>`+actions(button('知道了','return-view'));
  if(v==='RELATIONSHIP_CONFIRM')return note('小梅 · 女儿')+note('建立协作后，每件事仍由你决定要不要告诉她。')+actions(button('确认同意','establish-relationship')+button('返回','relationship','secondary'));
  if(v==='RELATIONSHIP_END_CONFIRM')return note(s.currentRole==='FAMILY'?'之后不能再收到或回复妈妈的陪同请求。妈妈自己的事情和提醒会保留。':'之后不能再请小梅陪同。自己的事情和提醒会保留。')+actions(button('确认结束协作','end-relationship','danger')+button('继续保留协作','relationship','secondary'));
  if(v==='RELATIONSHIP_ENDED'||v==='RELATIONSHIP_DECLINED')return actions(button('回到首页',s.currentRole==='FAMILY'?'family-home':'elder-home'));
  if(s.currentRole==='FAMILY')return familyContent(s);
  switch(v) {
    case 'ELDER_HOME':return home(s);
    case 'TASK_INPUT':return `<label for="task-input">要办的事</label><textarea id="task-input" placeholder="比如：明天几点，去哪里办什么事">${esc(s.task.status==='EMPTY'?(s.task.rawInput||FIXED_INPUT):s.task.rawInput)}</textarea><p class="secondary-text">可以写下来，也可以用语音。</p>`+actions(button('帮我整理','submit-task')+button('用语音记事','use-voice-example','secondary')+button('自己填写时间和地点','show-manual-form','text')+button('返回，保留内容','elder-home','text'));
    case 'TASK_PROCESSING':return note(s.task.rawInput,'你刚才说')+actions(button('返回，接着写','task-input','secondary'));
    case 'TASK_MISSING':return note(s.task.rawInput||'还没有写下要办的事。')+actions(button('填写时间和地点','show-manual-form')+button('返回输入','task-input','secondary'));
    case 'TASK_PARSE_FAILED':return note(s.task.rawInput,'你刚才说')+actions(button('自己填写时间和地点','show-manual-form')+button('再试一次','retry-parse','secondary')+button('返回，接着写','task-input','text'));
    case 'TASK_MANUAL_FORM': {
      const draft={title:d?.title||'办理公交卡年审',time:d?.time||'09:00',location:d?.location||'社区服务中心',...s.manualDraft};
      return raw(s)+`<label for="manual-title">要办什么事</label><input id="manual-title" data-field="title" value="${esc(draft.title)}" maxlength="60"><p class="date-line">日期：10月7日 · 星期三</p><label for="manual-time">几点去</label><select id="manual-time" data-field="time"><option value="09:00" ${draft.time==='09:00'?'selected':''}>上午 9:00</option><option value="14:00" ${draft.time==='14:00'?'selected':''}>下午 2:00</option></select><label for="manual-location">去哪里</label><input id="manual-location" data-field="location" value="${esc(draft.location)}" maxlength="60"><p class="secondary-text">提前30分钟提醒你。</p>${s.formError?`<p role="alert">${esc(s.formError)}</p>`:''}`+actions(button('填好了，再看看','manual-fill-task')+button('返回原话','task-input','secondary'));
    }
    case 'TASK_UNDERSTOOD':case 'TASK_CONFIRM':return schedule(d,`<button class="text-button" data-action="edit-time">修改时间</button><p class="reminder-line">${reminder(s)} 提醒你</p>`)+raw(s)+`<p class="secondary-text">${s.task.parsingStatus==='MANUAL'?'按你填写的内容记录。':'按你刚才说的话整理。'}</p>${s.formError?`<p role="alert">${esc(s.formError)}</p>`:''}`+actions((s.task.wasCorrected?button('确认记好','confirm-task'):button('改时间','edit-time'))+button('返回输入','task-input','text'));
    case 'TASK_EDIT_TIME':return `<p class="secondary-text">原来记的是 ${time(d.time)}</p><div class="time-choice"><span class="secondary-text">改为</span><strong>上午 9:00</strong><p>上午8:30提醒你</p></div>`+actions(button('改成上午9:00','set-time-nine')+button('不改了','back-confirm','secondary'));
    case 'TASK_SAVED':return schedule(d)+`<dl class="task-facts"><div><dt>提醒你</dt><dd>${reminder(s)}</dd></div><div><dt>小梅</dt><dd>${familyStatus(s)}</dd></div></dl>`+actions((['NONE','WITHDRAWN','INVALIDATED'].includes(r.status)?s.relationship.status==='ACTIVE'?button('请小梅陪你去','ask-share'):button('邀请小梅建立协作','relationship'):button('看看小梅的答复','view-request-result'))+(r.status==='NONE'?button('只提醒我自己','keep-private','secondary'):'')+(d.time!=='14:00'?button('修改时间','start-post-accept-edit','text'):'')+button('这件事办完了','ask-complete','secondary')+button('取消这件事','cancel-task','danger'));
    case 'SHARE_DECISION':return schedule(d)+actions(button('看看要告诉小梅的内容','start-share')+button('只提醒我自己','keep-private','secondary')+button('返回这件事','saved-task','text'));
    case 'SHARE_REVIEW':return schedule(d)+`<p class="request-message">想请小梅陪你去</p>`+actions(button('就把这些发给小梅','send-request')+button('先不发送','saved-task','secondary')+button('她能看到什么？','view-permissions','text'));
    case 'REQUEST_SENDING':return schedule(d)+actions(button('先不发送，返回看看','start-share','secondary'));
    case 'REQUEST_SEND_FAILED':return schedule(d)+actions(button('重新发送','send-request')+button('先不发送','saved-task','secondary'));
    case 'REQUEST_SENT':return schedule(d)+actions(button('看看回复','wait-request')+button('回到这件事','saved-task','secondary')+button('撤回陪同请求','withdraw-request','danger'));
    case 'REQUEST_WAITING':case 'REQUEST_NO_RESPONSE':return schedule(d)+`<p class="reminder-line">${reminder(s)} 照常提醒你</p>`+actions((v==='REQUEST_NO_RESPONSE'?button('再等一等','continue-waiting'):button('回到这件事','saved-task'))+button('撤回陪同请求','withdraw-request','danger'));
    case 'REQUEST_WITHDRAW_CONFIRM':return schedule(d)+actions(button('确认撤回陪同','confirm-withdraw-request','danger')+button('继续等小梅','continue-waiting','secondary'));
    case 'REQUEST_WITHDRAWN':case 'PRIVATE_ONLY':return schedule(d)+`<p class="reminder-line">${reminder(s)} 提醒你</p>`+actions(button('回到这件事','saved-task'));
    case 'ELDER_ACCEPTED':case 'ELDER_DECLINED':return schedule(d)+`<p class="reminder-line">${reminder(s)} 仍会提醒你</p>`+actions(button('回到这件事','saved-task')+(v==='ELDER_ACCEPTED'&&d.time!=='14:00'?button('修改时间','start-post-accept-edit','secondary'):''));
    case 'ELDER_CHANGE_PROPOSED':return schedule(d)+actions((d.time!=='14:00'?button('同意，改到下午2:00','accept-proposed-change'):'')+button(`仍按${time(d.time)}`,'reject-proposed-change','secondary'));
    case 'CHANGE_ACCEPTED':case 'POST_ACCEPT_CHANGED':return schedule(d)+`<p class="reminder-line">${reminder(s)} 提醒你</p>`+actions(button('看看内容，再问小梅','start-share')+button('先保留自己的安排','saved-task','secondary'));
    case 'CHANGE_REJECTED':return schedule(d)+actions(button('继续等小梅','continue-waiting')+button('撤回陪同请求','withdraw-request','danger'));
    case 'TASK_EDIT_IMPACT':return schedule(d)+actions(button('继续修改','continue-post-edit')+button('先不修改','saved-task','secondary'));
    case 'POST_ACCEPT_EDIT':return `<p class="secondary-text">原来是 ${time(d.time)}</p><div class="time-choice"><strong>下午 2:00</strong><p>下午1:30提醒你</p></div>`+actions((d.time!=='14:00'?button('确认改时间','confirm-post-accept-change'):'')+button('先不修改','saved-task','secondary'));
    case 'TASK_CANCEL_CONFIRM':return schedule(d)+actions(button('确认取消这件事','confirm-cancel-task','danger')+button('继续保留','cancel-task-back','secondary'));
    case 'TASK_CANCELLED':case 'TASK_COMPLETED':return schedule(d)+actions(button('回到首页','elder-home'));
    case 'TASK_REMINDER':return schedule(d)+note(r.status==='ACCEPTED'&&r.taskVersion===s.task.version?'小梅可以陪你去。':'请按自己的安排出发。')+actions(button('知道了，看看这件事','saved-task'));
    case 'TASK_COMPLETE_CONFIRM':return schedule(d)+actions(button('已经办完了','complete-task')+button('还没有，返回这件事','saved-task','secondary'));
    case 'SETTINGS':return `<div class="reading-sample"><h2>明天 上午9:00</h2><p>去社区服务中心，办理公交卡年审。</p></div><p>现在使用${s.settings?.largeText?'较大的字':'通常的字'}，${s.settings?.highContrast?'对比更清楚':'通常的对比'}。</p>`+actions(button('字再大一些','large-text')+button('颜色更清楚','high-contrast','secondary')+button('恢复通常的显示','standard-display','text')+button('回到首页','elder-home','text'));
    default:return home(s);
  }
}
export function renderApp(input,catalog=[],options={}) {
  const surface=options.surface || 'elder';
  let s=input;
  if(s.currentView==='ELDER_ACCEPTED'&&s.collaborationRequest.status!=='ACCEPTED')s={...s,currentView:'ELDER_HOME',catalogScreenId:null};
  if(s.currentView==='TASK_SAVED'&&s.task.status!=='CONFIRMED')s={...s,currentView:s.task.status==='CANCELLED'?'TASK_CANCELLED':s.task.status==='COMPLETED'?'TASK_COMPLETED':'ELDER_HOME',catalogScreenId:null};
  if(['DEMO','RESET_CONFIRM','RESET_RESULT'].includes(s.currentView)||s.catalogScreenId?.startsWith('DM-'))s={...s,currentView:s.currentRole==='FAMILY'?'FAMILY_HOME':'ELDER_HOME',catalogScreenId:null};
  const id=inferScreenId(s),copy=productCopy[id] || productCopy['EL-TASK-00'];
  const family=s.currentRole==='FAMILY',kind=copy.archetype;
  const title=family&&s.currentView==='RELATIONSHIP_END_CONFIRM'?'结束和妈妈的协作？':s.currentView==='TASK_MISSING'&&!s.task.rawInput.trim()?'还没有写下要办的事':s.currentView==='TASK_SAVED'?s.task.details.title:s.currentView==='ELDER_HOME'&&s.task.status!=='COMPLETED'?'张阿姨，记一件事吧':copy.title;
  const lead=s.currentView==='REQUEST_NO_RESPONSE'?`${reminder(s)}照常提醒你。`:s.currentView==='FAMILY_HOME'?(['PENDING','NO_RESPONSE'].includes(s.collaborationRequest.status)?'有一件事等你回复。':'她有需要时，会在这里告诉你。'):s.currentView==='TASK_REMINDER'?'要办的事，别忘了。':copy.lead;
  const header=kind==='result'?`<div class="result-heading"><span class="result-mark" aria-hidden="true">${['TASK_CANCELLED','FAMILY_DECLINED','RELATIONSHIP_DECLINED'].includes(s.currentView)?'—':'✓'}</span><h1 tabindex="-1">${esc(title)}</h1><p class="lead" role="status">${esc(lead)}</p></div>`:`<header class="page-heading"><h1 tabindex="-1">${esc(title)}</h1>${kind==='home'?'':`<p class="lead" role="status">${esc(lead)}</p>`}</header>`;
  const phone=`<div class="app-shell${s.settings?.largeText?' large-text':''}${s.settings?.highContrast?' high-contrast':''}" data-product-surface><header class="topbar"><span class="brand-mark" aria-hidden="true">记</span><strong>安心记事</strong></header><main><section class="page archetype-${kind}" data-screen-id="${id}">${header}${productContent(s)}</section></main><nav class="product-nav" aria-label="主要导航">${button(family?'消息':'事情',family?'family-home':'elder-home','nav-item')}${button('家人','relationship','nav-item')}</nav></div>`;
  return surface==='review'?`<div class="review-layout">${phone}${renderReviewTools(input,catalog)}</div>`:phone;
}
