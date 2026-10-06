const createdNodeIds = [];
const createdPageIds = [];

function rgba(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
    a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
  };
}

function solid(hex) {
  const c = rgba(hex);
  return { type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a };
}

function bindPaint(variable) {
  return figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
    'color',
    variable,
  );
}

function webName(name) {
  return `var(--${name.replace(/[\s/]+/g, '-').toLowerCase()})`;
}

const fontRegular = { family: 'Noto Sans SC', style: 'Regular' };
const fontMedium = { family: 'Noto Sans SC', style: 'Medium' };
const fontBold = { family: 'Noto Sans SC', style: 'Bold' };
await Promise.all([
  figma.loadFontAsync(fontRegular),
  figma.loadFontAsync(fontMedium),
  figma.loadFontAsync(fontBold),
]);

const foundationPage = figma.currentPage;
if (foundationPage.name === 'Page 1') foundationPage.name = '00 Foundations';
createdPageIds.push(foundationPage.id);
for (const name of ['01 Product Screens', '02 Demo']) {
  let page = figma.root.children.find(p => p.name === name);
  if (!page) {
    page = figma.createPage();
    page.name = name;
  }
  createdPageIds.push(page.id);
}

const existingCollections = await figma.variables.getLocalVariableCollectionsAsync();
function collection(name) {
  let c = existingCollections.find(x => x.name === name);
  if (!c) {
    c = figma.variables.createVariableCollection(name);
    c.renameMode(c.modes[0].modeId, 'Default');
    existingCollections.push(c);
  }
  return c;
}

const primitiveCollection = collection('AI Elder / Primitives');
const semanticCollection = collection('AI Elder / Semantic');
const sizeCollection = collection('AI Elder / Size');
const primitiveMode = primitiveCollection.modes[0].modeId;
const semanticMode = semanticCollection.modes[0].modeId;
const sizeMode = sizeCollection.modes[0].modeId;

const allExistingVars = await figma.variables.getLocalVariablesAsync();
function existingVar(coll, name) {
  return allExistingVars.find(v => v.variableCollectionId === coll.id && v.name === name);
}

const primitiveDefs = {
  'teal/800': '#155C55',
  'teal/700': '#176B62',
  'teal/100': '#DDF3EF',
  'navy/900': '#15313B',
  'cream/050': '#F7F4EC',
  'white/1000': '#FFFFFF',
  'gray/050': '#F5F7F6',
  'gray/100': '#EBEFED',
  'gray/300': '#BCC8C4',
  'gray/600': '#536762',
  'green/700': '#276749',
  'green/100': '#DFF3E7',
  'amber/700': '#8A5B08',
  'amber/100': '#FFF1C7',
  'red/700': '#A63B32',
  'red/100': '#FBE4E1',
  'blue/700': '#245D82',
  'blue/100': '#DFEFF8',
};

const primitive = {};
for (const [name, value] of Object.entries(primitiveDefs)) {
  let v = existingVar(primitiveCollection, name);
  if (!v) v = figma.variables.createVariable(name, primitiveCollection, 'COLOR');
  v.setValueForMode(primitiveMode, rgba(value));
  v.scopes = [];
  v.setVariableCodeSyntax('WEB', webName(`primitive/${name}`));
  primitive[name] = v;
}

