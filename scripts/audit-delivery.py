"""Check the tracked delivery tree without printing credential candidates."""
from pathlib import Path
from collections import Counter
import hashlib,json,re,subprocess,sys

root=Path.cwd()
tracked=subprocess.check_output(['git','ls-files'],text=True).splitlines()
issues=[]
text_ext={'.md','.mjs','.js','.json','.yaml','.yml','.html','.css','.txt','.py'}
secret_patterns=[r'\bgh[pousr]_[A-Za-z0-9]{20,}',r'\bgithub_pat_[A-Za-z0-9_]{20,}',r'-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----',r'(?<![A-Za-z0-9_-])sk-[A-Za-z0-9_-]{24,}',r'\bAKIA[A-Z0-9]{16}\b']
links=0
for name in tracked:
    p=root/name
    if not p.exists():
        issues.append({'type':'missingTrackedFile','file':name});continue
    if p.name.startswith('.env') and p.name!='.env.example':issues.append({'type':'privateEnvironment','file':name})
    if p.suffix not in text_ext:continue
    text=p.read_text(errors='replace')
    for pattern in secret_patterns:
        for match in re.finditer(pattern,text):
            issues.append({'type':'credentialCandidate','file':name,'line':text[:match.start()].count('\n')+1})
    # Literal path prefixes: scanner source expresses them as joined parts.
    if ('/'+'Users/') in text or ('/'+'Applications/') in text or re.search(r'\b[A-Z]:[\\/]',text):
        issues.append({'type':'machinePath','file':name})
    if p.suffix=='.md':
        for match in re.finditer(r'\[[^\]\n]*\]\(([^)]+)\)',text):
            target=match.group(1).split('#')[0].strip('<>')
            if not target or '://' in target or target.startswith(('mailto:','data:')):continue
            links+=1
            if not (p.parent/target).exists():issues.append({'type':'brokenLink','file':name,'target':target})
    if any(part in {'node_modules','__pycache__','Cookies','Session Storage','Local Storage'} for part in p.parts):
        issues.append({'type':'cacheOrBrowserState','file':name})

manifest=json.loads((root/'exports/source-manifest.json').read_text())
for name,digest in manifest['files'].items():
    if hashlib.sha256((root/name).read_bytes()).hexdigest()!=digest:issues.append({'type':'sourceMismatch','file':name})
index=json.loads((root/'exports/prototype-index.json').read_text())
ids={x['id'] for x in index}
matrix=set(re.findall(r'^\| ((?:EL|FM|DM)-[^ |]+) \|',(root/'docs/product/page-state-matrix.md').read_text(),re.M))
images={p.stem for p in (root/'exports/screens').glob('*.png')}
if len(index)!=68 or ids!=matrix or ids!=images:issues.append({'type':'screenCoverageMismatch'})
for item in index:
    if hashlib.sha256((root/'exports'/item['image']).read_bytes()).hexdigest()!=item['imageSha256']:
        issues.append({'type':'imageMismatch','file':item['image']})
materials=json.loads((root/'exports/material-manifest.json').read_text())
for name,digest in materials['files'].items():
    p=root/name
    if not p.exists() or hashlib.sha256(p.read_bytes()).hexdigest()!=digest:
        issues.append({'type':'materialMismatch','file':name})
rtm=(root/'docs/delivery/requirement-traceability-matrix.md').read_text()
rows=[x for x in rtm.splitlines() if x.startswith('| RTM-')]
counts=Counter(x.split('|')[-2].strip() for x in rows)
if len(rows)!=90:issues.append({'type':'requirementCountMismatch'})
if counts.get('PASS')!=88 or counts.get('PARTIAL')!=2 or counts.get('FAIL',0)!=0:
    issues.append({'type':'requirementStatusMismatch'})
result={'status':'PASS' if not issues else 'FAIL','trackedFiles':len(tracked),'localLinksChecked':links,'sourceFilesChecked':len(manifest['files']),'materialFilesChecked':len(materials['files']),'screens':len(index),'requirementStatuses':dict(counts),'issues':issues}
out=root/'artifacts/qa/delivery-audit'
out.mkdir(parents=True,exist_ok=True)
(out/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(bool(issues))
