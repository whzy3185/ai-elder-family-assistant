const PAGE_ID='3:2';
const C={Button:'3:75',StatusBadge:'3:86',RoleBar:'3:99',FieldRow:'3:100',InfoCard:'3:103'};
const VID={canvas:'VariableID:3:25',subtle:'VariableID:3:27',text:'VariableID:3:31',muted:'VariableID:3:32',border:'VariableID:3:34'};
const SID={heading:'S:d78477fc584ca82205205e314f6ada9dcf45c13a,',body:'S:86b102aade683a7b146c19030752bfcbb2ebd2a0,',shadow:'S:e83dd739066d73ca40fed8d387a2deea496c686a,'};
const specs=[
 {id:'EL-REL-01',role:'Elder',title:'邀请小梅建立家庭协作',tone:'Info',status:'首次建立关系',card:['让家人扫码','二维码只用于确认双方身份，不会自动共享事务、位置或历史。'],actions:[['Primary','显示二维码'],['Secondary','以后再说']]},
 {id:'FM-REL-01',role:'Family',title:'扫描张阿姨的二维码',tone:'Info',status:'等待扫码',card:['你将申请成为协助者','建立后只能收到张阿姨主动发来的具体请求。'],actions:[['Primary','模拟扫码'],['Secondary','取消']]},
 {id:'EL-REL-02',role:'Elder',title:'小梅想和你建立协作',tone:'Warning',status:'需要你确认',card:['请核对身份','小梅（女儿）提出申请。她不会自动看到你的提醒、历史或位置。'],actions:[['Primary','同意建立'],['Secondary','暂不同意'],['Quiet','她能看到什么']]},
 {id:'EL-REL-02A',role:'Elder',title:'小梅能看到什么？',tone:'Info',status:'权限说明',card:['只有你每次主动发出的内容','事项、日期、时间、地点、希望她提供的帮助。'],fields:[['默认不可见','提醒时间、原话、位置、历史事务'],['控制方式','每件事单独确认']],actions:[['Primary','我明白了'],['Secondary','返回']]},
 {id:'EL-REL-03',role:'Elder',title:'已建立家庭协作',tone:'Success',status:'关系已确认',card:['现在可以向小梅求助','建立关系不等于永久共享；每件事务仍由你决定是否发送。'],actions:[['Primary','继续记事'],['Secondary','管理关系']]},
 {id:'FM-REL-03',role:'Family',title:'已和张阿姨建立协作',tone:'Success',status:'关系已确认',card:['你的权限','只能回应她主动发来的单次请求，不能改、删或完成她的事务。'],actions:[['Primary','查看请求'],['Secondary','返回首页']]},
 {id:'EL-REL-06',role:'Elder',title:'已拒绝这次申请',tone:'Neutral',status:'没有建立关系',card:['小梅不会获得协作权限','以后需要时，可以重新发起建立关系。'],actions:[['Primary','返回']]},
 {id:'FM-REL-02',role:'Family',title:'正在等张阿姨确认',tone:'Warning',status:'申请待确认',card:['暂时不能查看任何事务','请让张阿姨在自己的设备上决定是否同意。'],actions:[['Primary','知道了']]},
 {id:'EL-REL-07',role:'Elder',title:'申请已失效',tone:'Danger',status:'二维码过期',card:['没有建立关系','请重新显示二维码。失效二维码不能继续使用。'],actions:[['Primary','重新生成'],['Secondary','返回']]},
 {id:'EL-REL-04A',role:'Elder',title:'要解除与小梅的协作吗？',tone:'Warning',status:'需要再次确认',card:['解除后的影响','未处理请求会撤回；小梅不能再收到新的请求。个人提醒不受影响。'],actions:[['Danger','确认解除'],['Secondary','保留关系']]},
 {id:'EL-REL-05',role:'Elder',title:'已解除家庭协作',tone:'Success',status:'关系已解除',card:['小梅已无法继续查看请求','你的个人事务和提醒仍保留。以后可重新建立关系。'],actions:[['Primary','返回首页']]},
 {id:'FM-REL-04',role:'Family',title:'家庭协作已解除',tone:'Neutral',status:'无法继续回应',card:['张阿姨已解除关系','此前请求只保留结果摘要，不再显示事务详情。'],actions:[['Primary','知道了']]}
];
const page=await figma.getNodeByIdAsync(PAGE_ID);if(!page||page.type!=='PAGE')throw new Error('Missing page');await figma.setCurrentPageAsync(page);
await Promise.all([{family:'Noto Sans SC',style:'Regular'},{family:'Noto Sans SC',style:'Medium'},{family:'Noto Sans SC',style:'Bold'}].map(f=>figma.loadFontAsync(f)));
const [buttonSet,badgeSet,roleSet,fieldRow,infoCard]=await Promise.all(Object.values(C).map(id=>figma.getNodeByIdAsync(id)));
const vars=await Promise.all(Object.values(VID).map(id=>figma.variables.getVariableByIdAsync(id)));const V={};Object.keys(VID).forEach((k,i)=>V[k]=vars[i]);
const styles=await Promise.all(Object.values(SID).map(id=>figma.getStyleByIdAsync(id)));const S={};Object.keys(SID).forEach((k,i)=>S[k]=styles[i]);
const created=[],pending=[];const bind=v=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',v);
function add(n){created.push(n.id);if('findAll'in n)for(const d of n.findAll(()=>true))created.push(d.id)}
function variant(set,k,v){const n=set.children.find(x=>x.name===`${k}=${v}`);if(!n)throw new Error(`Missing ${k}=${v}`);return n}
function key(i,p){const e=Object.entries(i.componentProperties).find(([k,v])=>k.startsWith(p)&&v.type==='TEXT');if(!e)throw new Error(`Missing ${p}`);return e[0]}
function ins(src,label){const i=src.createInstance();add(i);if(label)i.setProperties({[key(i,'Label')]:label});return i}
function txt(name,value,style,w,color){const t=figma.createText();created.push(t.id);t.name=name;t.fontName={family:'Noto Sans SC',style:'Regular'};t.textAutoResize='HEIGHT';t.resize(w,24);t.characters=value;t.fills=[bind(color)];pending.push([t,S[style].id]);return t}
function badge(t,l){return ins(variant(badgeSet,'Tone',t),l)}
function card(a,b){const i=infoCard.createInstance();add(i);i.setProperties({[key(i,'Title')]:a,[key(i,'Body')]:b});return i}
function field(a,b){const i=fieldRow.createInstance();add(i);i.setProperties({[key(i,'Label')]:a,[key(i,'Value')]:b});return i}
function button(s,l){return ins(variant(buttonSet,'Style',s),l)}
const board=figma.createAutoLayout('VERTICAL');created.push(board.id);board.name='Board / Relationship';board.resize(1900,100);board.counterAxisSizingMode='FIXED';board.primaryAxisSizingMode='AUTO';board.paddingTop=32;board.paddingBottom=32;board.paddingLeft=32;board.paddingRight=32;board.itemSpacing=24;board.fills=[bind(V.subtle)];board.cornerRadius=24;board.x=0;board.y=8500;
board.appendChild(txt('Board title','首次协作关系｜双方确认与最小权限','heading',1836,V.text));board.appendChild(txt('Board note','12 个独立画面；覆盖发起、扫码、授权说明、同意、拒绝、失效与解除。','body',1836,V.muted));
const grid=figma.createAutoLayout('HORIZONTAL');created.push(grid.id);grid.name='Relationship screen grid';grid.resize(1836,100);grid.primaryAxisSizingMode='FIXED';grid.counterAxisSizingMode='AUTO';grid.layoutWrap='WRAP';grid.itemSpacing=56;grid.counterAxisSpacing=72;grid.fills=[];board.appendChild(grid);
const ids={};for(const s of specs){const f=figma.createAutoLayout('VERTICAL');created.push(f.id);f.name=`${s.id} / ${s.title}`;f.resize(390,844);f.primaryAxisSizingMode='FIXED';f.counterAxisSizingMode='FIXED';f.paddingTop=24;f.paddingBottom=24;f.paddingLeft=24;f.paddingRight=24;f.itemSpacing=12;f.fills=[bind(V.canvas)];f.strokes=[bind(V.border)];f.strokeWeight=1;f.cornerRadius=24;f.effectStyleId=S.shadow.id;f.clipsContent=true;f.appendChild(ins(variant(roleSet,'Role',s.role)));f.appendChild(txt('Page title',s.title,'heading',342,V.text));f.appendChild(badge(s.tone,s.status));f.appendChild(card(...s.card));for(const x of(s.fields||[]))f.appendChild(field(...x));for(const x of(s.actions||[]))f.appendChild(button(...x));grid.appendChild(f);ids[s.id]=f.id}
await Promise.all(pending.map(([n,id])=>n.setTextStyleIdAsync(id)));return{status:'created',rootNodeId:board.id,createdNodeIds:[...new Set(created)],screenCount:specs.length,screenIds:ids,bounds:{width:board.width,height:board.height}};
