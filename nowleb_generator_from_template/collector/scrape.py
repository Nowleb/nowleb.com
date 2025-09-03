import json, time, hashlib
from datetime import datetime, timezone
from pathlib import Path
import feedparser

CATEGORIES = {
    "Entertainment": [
        "https://www.hollywoodreporter.com/feed/",
        "https://variety.com/feed/",
        "https://www.etonline.com/news/rss"
    ],
    "Food": [
        "https://www.seriouseats.com/rss.xml",
        "https://www.food52.com/feed",
        "https://www.eater.com/rss/index.xml"
    ],
    "Sports": [
        "https://www.espn.com/espn/rss/news",
        "http://feeds.bbci.co.uk/sport/rss.xml?edition=uk",
        "https://www.skysports.com/rss/12040"
    ],
    "Events": [
        "https://feeds.feedburner.com/eventbrite-founders-blog"
    ],
    "Music": [
        "https://www.billboard.com/feed/",
        "https://pitchfork.com/feed/feed-news/rss/",
        "https://www.rollingstone.com/music/music-news/feed/"
    ],
    "Fashion": [
        "https://www.vogue.com/rss",
        "https://www.gq.com/feed/rss",
        "https://www.hypebeast.com/feed"
    ],
}

OUTPUT = Path("docs/data/nowleb.json")
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

MAX_PER_SOURCE = 20
MAX_TOTAL_PER_CATEGORY = 120

def to_iso(dt_struct, fallback=None):
    try:
        ts = time.mktime(dt_struct)
        return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
    except Exception:
        return fallback or datetime.now(timezone.utc).isoformat()

def item_image(entry):
    if hasattr(entry, 'media_content') and entry.media_content:
        mc = entry.media_content[0]
        if isinstance(mc, dict) and mc.get('url'):
            return mc['url']
    if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        mt = entry.media_thumbnail[0]
        if isinstance(mt, dict) and mt.get('url'):
            return mt['url']
    if hasattr(entry, 'links'):
        for l in entry.links:
            if getattr(l, 'rel', '') == 'enclosure' and getattr(l, 'type', '').startswith('image/'):
                return getattr(l, 'href', None)
    return None

def clean(x): return " ".join(str(x or "").split())

def dedup_key(link): return hashlib.sha1(link.encode("utf-8","ignore")).hexdigest()

def main():
    data = {"generated_at": datetime.now(timezone.utc).isoformat(), "categories": {}, "counts": {}}
    for cat, feeds in CATEGORIES.items():
        items, seen = [], set()
        for url in feeds:
            feed = feedparser.parse(url)
            source_title = getattr(feed.feed, "title", url)
            for e in feed.entries[:MAX_PER_SOURCE]:
                link = getattr(e, "link", None) or ""
                if not link: continue
                key = dedup_key(link)
                if key in seen: continue
                seen.add(key)
                title = clean(getattr(e,"title",""))
                summary = clean(getattr(e,"summary","") or getattr(e,"description",""))
                if getattr(e,"published_parsed",None):
                    published = to_iso(e.published_parsed)
                elif getattr(e,"updated_parsed",None):
                    published = to_iso(e.updated_parsed)
                else:
                    published = datetime.now(timezone.utc).isoformat()
                items.append({
                    "id": key,
                    "category": cat,
                    "source": source_title,
                    "source_url": url,
                    "title": title,
                    "link": link,
                    "published": published,
                    "summary": summary,
                    "image": item_image(e),
                    "read_minutes": max(2, min(8, len(summary)//280))
                })
        items.sort(key=lambda x:x["published"], reverse=True)
        data["categories"][cat] = items[:MAX_TOTAL_PER_CATEGORY]
        data["counts"][cat] = len(data["categories"][cat])
    OUTPUT.write_text(json.dumps(data, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
