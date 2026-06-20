#!/usr/bin/env python3
"""Audit every corpus source link. Exit non-zero if any are genuinely broken.

A live source link is a release gate. Some authoritative
domains return 403 to scripted requests while serving fine to real browsers, so
those are treated as live, not broken. Run: python3 scripts/audit-links.py
"""
import json, subprocess, sys, time, concurrent.futures as cf
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124 Safari/537.36")

# Domains known to anti-bot 403 scripted requests while working in a browser.
BOT_BLOCKED = {
    "www.timeanddate.com", "www.congress.gov", "www.britannica.com",
    "english.ahram.org.eg", "www.transportation.gov",
}

DATA = Path(__file__).resolve().parent.parent / "data" / "events.json"


def _curl(url):
    try:
        return subprocess.run(
            ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
             "-L", "--max-time", "25", "-A", UA, url],
            capture_output=True, text=True, timeout=40).stdout.strip()
    except Exception:
        return "ERR"


def check(job):
    # Retry transient failures (5xx, 429, network) so a rate-limited burst does
    # not report a live link as broken.
    eid, url = job
    code = "ERR"
    for attempt in range(3):
        code = _curl(url)
        if code.startswith("2") or code in ("301", "302", "403", "404"):
            break
        time.sleep(1.5 * (attempt + 1))
    return code, eid, url


def main():
    events = json.loads(DATA.read_text())
    jobs = [(e["id"], e["sourceUrl"]) for e in events]
    with cf.ThreadPoolExecutor(max_workers=12) as ex:
        results = list(ex.map(check, jobs))

    print(f"checked {len(results)} source links")
    for code, n in sorted(Counter(c for c, _, _ in results).items(), key=lambda x: -x[1]):
        print(f"  {n:3}  {code}")

    broken = [
        (c, i, u) for c, i, u in results
        if not c.startswith("2") and not (c == "403" and urlparse(u).netloc in BOT_BLOCKED)
    ]
    if broken:
        print("\nBROKEN links (release blocker):")
        for c, i, u in sorted(broken):
            print(f"  {c}  {i}  {u}")
        return 1
    print("\nAll source links live (403s are known anti-bot domains).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
