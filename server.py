"""
PriceHarvest — local server (no extra pip installs needed)

1. Serves all the website files (index.html, predict.html, mandi.html ...)
2. Provides  /api/mandi?city=Mumbai&crop=Onion  which fetches LIVE mandi prices
   from the Government of India Open Data Portal (Agmarknet dataset) and keeps
   your API key secret on the server.

Run:   python server.py
Open:  http://localhost:8000/mandi.html
"""
import json
import os
import re
import time
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", 8000))

# ── Government API: "Current Daily Price of Various Commodities from Various Markets (Mandi)"
RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"
API_URL = f"https://api.data.gov.in/resource/{RESOURCE_ID}"

CITIES = ["Mumbai", "Nashik", "Nagpur", "Kolhapur", "Ratnagiri"]
CROPS = ["Onion", "Tomato", "Potato", "Spinach", "Cabbage"]
STATE = "Maharashtra"
# Names the government data may use for a crop
CROP_ALIASES = {"Spinach": ["Spinach", "Palak(Spinach)"]}

CACHE_SECONDS = 15 * 60
_cache = {}


def load_api_key():
    key = os.environ.get("DATA_GOV_API_KEY", "").strip()
    if key:
        return key
    env_path = os.path.join(BASE_DIR, ".env")
    if os.path.exists(env_path):
        with open(env_path, encoding="utf-8") as f:
            for line in f:
                m = re.match(r"\s*DATA_GOV_API_KEY\s*=\s*(.+?)\s*$", line)
                if m:
                    return m.group(1).strip("\"'")
    return ""


def fetch_commodity(api_key, commodity):
    params = {
        "api-key": api_key,
        "format": "json",
        "limit": "1000",
        "filters[state.keyword]": STATE,
        "filters[commodity]": commodity,
    }
    url = API_URL + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "PriceHarvest/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data.get("records", [])


def to_num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def parse_date(s):
    try:
        d, m, y = s.split("/")
        return (int(y), int(m), int(d))
    except Exception:
        return (0, 0, 0)


def get_prices(city, crop):
    key = load_api_key()
    if not key:
        raise RuntimeError(
            "API key missing. Create a file named .env with the line "
            "DATA_GOV_API_KEY=your_key (see .env.example)."
        )
    crops = CROPS if crop == "All" else [crop]
    rows = []
    for c in crops:
        cache_key = (city, c)
        hit = _cache.get(cache_key)
        if hit and time.time() - hit[0] < CACHE_SECONDS:
            rows.extend(hit[1])
            continue
        found = []
        for name in CROP_ALIASES.get(c, [c]):
            for r in fetch_commodity(key, name):
                district = (r.get("district") or "").lower()
                market = (r.get("market") or "").lower()
                if not city or city.lower() in district or city.lower() in market:
                    found.append({
                        "crop": c,
                        "commodity": r.get("commodity"),
                        "variety": r.get("variety"),
                        "grade": r.get("grade"),
                        "market": r.get("market"),
                        "district": r.get("district"),
                        "state": r.get("state"),
                        "date": r.get("arrival_date"),
                        "min": to_num(r.get("min_price")),
                        "max": to_num(r.get("max_price")),
                        "modal": to_num(r.get("modal_price")),
                    })
        _cache[cache_key] = (time.time(), found)
        rows.extend(found)
    rows.sort(key=lambda r: parse_date(r["date"]), reverse=True)
    return rows


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=BASE_DIR, **kw)

    def send_json(self, obj, status=200):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/mandi":
            q = urllib.parse.parse_qs(parsed.query)
            city = (q.get("city", [""])[0]).strip().title()
            crop = (q.get("crop", ["All"])[0]).strip().title()
            if (city and not re.fullmatch(r"[A-Za-z .-]{1,40}", city)) or (crop != "All" and crop not in CROPS):
                return self.send_json({"error": "Invalid city or crop."}, 400)
            try:
                rows = get_prices(city, crop)
                return self.send_json({"city": city, "crop": crop, "count": len(rows), "records": rows})
            except Exception as e:  # network / key / API problems
                return self.send_json({"error": str(e)}, 502)
        return super().do_GET()


if __name__ == "__main__":
    print(f"PriceHarvest running →  http://localhost:{PORT}/mandi.html")
    if not load_api_key():
        print("⚠  No DATA_GOV_API_KEY found (.env). Live mandi page will show an error until you add it.")
    ThreadingHTTPServer(("", PORT), Handler).serve_forever()
