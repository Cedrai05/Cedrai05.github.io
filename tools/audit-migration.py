#!/usr/bin/env python3
"""Validate only the publishable archive. Requires beautifulsoup4."""
import hashlib, json, re
from pathlib import Path
from bs4 import BeautifulSoup
root=Path(__file__).resolve().parents[1]
catalog=json.loads((root/'content/catalog.json').read_text())['posts']
assert len(catalog)==114
assert len({p['slug'] for p in catalog})==114
public={p['slug'] for p in catalog if not p['protected']}
assert len(public)==37 and sum(p['protected'] for p in catalog)==77
assert {p.stem for p in (root/'content/posts').glob('*.json')}==public
references=0
for path in (root/'content/posts').glob('*.json'):
 post=json.loads(path.read_text())
 assert post['visibility']=='public' and 'password' not in post
 body=BeautifulSoup(post['content'],'html.parser')
 assert not body.select('script,iframe,object,embed,form,svg')
 for tag in body.find_all(True):
  assert not any(attr.startswith('on') or attr=='style' for attr in tag.attrs)
  for attr in ['src','poster','srcset']:
   if tag.get(attr):
    assert tag[attr].startswith('./content/media/'),(post['slug'],attr)
    assert (root/tag[attr]).is_file()
    references+=1
 for name in post['assets']:
  path=root/'content/media'/name
  assert path.is_file()
  assert hashlib.sha256(path.read_bytes()).hexdigest()==name.split('.')[0]
assert 'api/blog-feed' not in (root/'app.js').read_text()
assert 'setInterval' not in (root/'app.js').read_text()
print(f'Publishable archive verified: {len(catalog)} catalog entries, {len(public)} public bodies, 77 protected metadata entries, {references} local media references.')
