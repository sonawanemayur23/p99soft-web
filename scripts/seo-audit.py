#!/usr/bin/env python3
"""SEO audit of server-rendered HTML (what Google sees before JS).
Checks the exact issues found on the Framer site. Usage: python3 scripts/seo-audit.py http://localhost:3000"""
import re, sys, json, urllib.request
from html.parser import HTMLParser

base = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://localhost:3000"

class Head(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta = {}; self.links = {}; self.title = ""; self._t = False; self.ld = []; self._ld = False; self.h1 = 0
    def handle_starttag(self, tag, a):
        a = dict(a)
        if tag == "title": self._t = True
        if tag == "meta":
            k = a.get("property") or a.get("name")
            if k: self.meta[k] = a.get("content", "")
        if tag == "link" and a.get("rel") == "canonical": self.links["canonical"] = a.get("href")
        if tag == "script" and a.get("type") == "application/ld+json": self._ld = True
        if tag == "h1": self.h1 += 1
    def handle_endtag(self, tag):
        if tag == "title": self._t = False
        if tag == "script": self._ld = False
    def handle_data(self, d):
        if self._t: self.title += d
        if self._ld:
            data = json.loads(d); items = data if isinstance(data, list) else [data]
            self.ld += [i.get("@type") for i in items]

get = lambda u: urllib.request.urlopen(u).read().decode()
sitemap = get(f"{base}/sitemap.xml")
paths = [re.sub(r"^https?://[^/]+", "", u) or "/" for u in re.findall(r"<loc>(.*?)</loc>", sitemap)]
rows, titles, descs, problems = [], {}, {}, []
for p in paths:
    h = Head(); h.feed(get(base + p))
    m = h.meta; canon = h.links.get("canonical", "")
    cpath = re.sub(r"^https?://[^/]+", "", canon) or "/"
    ogpath = re.sub(r"^https?://[^/]+", "", m.get("og:url", "")) or "/"
    checks = {
        "title<=70": len(h.title) <= 70,
        "unique title": h.title not in titles,
        "unique desc": m.get("description") not in descs,
        "canonical==path": cpath == p,
        "og:url==canonical": ogpath == p,
        "og:image 1200": m.get("og:image:width") == "1200",
        "twitter:image": bool(m.get("twitter:image")),
        "json-ld": len(h.ld) > 0,
        "one h1": h.h1 == 1,
        "article type": (m.get("og:type") == "article") == p.startswith("/insights/"),
    }
    titles[h.title] = p; descs[m.get("description")] = p
    for k, ok in checks.items():
        if not ok: problems.append(f"{p}: {k}")
    rows.append((p, h.title, m.get("og:type"), ",".join(h.ld), all(checks.values())))

w = max(len(r[0]) for r in rows)
for p, t, ogt, ld, ok in rows:
    print(f"{'PASS' if ok else 'FAIL'}  {p:<{w}}  {ogt:<8} {ld:<40} {t}")
print(f"\n{len(rows)} pages, {len(problems)} problems")
for x in problems: print("  -", x)
sys.exit(1 if problems else 0)
