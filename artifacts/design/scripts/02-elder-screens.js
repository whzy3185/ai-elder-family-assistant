const PAGE_ID = '3:2';
const COMPONENT = { Button: '3:75', StatusBadge: '3:86', RoleBar: '3:99', FieldRow: '3:100', InfoCard: '3:103' };
const VAR_ID = {
  canvas: 'VariableID:3:25', surface: 'VariableID:3:26', subtle: 'VariableID:3:27',
  text: 'VariableID:3:31', muted: 'VariableID:3:32', border: 'VariableID:3:34',
  sm: 'VariableID:3:48', md: 'VariableID:3:49', lg: 'VariableID:3:50', radius: 'VariableID:3:55',
};
const STYLE_ID = {
  heading: 'S:d78477fc584ca82205205e314f6ada9dcf45c13a,',
  body: 'S:86b102aade683a7b146c19030752bfcbb2ebd2a0,',
  meta: 'S:b0fda3bd2af090ae5e5a206405c696ad4b1aa6f3,',
  metaStrong: 'S:e55a9d05aefb2835d5ad760e1dd6bd8f17d55616,',
  shadow: 'S:e83dd739066d73ca40fed8d387a2deea496c686a,',
};

const screens = [
  { id:'EL-TASK-00', title:'今天要记什么事？', tone:'Neutral', status:'还没有事务', card:['从这里开始','点“记一件事”，说出或手动填写一件日常事务。'], actions:[['Primary','记一件事'],['Secondary','查看家庭协作']] },
  { id:'EL-TASK-01', title:'你想记什么事？', tone:'Info', status:'等待输入', card:['你可以这样说','明天上午九点去社区服务中心办公交卡年审，提前半小时提醒我。'], actions:[['Primary','模拟说话'],['Secondary','手动填写']] },
  { id:'EL-TASK-02', title:'正在帮你整理', tone:'Info', status:'处理中', card:['你刚才说','明天上午九点去社区服务中心办年审，提前半小时提醒，再问小梅能否陪同。'], actions:[['Quiet','返回']] },
  { id:'EL-TASK-03A', title:'看看我理解得对不对', tone:'Info', status:'需要你确认', card:['我理解的是','公交卡年审，明天上午 9:00，地点是社区服务中心。'], fields:[['提醒','提前 30 分钟'],['家属','提到希望小梅陪同']], actions:[['Primary','确认无误'],['Secondary','改一处']] },
  { id:'EL-TASK-03B', title:'时间可能不对', tone:'Warning', status:'识别错误', card:['你刚才说','你说的是上午 9:00；系统暂时整理成了上午 8:00。'], fields:[['时间','明天上午 8:00'],['提醒','上午 7:30']], actions:[['Primary','改时间'],['Secondary','改其他内容']] },
  { id:'EL-TASK-04', title:'改成几点？', tone:'Warning', status:'正在修改时间', card:['只改这一项','其他事项、日期、地点和家属意图都不会改变。'], fields:[['当前','上午 8:00'],['改为','上午 9:00']], actions:[['Primary','改成上午 9:00'],['Secondary','不改了']] },
  { id:'EL-TASK-05', title:'再看一遍', tone:'Info', status:'确认后才会记好', card:['最终安排','明天上午 9:00（10 月 7 日）去社区服务中心办理公交卡年审。'], fields:[['提醒','明天上午 8:30'],['协作','稍后决定是否告诉小梅']], actions:[['Primary','确认记好'],['Secondary','返回修改']] },
  { id:'EL-TASK-06', title:'这件事已记好', tone:'Success', status:'个人提醒已保存', card:['明天的安排','上午 9:00 去社区服务中心办理公交卡年审。'], fields:[['提醒','明天上午 8:30'],['家属','还没有告诉小梅']], actions:[['Primary','请小梅陪同'],['Secondary','只提醒我自己']] },
  { id:'EL-TASK-07', title:'该准备出发了', tone:'Warning', status:'提醒已触发', card:['今天上午 9:00','去社区服务中心办理公交卡年审。小梅是否陪同以她的回复为准。'], actions:[['Primary','知道了'],['Secondary','查看这件事']] },
  { id:'EL-TASK-08', title:'修改已共享的事情', tone:'Warning', status:'旧请求会失效', card:['修改的影响','时间、地点或所需帮助改变后，小梅不能再回应旧请求。'], actions:[['Primary','继续修改'],['Secondary','暂不修改']] },
  { id:'EL-TASK-09A', title:'这件事已经办完了吗？', tone:'Warning', status:'需要确认', card:['确认完成','只有现实中的公交卡年审已经办完，才选择完成。'], actions:[['Primary','这件事办完了'],['Secondary','还没有']] },
  { id:'EL-TASK-09B', title:'这件事已完成', tone:'Success', status:'已完成', card:['已停止提醒','公交卡年审已由你确认完成。小梅此前的回应仅作记录。'], actions:[['Primary','返回首页']] },
  { id:'EL-TASK-10', title:'当前事务已结束', tone:'Neutral', status:'完成或取消', card:['你接下来可以','查看这次结果，或者重新记一件新的事情。'], actions:[['Primary','记一件新事'],['Secondary','查看结果']] },
  { id:'EL-EX-01', title:'还需要知道时间', tone:'Warning', status:'必要信息缺失', card:['我不会替你猜','已经保留事项、日期和地点，只需要补上具体时间。'], actions:[['Primary','补上时间'],['Secondary','返回输入']] },
  { id:'EL-EX-02A', title:'这次没有整理好', tone:'Danger', status:'AI 解析失败', card:['你的原话还在','没有创建事务，也没有告诉小梅。你可以重试或手动填写。'], actions:[['Primary','再试一次'],['Secondary','手动填写']] },
  { id:'EL-EX-02B', title:'手动填写', tone:'Info', status:'不依赖 AI', card:['填写这件事','输入后仍会让你检查，确认之前不会保存。'], fields:[['事项','办理公交卡年审'],['时间','明天上午 9:00']], actions:[['Primary','保存并检查'],['Secondary','返回']] },
  { id:'EL-SHARE-01', title:'要请小梅陪你去吗？', tone:'Neutral', status:'还没有共享', card:['个人提醒已经设好','无论是否邀请小梅，明天上午 8:30 都会提醒你。'], actions:[['Primary','请小梅陪我去'],['Secondary','只提醒我自己']] },
  { id:'EL-SHARE-01B', title:'只提醒你自己', tone:'Neutral', status:'没有共享', card:['没有告诉小梅','明天上午 8:30 仍会提醒你，家属端不会出现请求。'], actions:[['Primary','返回这件事']] },
  { id:'EL-SHARE-02', title:'这次小梅会看到', tone:'Info', status:'等待你确认共享', card:['只分享这五项','事项、日期、时间、地点，以及希望小梅陪同。不会分享提醒、原话或位置。'], actions:[['Primary','发给小梅'],['Secondary','暂不发送']] },
  { id:'EL-SHARE-03', title:'正在发给小梅', tone:'Info', status:'发送中', card:['还不能算已收到','请稍等。你的个人事务和提醒已经安全保存。'], actions:[['Quiet','请稍等']] },
  { id:'EL-SHARE-04A', title:'已经发给小梅', tone:'Success', status:'发送成功', card:['请求已经送出','接下来等待小梅选择接受、拒绝或建议改期。'], actions:[['Primary','查看等待状态']] },
  { id:'EL-SHARE-04B', title:'正在等小梅回复', tone:'Info', status:'等待回应', card:['你的提醒已经设好','小梅还没有回复。明天上午 8:30 仍会提醒你。'], actions:[['Primary','继续等待'],['Secondary','撤回请求']] },
  { id:'EL-SHARE-05', title:'小梅答应陪你去', tone:'Success', status:'已接受', card:['协作结果','小梅会陪同。公交卡年审仍需你在现实办完后确认完成。'], actions:[['Primary','知道了'],['Secondary','查看这件事']] },
  { id:'EL-SHARE-06', title:'小梅这次不能陪同', tone:'Warning', status:'已拒绝', card:['你的事情没有取消','明天上午 8:30 仍会提醒你，你可以自行安排。'], actions:[['Primary','我自己安排'],['Danger','取消这件事']] },
  { id:'EL-SHARE-07', title:'小梅建议改到下午 2 点', tone:'Warning', status:'等待你决定', card:['原时间仍是上午 9:00','只有你同意以后，事务时间才会改变。'], actions:[['Primary','改成下午 2 点'],['Secondary','还是上午 9 点'],['Quiet','撤回请求']] },
  { id:'EL-SHARE-08', title:'新时间还没有重新分享', tone:'Warning', status:'旧请求已失效', card:['事务已改为下午 2 点','小梅原来的答复不会自动继承，你需要决定是否重新发送。'], actions:[['Primary','重新发给小梅'],['Secondary','只保留事务']] },
  { id:'EL-SHARE-09', title:'仍按上午 9 点', tone:'Info', status:'继续等待回应', card:['没有接受改期','事务时间没有改变，小梅可以继续回应原请求。'], actions:[['Primary','继续等待'],['Secondary','撤回请求']] },
  { id:'EL-EX-03', title:'还没有发给小梅', tone:'Danger', status:'发送失败', card:['个人内容没有丢失','事情和明天上午 8:30 的提醒仍在，家属端没有假请求。'], actions:[['Primary','再试一次'],['Secondary','暂不发送']] },
  { id:'EL-EX-04', title:'小梅还没有回复', tone:'Warning', status:'暂未回应', card:['这不是拒绝','你可以继续等、撤回陪同请求，或者决定自己安排。'], actions:[['Primary','继续等一等'],['Secondary','撤回请求'],['Quiet','我自己安排']] },
  { id:'EL-EX-05A', title:'确定不用小梅陪了吗？', tone:'Warning', status:'撤回请求确认', card:['只撤回陪同请求','公交卡年审和明天上午 8:30 的提醒都会保留。'], actions:[['Danger','确认撤回请求'],['Secondary','返回']] },
  { id:'EL-EX-05B', title:'已告诉小梅不用陪同', tone:'Success', status:'请求已撤回', card:['你的事情还在','明天上午 8:30 仍会提醒你。'], actions:[['Primary','返回这件事']] },
  { id:'EL-EX-06A', title:'确定取消这件事吗？', tone:'Danger', status:'取消事务确认', card:['取消后的影响','事务和提醒都会取消，小梅也不能再回应原请求。'], actions:[['Danger','确认取消这件事'],['Secondary','返回']] },
  { id:'EL-EX-06B', title:'这件事已取消', tone:'Danger', status:'已取消', card:['全部相关状态已结束','提醒已取消，给小梅的请求也已失效。'], actions:[['Primary','返回首页']] },
  { id:'EL-EX-07A', title:'修改后旧请求会失效', tone:'Warning', status:'版本变更确认', card:['需要重新分享','小梅看到的旧时间和旧答复不会带到新版本。'], actions:[['Primary','确认保存新版本'],['Secondary','返回']] },
  { id:'EL-EX-07B', title:'新版本已经保存', tone:'Info', status:'尚未共享新版本', card:['旧请求已经失效','你可以重新查看共享内容后发送，或者只保留个人提醒。'], actions:[['Primary','查看并重新发送'],['Secondary','只提醒我自己']] },
  { id:'EL-SET-01', title:'显示设置', tone:'Neutral', status:'P1 可选能力', card:['默认已经适老','可在 P0 完成后提供标准 / 大字和高对比切换。'], fields:[['文字大小','大字'],['对比度','标准']], actions:[['Primary','保存显示设置'],['Secondary','恢复默认']] },
];

