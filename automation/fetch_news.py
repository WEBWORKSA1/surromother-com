"""Refresh _data/news.json with recent surrogacy headlines from Google News RSS.

Keeps only headline, publisher, link and date (no article text). Run from the repo root:
    python automation/fetch_news.py
"""
import json
import os
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

QUERIES = [
    "surrogacy law",
    "surrogacy ban",
    "gestational surrogate",
    "surrogacy bill",
    "surrogacy court ruling",
    "international surrogacy",
]
OUT = os.path.join(os.path.dirname(__file__), "..", "_data", "news.json")
KEEP = 14


def fetch(q):
    url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({"q": q + " when:30d", "hl": "en-US", "gl": "US", "ceid": "US:en"})
    req = urllib.request.Request(url, headers={"User-Agent": "SurroMotherNewsBot/1.0 (+https://surromother.com)"})
    with urllib.request.urlopen(req, timeout=25) as r:
        root = ET.fromstring(r.read())
    items = []
    for it in root.iter("item"):
        title = (it.findtext("title") or "").strip()
        link = (it.findtext("link") or "").strip()
        src = (it.findtext("source") or "").strip()
        if src and title.endswith(" - " + src):
            title = title[: -(len(src) + 3)]
        try:
            d = parsedate_to_datetime(it.findtext("pubDate"))
        except Exception:
            d = None
        if title and link and "surroga" in title.lower():
            items.append({"title": title, "source": src or "Google News", "url": link,
                          "date": d.strftime("%Y-%m-%d") if d else "", "_ts": d.timestamp() if d else 0})
    return items


def main():
    try:
        old = json.load(open(OUT, encoding="utf-8")).get("items", [])
    except Exception:
        old = []
    seen, pool = set(), []
    for q in QUERIES:
        try:
            for i in fetch(q):
                key = i["title"].lower()[:90]
                if key not in seen:
                    seen.add(key)
                    pool.append(i)
        except Exception as e:  # one failing query must not break the build
            print("query failed:", q, e)
    if not pool:
        print("No items fetched; keeping existing news.json")
        return
    for o in old:  # keep older curated items to fill the list
        key = o["title"].lower()[:90]
        if key not in seen:
            seen.add(key)
            pool.append(dict(o, _ts=datetime.fromisoformat(o["date"]).replace(tzinfo=timezone.utc).timestamp() if o.get("date") else 0))
    pool.sort(key=lambda i: i["_ts"], reverse=True)
    items = [{k: v for k, v in i.items() if k != "_ts"} for i in pool[:KEEP]]
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({"updated": datetime.now(timezone.utc).strftime("%Y-%m-%d"), "items": items}, f, ensure_ascii=False, indent=1)
    print("Wrote", len(items), "items")


if __name__ == "__main__":
    main()
