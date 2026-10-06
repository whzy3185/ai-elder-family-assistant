const roleMeta = {
  Elder: { label: '老人端 · 张阿姨', avatar: '张', className: 'elder' },
  Family: { label: '家属端 · 小梅', avatar: '梅', className: 'family' },
  Demo: { label: '演示工具', avatar: '演', className: 'demo' },
};

const escapeHtml = value => String(value).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
const styleClass = value => String(value).toLowerCase();

function renderScreen(screen) {
  const role = roleMeta[screen.role];
  const fields = (screen.fields || []).map(([label, value]) => `<div class="field"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join('');
  const actions = (screen.actions || []).map(([style, label]) => `<button class="action ${styleClass(style)}" type="button">${escapeHtml(label)}</button>`).join('');
  return `<article class="screen-wrap" data-group="${escapeHtml(screen.group)}" id="${escapeHtml(screen.id)}">
    <p class="screen-label">${escapeHtml(screen.id)} · ${escapeHtml(screen.group)}</p>
    <section class="screen" aria-label="${escapeHtml(screen.id)} ${escapeHtml(screen.title)}">
      <div class="rolebar ${role.className}"><span class="avatar">${role.avatar}</span>${role.label}</div>
      <h2>${escapeHtml(screen.title)}</h2>
      <span class="badge ${styleClass(screen.tone)}">${escapeHtml(screen.status)}</span>
      <div class="card"><h3>${escapeHtml(screen.card[0])}</h3><p>${escapeHtml(screen.card[1])}</p></div>
      ${fields}
      <div class="actions">${actions}</div>
    </section>
  </article>`;
}

const params = new URLSearchParams(location.search);
const requested = params.get('screen');
const app = document.querySelector('#app');
const screens = requested ? window.DESIGN_SCREENS.filter(screen => screen.id === requested) : window.DESIGN_SCREENS;

if (requested) {
  document.body.classList.add('single');
  if (!screens.length) app.innerHTML = `<p>未找到页面：${escapeHtml(requested)}</p>`;
  else {
    document.title = `${requested}｜AI 老年家庭协作助手`;
    app.innerHTML = renderScreen(screens[0]);
  }
} else {
  app.innerHTML = screens.map(renderScreen).join('');
  const groups = ['全部', ...new Set(window.DESIGN_SCREENS.map(screen => screen.group))];
  const filters = document.querySelector('#filters');
  filters.innerHTML = groups.map((group, index) => `<button type="button" data-filter="${group}" aria-pressed="${index === 0}">${group}</button>`).join('');
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('.screen-wrap').forEach(item => item.hidden = button.dataset.filter !== '全部' && item.dataset.group !== button.dataset.filter);
  });
}
