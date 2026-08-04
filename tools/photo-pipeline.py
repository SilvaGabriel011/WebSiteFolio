#!/usr/bin/env python3
"""Pexels photo pipeline: search -> contact sheet -> install.

The exact flow used to photograph the signature mocks, packaged. The key
comes ONLY from the PEXELS_API_KEY environment variable (Pexels licence:
free commercial use, attribution appreciated but not required — provenance
is still recorded in each PHOTOS.md).

Usage (run from anywhere; paths resolve against the repo root):

  1. Describe the wanted slots in a JSON file:
       { "sites/proflow-plumbing/premium": {
           "01-hero": ["plumber working pipe repair", "tradesman van tools"],
           "02-gallery-hotwater": ["technician water heater"] } }

  2. Search + build one contact sheet per target folder:
       PEXELS_API_KEY=... python3 tools/photo-pipeline.py search slots.json

  3. Look at sheet-*.jpg, then write picks.json mapping slot -> candidate index:
       { "sites/proflow-plumbing/premium/01-hero": 2, ... }

  4. Install picks (resized to <=1600px, q82 progressive JPEG) into
     <target>/assets/photos/<slot>.jpg and append provenance to PHOTOS.md:
       python3 tools/photo-pipeline.py install picks.json

Requires: pillow (pip install pillow), curl on PATH.
"""
import json
import os
import subprocess
import sys
import time
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(ROOT, '.photo-pipeline')  # gitignored scratch area
CANDIDATES = os.path.join(WORK, 'candidates.json')


def key():
    k = os.environ.get('PEXELS_API_KEY', '').strip()
    if not k:
        sys.exit('PEXELS_API_KEY não definida no ambiente.')
    return k


def curl(url, out=None, headers=None):
    cmd = ['curl', '-sSL', '--max-time', '45']
    for h in headers or []:
        cmd += ['-H', h]
    if out:
        cmd += ['-o', out]
    cmd.append(url)
    r = subprocess.run(cmd, capture_output=True, text=out is None)
    return r.stdout if out is None else (os.path.exists(out) and os.path.getsize(out) > 8000)


def search_slot(queries, per_query=5):
    rows, seen = [], set()
    for q in queries:
        url = ('https://api.pexels.com/v1/search?orientation=landscape&per_page=%d&query=%s'
               % (per_query, urllib.parse.quote(q)))
        try:
            data = json.loads(curl(url, headers=['Authorization: ' + key()]))
        except (json.JSONDecodeError, TypeError):
            continue
        for p in data.get('photos', []):
            if p['id'] in seen:
                continue
            seen.add(p['id'])
            rows.append({'id': p['id'], 'photographer': p['photographer'], 'url': p['url'],
                         'large': p['src']['large'], 'large2x': p['src']['large2x'],
                         'alt': (p.get('alt') or '')[:60]})
        time.sleep(0.4)
    return rows[:8]


def cmd_search(slots_file):
    from PIL import Image, ImageDraw
    os.makedirs(WORK, exist_ok=True)
    slots = json.load(open(slots_file))
    all_c = {}
    for target, slotmap in slots.items():
        for slot, queries in slotmap.items():
            k = f'{target}/{slot}'
            all_c[k] = search_slot(queries if isinstance(queries, list) else [queries])
            print(f'{k}: {len(all_c[k])} candidatas')
    json.dump(all_c, open(CANDIDATES, 'w'), indent=1)

    # one contact sheet per target folder
    by_target = {}
    for k, rows in all_c.items():
        target, slot = k.rsplit('/', 1)
        by_target.setdefault(target, []).append((slot, rows))
    TW, TH = 300, 220
    for target, slotlist in by_target.items():
        n_cols = max((len(r) for _, r in slotlist), default=1)
        sheet = Image.new('RGB', (150 + n_cols * (TW + 8), len(slotlist) * (TH + 30) + 8), '#1a1a1a')
        d = ImageDraw.Draw(sheet)
        for ri, (slot, rows) in enumerate(slotlist):
            y = 8 + ri * (TH + 30)
            d.text((6, y + TH // 2), slot, fill='#fff', font_size=14)
            for ci, r in enumerate(rows):
                p = os.path.join(WORK, f"{r['id']}.jpg")
                if not curl(r['large'], out=p):
                    continue
                try:
                    im = Image.open(p).convert('RGB')
                except OSError:
                    continue
                im.thumbnail((TW, TH))
                x = 150 + ci * (TW + 8)
                sheet.paste(im, (x, y))
                d.rectangle([x, y, x + 40, y + 24], fill='#000')
                d.text((x + 5, y + 2), f'[{ci}]', fill='#fff', font_size=16)
                d.text((x, y + TH + 2), r['photographer'][:26], fill='#bbb', font_size=12)
        out = os.path.join(WORK, 'sheet-' + target.replace('/', '_') + '.jpg')
        sheet.save(out, quality=76)
        print('folha:', out)


def cmd_install(picks_file):
    from PIL import Image
    cands = json.load(open(CANDIDATES))
    picks = json.load(open(picks_file))
    for k, idx in picks.items():
        target, slot = k.rsplit('/', 1)
        r = cands[k][idx]
        raw = os.path.join(WORK, f"install-{r['id']}.raw")
        if not curl(r['large2x'], out=raw):
            print(f'ERRO baixando {k}')
            continue
        im = Image.open(raw).convert('RGB')
        if im.width > 1600:
            im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
        photos_dir = os.path.join(ROOT, target, 'assets', 'photos')
        os.makedirs(photos_dir, exist_ok=True)
        dest = os.path.join(photos_dir, slot + '.jpg')
        im.save(dest, quality=82, optimize=True, progressive=True)
        ledger = os.path.join(photos_dir, 'PHOTOS.md')
        entry = (f"- `{slot}.jpg` — OK: foto de {r['photographer']} via Pexels ({r['url']}) — "
                 "licença Pexels, uso comercial livre; otimizada para 1600px\n")
        with open(ledger, 'a') as f:
            f.write(entry)
        print(f'{dest} ({os.path.getsize(dest) // 1024}KB) by {r["photographer"]}')


if __name__ == '__main__':
    if len(sys.argv) != 3 or sys.argv[1] not in ('search', 'install'):
        sys.exit(__doc__)
    (cmd_search if sys.argv[1] == 'search' else cmd_install)(sys.argv[2])
