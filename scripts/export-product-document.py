"""Render the final product Markdown with an embedded CJK TrueType font.

Requires reportlab; set PDF_FONT to a Chinese TTF or compatible TTC file.
"""
from pathlib import Path
import os
import json
import re
from html import escape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
source = root / 'docs/product/product-description.md'
output = root / 'exports/product-description.pdf'
version = json.loads((root / 'package.json').read_text())['version']
pdfmetrics.registerFont(TTFont('Chinese', os.environ['PDF_FONT'], subfontIndex=0))
styles = {
    'title':ParagraphStyle('title',fontName='Chinese',fontSize=25,leading=33,spaceAfter=18,textColor=HexColor('#15323a')),
    'heading':ParagraphStyle('heading',fontName='Chinese',fontSize=15,leading=23,spaceBefore=16,spaceAfter=7,keepWithNext=True,textColor=HexColor('#19776e')),
    'body':ParagraphStyle('body',fontName='Chinese',fontSize=11.5,leading=19,spaceAfter=9,wordWrap='CJK',alignment=TA_LEFT,allowWidows=0,allowOrphans=0),
}
story=[]
for block in source.read_text().split('\n\n'):
    block=block.strip()
    if not block:continue
    style='heading' if block.startswith('## ') else 'title' if block.startswith('# ') else 'body'
    text=re.sub(r'^#+\s+','',block).replace('`','')
    story.append(Paragraph(escape(text).replace('\n','<br/>'),styles[style]))

def furniture(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(HexColor('#b9c9c8'))
    canvas.line(48,802,547,802)
    canvas.setFont('Chinese',9)
    canvas.setFillColor(HexColor('#405c60'))
    canvas.drawString(48,813,f'安心记事 | 产品说明 | Release {version}')
    canvas.drawRightString(547,813,f'{doc.page}')
    canvas.drawString(48,29,'2026-10-07 | 固定模拟原型 | 研究证据 PARTIAL，尚无真人验证')
    canvas.restoreState()

doc=SimpleDocTemplate(str(output),pagesize=(595,842),leftMargin=48,rightMargin=48,topMargin=58,bottomMargin=54,title=f'安心记事 - Release {version} 产品说明',author='AI elder family assistant project')
doc.build(story,onFirstPage=furniture,onLaterPages=furniture)
reader=PdfReader(str(output))
text='\n'.join(page.extract_text() for page in reader.pages)
for number in range(1,27):
    assert re.search(rf'(?m)^{number}\.\s',text),number
assert 'PARTIAL' in text and '无真人' in text
print(f'Product PDF PASS: {len(reader.pages)} pages, all 26 sections present')
