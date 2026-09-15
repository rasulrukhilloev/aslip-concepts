"""Build the deployable pages from src/: inline scenes.js and wrap each concept in a full HTML document.
Run from the repo root:  python3 src/build.py
"""
import pathlib
root=pathlib.Path(__file__).resolve().parent.parent
src=root/'src'
scenes=(src/'scenes.js').read_text()
for name,out in [('a-src.html','a-sanoat.html'),('b-src.html','b-rang.html'),('c-src.html','c-texnik.html')]:
    s=(src/name).read_text().replace('<!--SCENES-->','<script>\n'+scenes+'\n</script>')
    i=s.index('</style>')+len('</style>')
    doc=('<!doctype html>\n<html lang="uz">\n<head>\n<meta charset="utf-8">\n'
         '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
         '<meta name="robots" content="noindex">\n'+s[:i]+'\n</head>\n<body>\n'+s[i:]+'\n</body>\n</html>\n')
    (root/out).write_text(doc); print('built',out,len(doc))
