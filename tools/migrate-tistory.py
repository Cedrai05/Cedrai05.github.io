#!/usr/bin/env python3
"""One-time owner backup import. Never put owner credentials or private output in Git.
Requires beautifulsoup4. Paths are explicit so private data stays outside the repo.
"""
import argparse, hashlib, json, mimetypes, os, re, shutil
from pathlib import Path
from urllib.parse import unquote, urlsplit
from bs4 import BeautifulSoup, Comment

ALLOWED = set('p br div span h1 h2 h3 h4 h5 h6 strong b em i u s del sub sup blockquote pre code kbd samp ul ol li dl dt dd hr table thead tbody tfoot tr th td caption colgroup col a img figure figcaption video audio source details summary mark small'.split())
DROP = set('script style iframe object embed form input button textarea link meta svg math noscript'.split())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for arg in ['backup', 'owner', 'catalog', 'public', 'private']:
        parser.add_argument('--'+arg, required=True, type=Path)
    parser.add_argument('--posts-script', type=Path, help='Optional posts.js catalog to update')
    args = parser.parse_args()
    owner = {str(p['id']): p for p in json.loads(args.owner.read_text())}
    catalog = json.loads(args.catalog.read_text())['posts']
    for post in catalog:
        if post['slug'] == 'tistory-43': post['category'] = 'CTF/Wargame'
    public_posts = {p['slug']: p for p in catalog}
    args.private.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(args.private, 0o700)
    for p in [args.public/'posts', args.public/'media']:
        p.mkdir(parents=True, exist_ok=True)
    for p in [args.private/'posts', args.private/'assets']:
        p.mkdir(parents=True, exist_ok=True, mode=0o700)
    report = {'public': 0, 'protected': 0, 'private': 0, 'missingAssets': [], 'externalMedia': [], 'posts': []}
    seen = set()
    for source in sorted(args.backup.rglob('*.html')):
        id = source.parent.name
        if id not in owner: continue
        slug = 'tistory-'+id
        if slug in seen: raise ValueError('Duplicate post ID')
        seen.add(slug)
        row = owner[id]
        visibility = 'protected' if row['status'] == '보호' else 'private' if row['status'] == '비공개' else 'public'
        if visibility == 'public' and slug not in public_posts: raise ValueError('Unexpected public post')
        soup = BeautifulSoup(source.read_text(), 'html.parser')
        body = soup.select_one('.contents_style')
        if not body: raise ValueError(f'Missing body: {slug}')
        assets = set()
        def local_asset(url):
            parts = urlsplit(url)
            if parts.scheme or parts.netloc:
                report['externalMedia'].append({'slug': slug, 'url': url})
                return None
            candidate = (source.parent/unquote(parts.path)).resolve()
            if not candidate.is_relative_to(args.backup.resolve()) or not candidate.is_file():
                report['missingAssets'].append({'slug': slug, 'path': parts.path})
                return None
            data = candidate.read_bytes()
            ext = candidate.suffix.lower().lstrip('.')
            if not re.fullmatch('[a-z0-9]{1,10}', ext): ext = 'bin'
            name = hashlib.sha256(data).hexdigest()+'.'+ext
            dest = args.public/'media'/name if visibility == 'public' else args.private/'assets'/name
            if not dest.exists(): dest.write_bytes(data)
            if visibility != 'public': os.chmod(dest, 0o600)
            assets.add(name)
            return './content/media/'+name if visibility == 'public' else name
        for node in list(body.find_all(string=lambda t:isinstance(t,Comment))): node.extract()
        for tag in list(body.find_all(True)):
            if tag.parent is None: continue
            if tag.name in DROP: tag.decompose(); continue
            if tag.name not in ALLOWED: tag.unwrap(); continue
            attrs = dict(tag.attrs); tag.attrs = {}
            for attr in ['alt', 'title']:
                if isinstance(attrs.get(attr),str): tag[attr] = attrs[attr]
            if attrs.get('class'):
                tag['class'] = [c for c in attrs['class'] if re.fullmatch(r'[a-zA-Z0-9_-]+',c)]
            for attr in ['colspan','rowspan','start']:
                if re.fullmatch(r'[0-9]{1,4}',str(attrs.get(attr,''))): tag[attr] = attrs[attr]
            if tag.name in ['video','audio']: tag['controls'] = ''; tag['preload'] = 'metadata'
            if tag.name == 'img': tag['loading'] = 'lazy'; tag['decoding'] = 'async'
            if tag.name in ['img','source','video','audio'] and attrs.get('src'):
                asset = local_asset(attrs['src'])
                if asset: tag['src' if visibility == 'public' else 'data-native-src'] = asset
                else: tag['alt'] = attrs.get('alt') or '원본에서 누락된 첨부파일'
            if tag.name == 'a' and isinstance(attrs.get('href'),str):
                href = attrs['href'].strip(); parts = urlsplit(href)
                if parts.scheme.lower() in ['javascript','data','vbscript','file']: continue
                own = re.fullmatch(r'/(\d+)/?',parts.path) if parts.hostname == 'rinhye05.tistory.com' else None
                if own and 'tistory-'+own[1] in public_posts: tag['href'] = '?post=tistory-'+own[1]
                elif parts.scheme in ['https','http','mailto'] or href.startswith('#'):
                    tag['href'] = href; tag['rel'] = 'noopener noreferrer'; tag['referrerpolicy'] = 'no-referrer'
                elif not parts.scheme and not parts.netloc:
                    asset = local_asset(href)
                    if asset:
                        tag['href' if visibility == 'public' else 'data-native-href'] = asset
                        tag['download'] = Path(unquote(parts.path)).name
        content = '<div class="tistory-content">'+body.decode_contents()+'</div>'
        unavailable = sum(item['slug'] == slug for item in report['missingAssets']+report['externalMedia'])
        if unavailable: content += f'<p class="migration-note">이 글의 첨부파일 {unavailable}개는 원본 백업에서 확보하지 못했습니다.</p>'
        record = {'version':1,'slug':slug,'visibility':visibility,'title':row['title'],'content':content,'assets':sorted(assets)}
        if visibility == 'protected':
            password = row.get('password')
            if not isinstance(password,str) or not password: raise ValueError(f'Missing password: {slug}')
            salt = os.urandom(16)
            record['password'] = {'algorithm':'pbkdf2-sha256','iterations':600000,'salt':salt.hex(),'hash':hashlib.pbkdf2_hmac('sha256',password.encode(),salt,600000).hex()}
        dest = (args.public if visibility=='public' else args.private)/'posts'/(slug+'.json')
        dest.write_text(json.dumps(record,ensure_ascii=False))
        if visibility!='public': os.chmod(dest,0o600)
        report[visibility]+=1
        report['posts'].append({'slug':slug,'visibility':visibility,'assets':len(assets),'characters':len(body.get_text())})
        if slug in public_posts:
            post=public_posts[slug]
            post.pop('sourceUrl',None)
            post['protected']=visibility=='protected'
            if visibility=='protected': post['summary']='비밀번호로 열람할 수 있는 글입니다.'
            post['readTime']='PROTECTED' if visibility=='protected' else str(max(1,len(body.get_text())//700))+' MIN READ'
    if set(owner) != {slug.replace('tistory-','') for slug in seen}: raise ValueError('Backup does not contain every owner post')
    if len(catalog)!=report['public']+report['protected']: raise ValueError('Catalog count mismatch')
    (args.public/'catalog.json').write_text(json.dumps({'posts':catalog,'total':len(catalog)},ensure_ascii=False))
    if args.posts_script:
        text = args.posts_script.read_text()
        text = text[:text.index('window.BLOG_POSTS = ')] + 'window.BLOG_POSTS = '+json.dumps(catalog,ensure_ascii=False,indent=2)+';\n'
        args.posts_script.write_text(text)
    (args.private/'migration-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    os.chmod(args.private/'migration-report.json',0o600)
    print(json.dumps({k:v for k,v in report.items() if k not in ['posts','missingAssets','externalMedia']}))
    print('Missing assets:',len(report['missingAssets']),'External media:',len(report['externalMedia']))

if __name__=='__main__': main()
