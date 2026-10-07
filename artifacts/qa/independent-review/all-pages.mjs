import fs from 'node:fs';
import crypto from 'node:crypto';
import * as u from './ui.mjs';
const matrix=fs.readFileSync('docs/product/page-state-matrix.md','utf8');
const ids=[...matrix.matchAll(/^\| `([A-Z]+-[A-Z]+-[0-9A-Z]+|DM-[0-9A-Z]+)` \|/gm)].map(x=>x[1]);
const index=JSON.parse(fs.readFileSync('exports/prototype-index.json'));
const rows=[];
for(const id of ids){await u.action('demo');await u.click('.screen-index summary');await u.click(`[data-screen="${id}"]`);const s=await u.snap(`pages-${id}`);const actual=await u.read(`(()=>{const p=document.querySelector('.page');let issues=[];for(let e of p.querySelectorAll('*')){let r=e.getBoundingClientRect();if(r.height&&(r.left<-.5||r.right>390.5))issues.push({type:'overflow',text:e.innerText.slice(0,40)})}return {id:p.dataset.screenId,issues}})()`);const item=index.find(x=>x.id===id);let buf=fs.readFileSync(`exports/${item.image}`);rows.push({id,actual:actual.id,title:s.title,web:actual.id===id?'PASS':'FAIL',staticExists:!!buf,staticHashMatches:crypto.createHash('sha256').update(buf).digest('hex')===item.imageSha256,pdfPage:item.pdfPage,issues:actual.issues});}
fs.writeFileSync('artifacts/qa/independent-review/page-coverage.json',JSON.stringify({idsCount:ids.length,indexCount:index.length,rows},null,2));u.close();
