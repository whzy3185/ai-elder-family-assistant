import fs from 'node:fs';import {screenDefinitions} from '../src/screen-catalog.js';import {connectBrowser} from './browser-session.mjs';
const rules=JSON.parse(fs.readFileSync('config/presentation-purity.json','utf8')),b=await connectBrowser(),results=[],errors=[];
const visible=selector=>`(()=>{const root=document.querySelector(${JSON.stringify(selector)});return root.innerText+'\\n'+[...root.querySelectorAll('[aria-label],[placeholder],input,textarea,select')].filter(e=>e.getBoundingClientRect().height>0).map(e=>[e.getAttribute('aria-label'),e.getAttribute('placeholder'),e.value].filter(Boolean).join(' ')).join('\\n');})()`;
const hits=(text,tokens)=>tokens.filter(t=>text.toLowerCase().includes(t.toLowerCase()));
await b.navigate('/review');
for(const item of screenDefinitions){
 console.log('Scanning '+item.id);
 await b.click('.screen-index summary');await b.click(`[data-screen="${item.id}"]`);
 if(await b.evaluate('!!document.querySelector(".original")'))await b.click('.original summary');
 const productText=await b.evaluate(visible('[data-product-surface]')),reviewText=await b.evaluate(visible('.review-tools'));
 const forbidden=hits(productText,rules.productForbidden),reviewForbidden=hits(reviewText,rules.reviewForbidden);
 const enumTokens=['ACCEPTED','DECLINED','CHANGE_PROPOSED','WITHDRAWN','CANCELLED','NO_RESPONSE','SENDING','COMPLETED','NEEDS_CONFIRMATION','PARSE_FAILED',...screenDefinitions.map(i=>i.id)];
 const leaked=hits(productText+'\n'+reviewText,enumTokens);
 const controls=await b.evaluate(`({badActions:[...document.querySelectorAll('[data-product-surface] [data-action]')].map(e=>e.dataset.action).filter(a=>/^(role-|load-screen|load-demo|simulate|trigger-reminder|mark-no-response|reset$|demo$|family-request$|elder-result$)/.test(a)),navigation:document.querySelector('.product-nav').innerText})`);
 if(forbidden.length||reviewForbidden.length||leaked.length||controls.badActions.length)errors.push({id:item.id,forbidden,reviewForbidden,leaked,controls});
 results.push({id:item.id,productText,reviewText,forbidden,reviewForbidden,leaked,controls});
}
const routes=[];
for(const route of ['/','/family']){await b.navigate(route);const r=await b.evaluate(`({reviewDOM:document.querySelectorAll('.review-tools,[data-scenario],[data-screen]').length,text:document.body.innerText})`);const forbidden=hits(r.text,rules.productForbidden);routes.push({route,...r,forbidden});if(r.reviewDOM||forbidden.length)errors.push({route,...r,forbidden});}
const report={status:errors.length?'FAIL':'PASS',testedAt:new Date().toISOString(),screens:results.length,forbiddenVisibleTokens:errors.reduce((n,e)=>n+(e.forbidden?.length||0)+(e.reviewForbidden?.length||0)+(e.leaked?.length||0),0),errors,routes,results};
fs.mkdirSync('artifacts/qa/presentation-purity',{recursive:true});fs.writeFileSync('artifacts/qa/presentation-purity/results.json',JSON.stringify(report,null,2));
fs.writeFileSync('docs/validation/presentation-purity-audit.md',`# 产品可见内容自动审计\n\nP10 Gate=${report.status}。${report.testedAt}，Docker实际页面，${results.length}个产品及工具状态。\n\nForbidden visible tokens = ${report.forbiddenVisibleTokens}；错误数量=${errors.length}。扫描可见文本、展开的原话、可见输入值/提示/辅助标签；独立检查Review禁止词、内部场景/页面编号和状态枚举。产品导航禁止角色、加载场景、人工失败、时钟与重置动作。默认/和/family检查未渲染辅助DOM。\n\n机器规则：config/presentation-purity.json。原始记录：artifacts/qa/presentation-purity/results.json。此测试针对支持的预置案例；任意用户自填内容不能视为产品硬编码术语。\n`);b.close();console.log(JSON.stringify({status:report.status,hits:report.forbiddenVisibleTokens,errors}));if(errors.length)process.exitCode=1;
