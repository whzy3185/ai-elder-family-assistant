import fs from 'node:fs';
import { screenDefinitions,screenSnapshot } from '../src/screen-catalog.js';
import { connectBrowser } from './browser-session.mjs';
const out=process.env.SCREENSHOT_DIR||'artifacts/qa/product-reconstruction';fs.mkdirSync(out,{recursive:true});
const b=await connectBrowser(),results=[];
await b.navigate('/review');
for(const item of screenDefinitions.filter(s=>!s.id.startsWith('DM-'))){
 await b.click('.screen-index summary');await b.click(`[data-screen="${item.id}"]`);
 const data=await b.evaluate(`({id:document.querySelector('.page').dataset.screenId,text:document.querySelector('[data-product-surface]').innerText,actions:[...document.querySelectorAll('[data-product-surface] [data-action]')].map(e=>e.dataset.action),width:document.documentElement.scrollWidth,errors:document.querySelectorAll('[data-product-surface] .review-tools').length})`);
 if(data.id!==item.id)throw Error('Incorrect page '+item.id+' '+data.id);
 await b.screenshot(`${out}/${item.id}.png`,'[data-product-surface]');results.push(data);
}
fs.writeFileSync(out+'/results.json',JSON.stringify({testedAt:new Date().toISOString(),count:results.length,results},null,2));
b.close();console.log('Captured '+results.length+' product pages');
