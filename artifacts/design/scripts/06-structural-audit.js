const product=await figma.getNodeByIdAsync('3:2');
const demo=await figma.getNodeByIdAsync('3:3');
if(!product||product.type!=='PAGE'||!demo||demo.type!=='PAGE')throw new Error('Missing design pages');
const wantedBoards=['Board / Elder','Board / Relationship','Board / Family','Board / Demo'];
const boards=[...product.children,...demo.children].filter(n=>wantedBoards.includes(n.name));
const screens=boards.flatMap(b=>b.findAll(n=>n.type==='FRAME'&&/^(EL|FM|DM)-[A-Z0-9-]+ \/ /.test(n.name)));
const issues=[];
const rows=[];
for(const s of screens){
  const id=s.name.split(' / ')[0];
  const texts=s.findAll(n=>n.type==='TEXT');
  const copy=texts.map(n=>n.characters).join(' | ');
  const directOverflow=s.children.filter(n=>n.y+n.height>s.height-s.paddingBottom+0.5).map(n=>({id:n.id,name:n.name,bottom:n.y+n.height}));
  const fontMismatch=texts.filter(n=>n.fontName!==figma.mixed&&n.fontName.family!=='Noto Sans SC').map(n=>n.id);
  const buttons=s.children.filter(n=>n.type==='INSTANCE'&&n.mainComponent&&n.mainComponent.parent&&n.mainComponent.parent.name==='Button');
  const shortButtons=buttons.filter(n=>n.height<56).map(n=>({id:n.id,height:n.height}));
  if(Math.round(s.width)!==390||Math.round(s.height)!==844)issues.push({id,type:'viewport',value:`${s.width}x${s.height}`});
  if(directOverflow.length)issues.push({id,type:'direct-overflow',value:directOverflow});
  if(fontMismatch.length)issues.push({id,type:'font',value:fontMismatch});
  if(shortButtons.length)issues.push({id,type:'button-height',value:shortButtons});
  if(buttons.length===0)issues.push({id,type:'no-next-step'});
  rows.push({id,nodeId:s.id,copy,directOverflow:directOverflow.length,fontMismatch:fontMismatch.length,buttonCount:buttons.length});
}
const duplicateIds=rows.map(r=>r.id).filter((id,i,a)=>a.indexOf(id)!==i);
return {boardCount:boards.length,boards:boards.map(b=>({name:b.name,id:b.id,width:b.width,height:b.height})),screenCount:screens.length,screenIds:rows.map(r=>r.id).sort(),duplicateIds,issues,rows};
