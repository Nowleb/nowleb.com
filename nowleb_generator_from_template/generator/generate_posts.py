import json
from pathlib import Path
from datetime import datetime
from slugify import slugify
from jinja2 import Environment, FileSystemLoader, select_autoescape

DATA = Path("docs/data/nowleb.json")
OUT_DIR = Path("docs/news")
TEMPLATES = Path("templates")
OUT_DIR.mkdir(parents=True, exist_ok=True)

env = Environment(
    loader=FileSystemLoader(str(TEMPLATES)),
    autoescape=select_autoescape(["html"]),
    trim_blocks=True,
    lstrip_blocks=True,
)

def to_date(iso): 
    try:
        return datetime.fromisoformat(iso.replace("Z","+00:00")).strftime("%B %d, %Y")
    except Exception:
        return iso

def build():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    items = []
    for cat, arr in data.get("categories", {}).items():
        for it in arr:
            it["category"] = cat
            items.append(it)

    # Render per-article by category
    art_t = env.get_template("nowleb_article.html.j2")
    for it in items:
        slug = slugify(it["title"])[:80] or it["id"]
        folder = OUT_DIR / it["category"].lower() / slug
        folder.mkdir(parents=True, exist_ok=True)
        html = art_t.render(
            title=it["title"],
            category=it["category"],
            source=it["source"],
            date_str=to_date(it["published"]),
            read_minutes=it.get("read_minutes", 4),
            hero_image=it.get("image"),
            summary=it.get("summary",""),
            original_url=it["link"],
            article_id=it["id"],
        )
        (folder / "index.html").write_text(html, encoding="utf-8")

    # Render news index
    idx_t = env.get_template("nowleb_index.html.j2")
    listing = [{
        "title": it["title"],
        "slug": (slugify(it["title"])[:80] or it["id"]),
        "category": it["category"],
        "source": it["source"],
        "published": to_date(it["published"]),
        "hero_image": it.get("image"),
        "summary": it.get("summary","")
    } for it in items]
    (OUT_DIR / "index.html").write_text(idx_t.render(items=listing), encoding="utf-8")

    # Root index redirect to /news/
    Path("docs/index.html").write_text('<meta http-equiv="refresh" content="0; url=news/" />', encoding="utf-8")

if __name__ == "__main__":
    build()