const semanticDefs = [
  ['color/bg/canvas', 'cream/050', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/bg/surface', 'white/1000', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/bg/subtle', 'gray/050', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/bg/elder', 'teal/100', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/bg/family', 'blue/100', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/bg/demo', 'amber/100', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/text/primary', 'navy/900', ['TEXT_FILL']],
  ['color/text/secondary', 'gray/600', ['TEXT_FILL']],
  ['color/text/on-brand', 'white/1000', ['TEXT_FILL']],
  ['color/border/default', 'gray/300', ['STROKE_COLOR']],
  ['color/action/primary', 'teal/700', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/action/primary-strong', 'teal/800', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/action/danger', 'red/700', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/state/success-bg', 'green/100', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/state/success-text', 'green/700', ['TEXT_FILL']],
  ['color/state/warning-bg', 'amber/100', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/state/warning-text', 'amber/700', ['TEXT_FILL']],
  ['color/state/danger-bg', 'red/100', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/state/danger-text', 'red/700', ['TEXT_FILL']],
  ['color/state/info-bg', 'blue/100', ['FRAME_FILL', 'SHAPE_FILL']],
  ['color/state/info-text', 'blue/700', ['TEXT_FILL']],
];

const semantic = {};
for (const [name, target, scopes] of semanticDefs) {
  let v = existingVar(semanticCollection, name);
  if (!v) v = figma.variables.createVariable(name, semanticCollection, 'COLOR');
  v.setValueForMode(semanticMode, figma.variables.createVariableAlias(primitive[target]));
  v.scopes = scopes;
  v.setVariableCodeSyntax('WEB', webName(name));
  semantic[name] = v;
}

const sizeDefs = [
  ['spacing/2xs', 4, ['GAP']],
  ['spacing/xs', 8, ['GAP']],
  ['spacing/sm', 12, ['GAP']],
  ['spacing/md', 16, ['GAP']],
  ['spacing/lg', 24, ['GAP']],
  ['spacing/xl', 32, ['GAP']],
  ['spacing/2xl', 48, ['GAP']],
  ['radius/sm', 8, ['CORNER_RADIUS']],
  ['radius/md', 14, ['CORNER_RADIUS']],
  ['radius/lg', 20, ['CORNER_RADIUS']],
  ['radius/full', 999, ['CORNER_RADIUS']],
  ['control/main-height', 56, ['WIDTH_HEIGHT']],
];

const sizes = {};
for (const [name, value, scopes] of sizeDefs) {
  let v = existingVar(sizeCollection, name);
  if (!v) v = figma.variables.createVariable(name, sizeCollection, 'FLOAT');
  v.setValueForMode(sizeMode, value);
  v.scopes = scopes;
  v.setVariableCodeSyntax('WEB', webName(name));
  sizes[name] = v;
}

const styleDefs = [
  ['Display/Strong', fontBold, 32, 42],
  ['Heading/Page', fontBold, 28, 38],
  ['Title/Card', fontMedium, 22, 31],
  ['Body/Elder', fontRegular, 20, 32],
  ['Body/Strong', fontMedium, 20, 30],
  ['Meta/Regular', fontRegular, 16, 24],
  ['Meta/Strong', fontMedium, 16, 24],
  ['Button/Label', fontMedium, 20, 26],
];
const textStyles = await figma.getLocalTextStylesAsync();
const styles = {};
for (const [name, fontName, fontSize, lineHeight] of styleDefs) {
  let s = textStyles.find(x => x.name === name);
  if (!s) s = figma.createTextStyle();
  s.name = name;
  s.fontName = fontName;
  s.fontSize = fontSize;
  s.lineHeight = { value: lineHeight, unit: 'PIXELS' };
  s.letterSpacing = { value: 0, unit: 'PIXELS' };
  s.description = `AI Elder UI / ${name}`;
  styles[name] = s;
}

const effectStyles = await figma.getLocalEffectStylesAsync();
let cardShadow = effectStyles.find(s => s.name === 'Elevation/Card');
if (!cardShadow) cardShadow = figma.createEffectStyle();
cardShadow.name = 'Elevation/Card';
cardShadow.effects = [{
  type: 'DROP_SHADOW',
  color: { r: 0.082, g: 0.192, b: 0.231, a: 0.10 },
  offset: { x: 0, y: 4 },
  radius: 14,
  spread: 0,
  visible: true,
  blendMode: 'NORMAL',
}];

async function styledText(name, value, style, colorVar, width) {
  const t = figma.createText();
  createdNodeIds.push(t.id);
  t.name = name;
  t.fontName = style.fontName;
  t.textAutoResize = 'HEIGHT';
  t.resize(width, 24);
  t.characters = value;
  t.fills = [bindPaint(colorVar)];
  await t.setTextStyleIdAsync(style.id);
  return t;
}

function bindBox(node, fillVar, radiusVar, borderVar) {
  node.fills = [bindPaint(fillVar)];
  node.setBoundVariable('topLeftRadius', radiusVar);
  node.setBoundVariable('topRightRadius', radiusVar);
  node.setBoundVariable('bottomLeftRadius', radiusVar);
  node.setBoundVariable('bottomRightRadius', radiusVar);
  if (borderVar) {
    node.strokes = [bindPaint(borderVar)];
    node.strokeWeight = 1;
  }
}

const existingComponentSets = foundationPage.findAllWithCriteria({ types: ['COMPONENT_SET'] });
const existingComponents = foundationPage.findAllWithCriteria({ types: ['COMPONENT'] });

let buttonSet = existingComponentSets.find(n => n.name === 'Button');
if (!buttonSet) {
  const base = figma.createComponent();
  createdNodeIds.push(base.id);
  base.name = 'Style=Primary';
  base.layoutMode = 'HORIZONTAL';
  base.resize(342, 56);
  base.primaryAxisSizingMode = 'FIXED';
  base.counterAxisSizingMode = 'FIXED';
  base.primaryAxisAlignItems = 'CENTER';
  base.counterAxisAlignItems = 'CENTER';
  base.setBoundVariable('itemSpacing', sizes['spacing/xs']);
  bindBox(base, semantic['color/action/primary'], sizes['radius/md']);
  const label = await styledText('label', '主要操作', styles['Button/Label'], semantic['color/text/on-brand'], 260);
  label.textAlignHorizontal = 'CENTER';
  base.appendChild(label);
  const labelKey = base.addComponentProperty('Label', 'TEXT', '主要操作');
  label.componentPropertyReferences = { characters: labelKey };

  const secondary = base.clone();
  createdNodeIds.push(secondary.id);
  secondary.name = 'Style=Secondary';
  secondary.fills = [bindPaint(semantic['color/bg/surface'])];
  secondary.strokes = [bindPaint(semantic['color/action/primary'])];
  secondary.strokeWeight = 2;
  const secText = secondary.findAllWithCriteria({ types: ['TEXT'] })[0];
  secText.fills = [bindPaint(semantic['color/action/primary'])];

  const danger = base.clone();
  createdNodeIds.push(danger.id);
  danger.name = 'Style=Danger';
  danger.fills = [bindPaint(semantic['color/action/danger'])];

  const quiet = base.clone();
  createdNodeIds.push(quiet.id);
  quiet.name = 'Style=Quiet';
  quiet.fills = [bindPaint(semantic['color/bg/subtle'])];
  const quietText = quiet.findAllWithCriteria({ types: ['TEXT'] })[0];
  quietText.fills = [bindPaint(semantic['color/text/primary'])];

  buttonSet = figma.combineAsVariants([base, secondary, danger, quiet], foundationPage);
  createdNodeIds.push(buttonSet.id);
  buttonSet.name = 'Button';
  buttonSet.description = '56px 适老按钮；每页只突出一个 Primary。';
  buttonSet.children.forEach((c, i) => { c.x = 24; c.y = 24 + i * 72; });
  buttonSet.resizeWithoutConstraints(390, 24 + buttonSet.children.length * 72);
  buttonSet.x = 40;
  buttonSet.y = 190;
}

let badgeSet = existingComponentSets.find(n => n.name === 'StatusBadge');
if (!badgeSet) {
  const tones = [
    ['Info', 'color/state/info-bg', 'color/state/info-text'],
    ['Success', 'color/state/success-bg', 'color/state/success-text'],
    ['Warning', 'color/state/warning-bg', 'color/state/warning-text'],
    ['Danger', 'color/state/danger-bg', 'color/state/danger-text'],
    ['Neutral', 'color/bg/subtle', 'color/text/secondary'],
  ];
  const variants = [];
  for (const [tone, bg, text] of tones) {
    const c = figma.createComponent();
    createdNodeIds.push(c.id);
    c.name = `Tone=${tone}`;
    c.layoutMode = 'HORIZONTAL';
    c.resize(180, 36);
    c.primaryAxisSizingMode = 'FIXED';
    c.counterAxisSizingMode = 'FIXED';
    c.primaryAxisAlignItems = 'CENTER';
    c.counterAxisAlignItems = 'CENTER';
    bindBox(c, semantic[bg], sizes['radius/full']);
    const t = await styledText('label', '当前状态', styles['Meta/Strong'], semantic[text], 148);
    t.textAlignHorizontal = 'CENTER';
    c.appendChild(t);
    const key = c.addComponentProperty('Label', 'TEXT', '当前状态');
    t.componentPropertyReferences = { characters: key };
    variants.push(c);
  }
  badgeSet = figma.combineAsVariants(variants, foundationPage);
  createdNodeIds.push(badgeSet.id);
  badgeSet.name = 'StatusBadge';
  badgeSet.description = '状态同时使用文字与底色，不仅依赖颜色。';
  badgeSet.children.forEach((c, i) => { c.x = 24 + (i % 2) * 196; c.y = 24 + Math.floor(i / 2) * 52; });
  badgeSet.resizeWithoutConstraints(424, 190);
  badgeSet.x = 470;
  badgeSet.y = 190;
}

let roleSet = existingComponentSets.find(n => n.name === 'RoleBar');
if (!roleSet) {
  const roles = [
    ['Elder', '老人端 · 张阿姨', '张', 'color/bg/elder'],
    ['Family', '家属端 · 小梅', '梅', 'color/bg/family'],
    ['Demo', '演示工具', '演', 'color/bg/demo'],
  ];
  const variants = [];
  for (const [role, title, mark, bg] of roles) {
    const c = figma.createComponent();
    createdNodeIds.push(c.id);
    c.name = `Role=${role}`;
    c.layoutMode = 'HORIZONTAL';
    c.resize(342, 48);
    c.primaryAxisSizingMode = 'FIXED';
    c.counterAxisSizingMode = 'FIXED';
    c.counterAxisAlignItems = 'CENTER';
    c.primaryAxisAlignItems = 'MIN';
    c.setBoundVariable('itemSpacing', sizes['spacing/sm']);
    c.setBoundVariable('paddingLeft', sizes['spacing/sm']);
    c.setBoundVariable('paddingRight', sizes['spacing/sm']);
    bindBox(c, semantic[bg], sizes['radius/full']);
    const avatar = figma.createAutoLayout('HORIZONTAL');
    createdNodeIds.push(avatar.id);
    avatar.name = 'avatar';
    avatar.resize(36, 36);
    avatar.primaryAxisSizingMode = 'FIXED';
    avatar.counterAxisSizingMode = 'FIXED';
    avatar.primaryAxisAlignItems = 'CENTER';
    avatar.counterAxisAlignItems = 'CENTER';
    bindBox(avatar, semantic['color/bg/surface'], sizes['radius/full']);
    const markText = await styledText('mark', mark, styles['Meta/Strong'], semantic['color/text/primary'], 24);
    markText.textAlignHorizontal = 'CENTER';
    avatar.appendChild(markText);
    c.appendChild(avatar);
    const roleText = await styledText('role', title, styles['Meta/Strong'], semantic['color/text/primary'], 250);
    c.appendChild(roleText);
    variants.push(c);
  }
  roleSet = figma.combineAsVariants(variants, foundationPage);
  createdNodeIds.push(roleSet.id);
  roleSet.name = 'RoleBar';
  roleSet.description = '明确老人、家属和 Demo 三种角色，避免误解为同一业务界面。';
  roleSet.children.forEach((c, i) => { c.x = 24; c.y = 24 + i * 64; });
  roleSet.resizeWithoutConstraints(390, 224);
  roleSet.x = 930;
  roleSet.y = 190;
}

let fieldRow = existingComponents.find(n => n.name === 'FieldRow');
if (!fieldRow) {
  fieldRow = figma.createComponent();
  createdNodeIds.push(fieldRow.id);
  fieldRow.name = 'FieldRow';
  fieldRow.layoutMode = 'VERTICAL';
  fieldRow.resize(342, 82);
  fieldRow.counterAxisSizingMode = 'FIXED';
  fieldRow.primaryAxisSizingMode = 'AUTO';
  fieldRow.setBoundVariable('paddingTop', sizes['spacing/sm']);
  fieldRow.setBoundVariable('paddingBottom', sizes['spacing/sm']);
  fieldRow.setBoundVariable('paddingLeft', sizes['spacing/md']);
  fieldRow.setBoundVariable('paddingRight', sizes['spacing/md']);
  fieldRow.setBoundVariable('itemSpacing', sizes['spacing/2xs']);
  bindBox(fieldRow, semantic['color/bg/subtle'], sizes['radius/sm'], semantic['color/border/default']);
  const label = await styledText('label', '字段', styles['Meta/Regular'], semantic['color/text/secondary'], 310);
  const value = await styledText('value', '字段内容', styles['Body/Strong'], semantic['color/text/primary'], 310);
  fieldRow.appendChild(label);
  fieldRow.appendChild(value);
  const labelKey = fieldRow.addComponentProperty('Label', 'TEXT', '字段');
  const valueKey = fieldRow.addComponentProperty('Value', 'TEXT', '字段内容');
  label.componentPropertyReferences = { characters: labelKey };
  value.componentPropertyReferences = { characters: valueKey };
  fieldRow.description = '结构化字段行，用于事项、日期、时间、地点和提醒确认。';
  fieldRow.x = 40;
  fieldRow.y = 540;
}

let infoCard = existingComponents.find(n => n.name === 'InfoCard');
if (!infoCard) {
  infoCard = figma.createComponent();
  createdNodeIds.push(infoCard.id);
  infoCard.name = 'InfoCard';
  infoCard.layoutMode = 'VERTICAL';
  infoCard.resize(342, 140);
  infoCard.counterAxisSizingMode = 'FIXED';
  infoCard.primaryAxisSizingMode = 'AUTO';
  infoCard.setBoundVariable('paddingTop', sizes['spacing/md']);
  infoCard.setBoundVariable('paddingBottom', sizes['spacing/md']);
  infoCard.setBoundVariable('paddingLeft', sizes['spacing/md']);
  infoCard.setBoundVariable('paddingRight', sizes['spacing/md']);
  infoCard.setBoundVariable('itemSpacing', sizes['spacing/xs']);
  bindBox(infoCard, semantic['color/bg/surface'], sizes['radius/lg'], semantic['color/border/default']);
  infoCard.effectStyleId = cardShadow.id;
  const title = await styledText('title', '说明标题', styles['Title/Card'], semantic['color/text/primary'], 310);
  const body = await styledText('body', '说明当前发生了什么，以及接下来可以做什么。', styles['Body/Elder'], semantic['color/text/secondary'], 310);
  infoCard.appendChild(title);
  infoCard.appendChild(body);
  const titleKey = infoCard.addComponentProperty('Title', 'TEXT', '说明标题');
  const bodyKey = infoCard.addComponentProperty('Body', 'TEXT', '说明当前发生了什么，以及接下来可以做什么。');
  title.componentPropertyReferences = { characters: titleKey };
  body.componentPropertyReferences = { characters: bodyKey };
  infoCard.description = '适老信息卡：标题说明状态，正文说明影响与下一步。';
  infoCard.x = 470;
  infoCard.y = 540;
}

let cover = foundationPage.findAllWithCriteria({ types: ['FRAME'] }).find(n => n.name === 'Foundation Cover');
if (!cover) {
  cover = figma.createAutoLayout('VERTICAL');
  createdNodeIds.push(cover.id);
  cover.name = 'Foundation Cover';
  cover.resize(1280, 140);
  cover.primaryAxisSizingMode = 'FIXED';
  cover.counterAxisSizingMode = 'FIXED';
  cover.setBoundVariable('paddingTop', sizes['spacing/lg']);
  cover.setBoundVariable('paddingBottom', sizes['spacing/lg']);
  cover.setBoundVariable('paddingLeft', sizes['spacing/lg']);
  cover.setBoundVariable('paddingRight', sizes['spacing/lg']);
  cover.setBoundVariable('itemSpacing', sizes['spacing/xs']);
  bindBox(cover, semantic['color/bg/canvas'], sizes['radius/lg']);
  const title = await styledText('title', 'AI 老年家庭协作助手｜高保真原型 v1', styles['Display/Strong'], semantic['color/text/primary'], 1200);
  const subtitle = await styledText('subtitle', '390×844 · Noto Sans SC · 可编辑组件 · 65 个页面状态', styles['Body/Elder'], semantic['color/text/secondary'], 1200);
  cover.appendChild(title);
  cover.appendChild(subtitle);
  cover.x = 40;
  cover.y = 24;
}

const componentNodes = [buttonSet, badgeSet, roleSet, fieldRow, infoCard];
for (const n of componentNodes) {
  createdNodeIds.push(n.id);
  if ('children' in n) {
    for (const d of n.findAll(() => true)) createdNodeIds.push(d.id);
  }
}

return {
  success: true,
  createdNodeIds: [...new Set(createdNodeIds)],
  pageIds: createdPageIds,
  pages: figma.root.children.map(p => ({ id: p.id, name: p.name })),
  collections: {
    primitives: primitiveCollection.id,
    semantic: semanticCollection.id,
    size: sizeCollection.id,
  },
  variables: Object.fromEntries([
    ...Object.entries(primitive).map(([k, v]) => [`primitive/${k}`, v.id]),
    ...Object.entries(semantic).map(([k, v]) => [k, v.id]),
    ...Object.entries(sizes).map(([k, v]) => [k, v.id]),
  ]),
  styles: {
    ...Object.fromEntries(Object.entries(styles).map(([k, v]) => [k, v.id])),
    'Elevation/Card': cardShadow.id,
  },
  components: {
    Button: buttonSet.id,
    StatusBadge: badgeSet.id,
    RoleBar: roleSet.id,
    FieldRow: fieldRow.id,
    InfoCard: infoCard.id,
  },
};
