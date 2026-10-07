import { productCopy } from './product-copy.js';
const b=(label,action)=>`<button type="button" class="button secondary" data-action="${action}">${label}</button>`;
export function renderReviewTools(state,catalog=[]) {
 return `<aside class="review-tools"><h2>评审辅助</h2><p>用于快速查看不同演示情况，不属于正式产品功能。</p><section><h3>当前身份：${state.currentRole==='FAMILY'?'小梅':'张阿姨'}</h3>${b('切换到张阿姨','role-elder')}${b('切换到小梅','role-family')}</section><details class="screen-index"><summary>查看全部画面</summary>${catalog.map(item=>`<button type="button" class="catalog-link" data-action="load-screen" data-screen="${item.id}">${productCopy[item.id].title}${item.id.startsWith('FM-')?' · 小梅':item.id.startsWith('DM-')?' · 辅助工具':' · 张阿姨'}</button>`).join('')}</details></aside>`;
}
