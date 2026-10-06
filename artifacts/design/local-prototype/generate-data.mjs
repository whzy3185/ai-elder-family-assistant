import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const scriptsDir = path.resolve(here, '..', 'scripts');

function extractArray(file, marker) {
  const source = fs.readFileSync(path.join(scriptsDir, file), 'utf8');
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing marker ${marker} in ${file}`);
  const arrayStart = source.indexOf('[', start);
  const arrayEnd = source.indexOf('];', arrayStart);
  if (arrayStart < 0 || arrayEnd < 0) throw new Error(`Missing array in ${file}`);
  return Function(`"use strict"; return (${source.slice(arrayStart, arrayEnd + 1)});`)();
}

const groups = [
  ['02-elder-screens.js', 'const screens =', 'Elder', '老人端'],
  ['03-relationship-screens.js', 'const specs=', null, '关系授权'],
  ['04-family-screens.js', 'const specs=', 'Family', '家属端'],
  ['05-demo-screens.js', 'const specs=', 'Demo', '演示工具'],
];

const screens = groups.flatMap(([file, marker, defaultRole, group]) =>
  extractArray(file, marker).map(screen => ({ ...screen, role: screen.role || defaultRole, group }))
);

const ids = screens.map(screen => screen.id);
if (screens.length !== 65) throw new Error(`Expected 65 screens, found ${screens.length}`);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate screen IDs');

const output = `window.DESIGN_SCREENS = ${JSON.stringify(screens, null, 2)};\n`;
fs.writeFileSync(path.join(here, 'screens.generated.js'), output, 'utf8');
console.log(JSON.stringify({ status: 'generated', screenCount: screens.length }));
