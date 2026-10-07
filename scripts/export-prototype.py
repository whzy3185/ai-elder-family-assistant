"""Build the prototype index/PDF from final Web screenshots, never design mocks.

Developer export dependencies: Python reportlab, Pillow and pypdf.
These are not required to start or operate the Docker prototype.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import os
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'exports'
SCREENS = OUT / 'screens'
VERSION = json.loads((ROOT / 'package.json').read_text())['version']
FREEZE_SHA = subprocess.check_output(['git','log','-1','--format=%H','--','src','package.json','package-lock.json','Dockerfile','compose.yaml','compose.local.yaml','index.html','server.mjs'],cwd=ROOT,text=True).strip()
items = json.loads(subprocess.check_output([
    'node', '--input-type=module', '-e',
    "import {screenDefinitions} from './src/screen-catalog.js'; console.log(JSON.stringify(screenDefinitions));"
], cwd=ROOT, text=True))
audit = json.loads((SCREENS / 'audit.json').read_text())
assert audit['status'] == 'PASS' and audit['count'] == 65
assert len(items) == 65 and len(list(SCREENS.glob('*.png'))) == 65
pdfmetrics.registerFont(TTFont('Chinese', os.environ['PDF_FONT'], subfontIndex=0))
c = canvas.Canvas(str(OUT / 'prototype-pages.pdf'), pagesize=(595, 842))
c.setTitle(f'安心记事 - Release {VERSION} 完整页面原型')
c.setAuthor('AI elder family assistant project')
c.setFillColor(HexColor('#15323a'))
c.setFont('Chinese', 27)
c.drawString(42, 775, '安心记事')
c.setFont('Chinese', 18)
c.drawString(42, 735, '面向老年人的 AI 日常事务与家庭协作助手')
c.setFont('Chinese', 13)
lines = [
    f'Release {VERSION} | 2026-10-07 | 65 个页面与关键状态',
    '全部图片来自最终 Docker Web；不是旧设计稿。',
    '主要演示视口：390 x 844；图片完整保留页面滚动内容。',
    '长页面采用随图片高度变化的 PDF 页面，避免缩小或截断。',
    '访问：http://localhost:8080',
    'Web 定位：演示控制 > 按编号查看全部页面与状态。',
    'AI、语音、消息、时钟、提醒和账号身份均为本地模拟。',
    '源码冻结 SHA：', FREEZE_SHA,
    '导出与最终提交同版性通过 exports/source-manifest.json 核对。',
    '原型图用于查看状态；操作步骤见 README 和 Demo Guide。',
]
for i, line in enumerate(lines):
    c.drawString(42, 675 - i * 30, line)
c.showPage()
for start in range(0, len(items), 22):
    c.setPageSize((595, 842))
    c.setFillColor(HexColor('#15323a'))
    c.setFont('Chinese', 22)
    c.drawString(42, 790, '页面索引')
    c.setFont('Chinese', 11)
    for row, item in enumerate(items[start:start+22]):
        y = 752 - row * 31
        c.drawString(42, y, item['id'])
        c.drawString(165, y, item['name'])
        c.drawRightString(555, y, str(5 + start + row))
    c.setFont('Chinese', 10)
    c.drawString(42, 42, '索引右侧为 PDF 页码；同编号图片位于 exports/screens/。')
    c.showPage()
records = []
for number, item in enumerate(items, 1):
    image = SCREENS / f"{item['id']}.png"
    with Image.open(image) as im:
        width, height = im.size
    assert width == 390
    page_width, page_height = 450, height + 100
    c.setPageSize((page_width, page_height))
    c.setFillColor(HexColor('#15323a'))
    c.setFont('Chinese', 15)
    c.drawString(30, page_height - 24, item['id'])
    c.setFont('Chinese', 13)
    c.drawString(30, page_height - 46, item['name'])
    c.drawImage(str(image), 30, 30, width=width, height=height)
    c.setFont('Chinese', 9)
    c.drawString(30, 12, f"Release {VERSION} | {item['role']} | {number}/65 | 完整滚动页面")
    c.bookmarkPage(item['id'])
    c.addOutlineEntry(f"{item['id']} {item['name']}", item['id'], 0)
    c.showPage()
    records.append({**item, 'image': f"screens/{item['id']}.png", 'pdfPage': number + 4,
                    'width': width, 'height': height,
                    'imageSha256': hashlib.sha256(image.read_bytes()).hexdigest()})
c.save()
reader = PdfReader(str(OUT / 'prototype-pages.pdf'))
assert len(reader.pages) == 69, len(reader.pages)
for record in records:
    assert record['id'] in reader.pages[record['pdfPage']-1].extract_text()
rows = [f'# Release {VERSION} 完整原型索引', '',
        f'源码冻结：`{FREEZE_SHA}`。65/65 项来自同版 Docker Web 全长截图。', '',
        'Web 入口统一为：演示控制 → 按编号查看全部页面与状态 → 选择编号。加载会替换当前模拟数据。', '',
        'DM-01 是每页底部角色工具；DM-02/DM-03 共用控制台布局，分别定位场景及固定时钟，不省略状态。', '',
        '| 页面编号 | 名称 | 角色 | 状态 | 图片 | PDF 页 | Web 入口 | 测试 |',
        '|---|---|---|---|---|---:|---|---|']
for record in records:
    actual = next(x['standard'] for x in audit['results'] if x['id'] == record['id'])
    rows.append(f"| {record['id']} | {record['name']} | {record['role']} | {actual['status']} | [{record['id']}]({record['image']}) | {record['pdfPage']} | 控制台编号 {record['id']} | {record['test']}；全页实测 |")
(OUT / 'prototype-index.md').write_text('\n'.join(rows) + '\n')
(OUT / 'prototype-index.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
source_files = [ROOT / x for x in ['package.json','package-lock.json','index.html','server.mjs','Dockerfile','compose.yaml','compose.local.yaml']]
source_files += sorted((ROOT / 'src').rglob('*'))
manifest = {str(f.relative_to(ROOT)):hashlib.sha256(f.read_bytes()).hexdigest() for f in source_files if f.is_file()}
(OUT / 'source-manifest.json').write_text(json.dumps({'version':VERSION,'sourceFreezeSha':FREEZE_SHA,'files':manifest},indent=2)+'\n')
print(json.dumps({'status':'PASS','screens':65,'pdfPages':len(reader.pages),'output':'exports/prototype-pages.pdf'}))
