import { FIXED_INPUT } from './state/initial-state.js';

const escapeHtml = value => String(value ?? '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
const roleLabel = role => role === 'FAMILY' ? '家属端 · 小梅' : '老人端 · 张阿姨';

function page(title, status, body, actions = '') {
  return `<section class="page"><h1>${title}</h1><p class="status">${status}</p>${body}<div class="page-actions">${actions}</div></section>`;
}

function button(label, action, style = 'primary') {
  return `<button class="button ${style}" type="button" data-action="${action}">${label}</button>`;
}

function elderView(state) {
  switch (state.currentView) {
    case 'TASK_INPUT':
      return page('你想记什么事？', '等待输入', `<label class="input-label" for="task-input">可以说，也可以手动填写</label><textarea id="task-input" data-test="task-input">${escapeHtml(state.task.rawInput || FIXED_INPUT)}</textarea><p class="hint">演示使用预置内容，不会调用真实语音或 AI。</p>`, button('帮我整理', 'submit-task') + button('返回首页', 'elder-home', 'secondary'));
    case 'TASK_PROCESSING':
      return page('正在帮你整理', '处理中', `<article class="card"><h2>你刚才说</h2><p>${escapeHtml(state.task.rawInput)}</p></article><p class="hint">这里只整理当前输入，不会创建事务或通知家属。</p>`, button('立即显示结果', 'finish-parsing', 'secondary'));
    case 'TASK_CONFIRM': {
      const d = state.task.details;
      return page('看看我理解得对不对', '需要你确认', `<article class="card"><h2>最终安排</h2><dl class="details"><div><dt>事情</dt><dd>${d.title}</dd></div><div><dt>日期</dt><dd>明天（10 月 7 日）</dd></div><div><dt>时间</dt><dd>上午 ${d.time}</dd></div><div><dt>地点</dt><dd>${d.location}</dd></div><div><dt>提醒</dt><dd>上午 8:30</dd></div></dl></article><p class="hint">确认以后只保存你的事务和提醒；还不会告诉小梅。</p>`, button('确认记好', 'confirm-task') + button('返回修改', 'task-input', 'secondary'));
    }
    case 'TASK_SAVED':
      return page('这件事已记好', '个人提醒已保存', `<article class="card success-card"><h2>明天上午 9:00</h2><p>去社区服务中心办理公交卡年审。</p></article><div class="notice"><strong>提醒：</strong>明天上午 8:30<br><strong>家属：</strong>还没有告诉小梅</div>`, button('返回首页', 'elder-home') + button('查看家庭协作', 'relationship', 'secondary'));
    default:
      return page('今天要记什么事？', state.task.status === 'CONFIRMED' ? '已有 1 件事务' : '还没有事务', state.task.status === 'CONFIRMED' ? `<article class="card"><h2>公交卡年审</h2><p>明天上午 9:00 · 社区服务中心</p><p>上午 8:30 提醒你</p></article>` : `<article class="card"><h2>从这里开始</h2><p>点“记一件事”，说出或手动填写一件日常事务。</p></article>`, button('记一件事', 'task-input') + button('家庭协作', 'relationship', 'secondary'));
  }
}

function familyView(state) {
  const request = state.collaborationRequest;
  return page('张阿姨的协作请求', request.status === 'NONE' ? '暂时没有新请求' : request.status, `<article class="card"><h2>${request.status === 'NONE' ? '你只会看到她主动发送的事情' : '公交卡年审'}</h2><p>${request.status === 'NONE' ? '不会显示她的其他提醒、位置、历史或语音原话。' : '明天上午 9:00 · 社区服务中心'}</p></article>`, button('切换到张阿姨端', 'role-elder', 'secondary'));
}

function relationshipView(state) {
  const active = state.relationship.status === 'ACTIVE';
  return page('家庭协作', active ? '已和小梅建立协作' : '尚未建立关系', `<article class="card"><h2>${active ? '每件事仍需单独确认' : '建立关系需要双方确认'}</h2><p>${active ? '小梅只能看到你主动发给她的具体请求。' : '关系建立不会自动共享提醒、历史、位置或其他事务。'}</p></article>`, active ? button('返回老人首页', 'elder-home') : button('模拟双方确认建立', 'establish-relationship') + button('暂不建立', 'elder-home', 'secondary'));
}

function demoView(state) {
  return page('演示控制台', '所有数据均为预置', `<article class="card"><h2>固定演示时钟</h2><p>2026 年 10 月 6 日 20:00</p><p>当前场景：${escapeHtml(state.demoScenario)}</p></article><p class="hint">不会调用真实 AI、消息、定位、数据库或外部服务。</p>`, button('恢复初始状态', 'reset', 'danger'));
}

export function renderApp(state) {
  const content = state.currentView === 'FAMILY_HOME' ? familyView(state) : state.currentView === 'RELATIONSHIP' ? relationshipView(state) : state.currentView === 'DEMO' ? demoView(state) : elderView(state);
  return `<div class="app-shell"><header class="topbar"><div><span class="avatar">${state.currentRole === 'FAMILY' ? '梅' : '张'}</span><strong>${roleLabel(state.currentRole)}</strong></div><span class="version">Prototype 0.7</span></header><main>${content}</main><nav class="bottom-nav" aria-label="主要导航"><button data-action="role-elder" class="${state.currentRole === 'ELDER' ? 'active' : ''}">老人端</button><button data-action="role-family" class="${state.currentRole === 'FAMILY' ? 'active' : ''}">家属端</button><button data-action="relationship">协作</button><button data-action="demo">演示</button></nav></div>`;
}