const page = await figma.getNodeByIdAsync(PAGE_ID);
if (!page || page.type !== 'PAGE') throw new Error('Product Screens page missing');
await figma.setCurrentPageAsync(page);
const existing = page.findAllWithCriteria({ types:['FRAME'] }).find(n => n.name === 'Board / Elder');
if (existing) return { status:'already_exists', rootNodeId:existing.id, createdNodeIds:[] };

await Promise.all([
  figma.loadFontAsync({family:'Noto Sans SC',style:'Regular'}),
  figma.loadFontAsync({family:'Noto Sans SC',style:'Medium'}),
  figma.loadFontAsync({family:'Noto Sans SC',style:'Bold'}),
]);
const [buttonSet,badgeSet,roleSet,fieldRow,infoCard] = await Promise.all(Object.values(COMPONENT).map(id=>figma.getNodeByIdAsync(id)));
const varEntries = Object.entries(VAR_ID);
const varValues = await Promise.all(varEntries.map(([,id])=>figma.variables.getVariableByIdAsync(id)));
const V = {}; varEntries.forEach(([k],i)=>V[k]=varValues[i]);
const styleEntries = Object.entries(STYLE_ID);
const styleValues = await Promise.all(styleEntries.map(([,id])=>figma.getStyleByIdAsync(id)));
const S = {}; styleEntries.forEach(([k],i)=>S[k]=styleValues[i]);
const created=[]; const pendingStyles=[];
function bind(v){return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',v);}
function addTree(n){created.push(n.id);if('findAll'in n)for(const d of n.findAll(()=>true))created.push(d.id);}
function variant(set,key,value){const n=set.children.find(c=>c.name===`${key}=${value}`);if(!n)throw new Error(`Missing ${key}=${value}`);return n;}
function textKey(inst,prefix){const e=Object.entries(inst.componentProperties).find(([k,v])=>k.startsWith(prefix)&&v.type==='TEXT');if(!e)throw new Error(`Missing text prop ${prefix}`);return e[0];}
function inst(source,props){const i=source.createInstance();addTree(i);if(props)i.setProperties(props);return i;}
function makeText(name,value,styleKey,width,color){const t=figma.createText();created.push(t.id);t.name=name;t.fontName={family:'Noto Sans SC',style:'Regular'};t.textAutoResize='HEIGHT';t.resize(width,24);t.characters=value;t.fills=[bind(color)];pendingStyles.push([t,S[styleKey].id]);return t;}
function role(){return inst(variant(roleSet,'Role','Elder'));}
function badge(tone,label){const i=inst(variant(badgeSet,'Tone',tone));i.setProperties({[textKey(i,'Label')]:label});return i;}
function card(title,body){const i=inst(infoCard);i.setProperties({[textKey(i,'Title')]:title,[textKey(i,'Body')]:body});return i;}
function field(label,value){const i=inst(fieldRow);i.setProperties({[textKey(i,'Label')]:label,[textKey(i,'Value')]:value});return i;}
function button(style,label){const i=inst(variant(buttonSet,'Style',style));i.setProperties({[textKey(i,'Label')]:label});return i;}

const board=figma.createAutoLayout('VERTICAL');created.push(board.id);board.name='Board / Elder';board.resize(1900,100);board.counterAxisSizingMode='FIXED';board.primaryAxisSizingMode='AUTO';board.paddingTop=32;board.paddingBottom=32;board.paddingLeft=32;board.paddingRight=32;board.itemSpacing=24;board.fills=[bind(V.subtle)];board.cornerRadius=24;board.x=0;board.y=0;
const boardTitle=makeText('Board title','老人端｜事务、协作与异常状态','heading',1836,V.text);board.appendChild(boardTitle);
const boardNote=makeText('Board note','36 个可独立定位的 390×844 高保真画面；每个画面显示当前状态、影响和下一步。','body',1836,V.muted);board.appendChild(boardNote);
const grid=figma.createAutoLayout('HORIZONTAL');created.push(grid.id);grid.name='Elder screen grid';grid.resize(1836,100);grid.primaryAxisSizingMode='FIXED';grid.counterAxisSizingMode='AUTO';grid.layoutWrap='WRAP';grid.itemSpacing=56;grid.counterAxisSpacing=72;grid.fills=[];board.appendChild(grid);

const frameIds={};
for(const spec of screens){
  const screen=figma.createAutoLayout('VERTICAL');created.push(screen.id);screen.name=`${spec.id} / ${spec.title}`;screen.resize(390,844);screen.primaryAxisSizingMode='FIXED';screen.counterAxisSizingMode='FIXED';screen.paddingTop=24;screen.paddingBottom=24;screen.paddingLeft=24;screen.paddingRight=24;screen.itemSpacing=12;screen.fills=[bind(V.canvas)];screen.strokes=[bind(V.border)];screen.strokeWeight=1;screen.cornerRadius=24;screen.effectStyleId=S.shadow.id;screen.clipsContent=true;
  screen.appendChild(role());
  screen.appendChild(makeText('Page title',spec.title,'heading',342,V.text));
  screen.appendChild(badge(spec.tone,spec.status));
  if(spec.card)screen.appendChild(card(spec.card[0],spec.card[1]));
  for(const [label,value] of (spec.fields||[]))screen.appendChild(field(label,value));
  for(const [style,label] of (spec.actions||[]))screen.appendChild(button(style,label));
  grid.appendChild(screen);frameIds[spec.id]=screen.id;
}
await Promise.all(pendingStyles.map(([node,id])=>node.setTextStyleIdAsync(id)));
return {status:'created',rootNodeId:board.id,createdNodeIds:[...new Set(created)],screenCount:screens.length,screenIds:frameIds,bounds:{width:board.width,height:board.height}};
