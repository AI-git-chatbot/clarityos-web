#!/usr/bin/env python3
"""
ClarityOS Desktop Tracker — Standalone Edition
================================================
Single-file tracker. Auto-installs required packages.
On first run, prompts for your API token and saves it.

Usage:
    python tracker.py

Get your token from: https://clarityos.kvantumtech.com (Dashboard → API Token)
"""

import sys
import subprocess
import os
import json
from pathlib import Path

# ── 1. Auto-install missing dependencies ────────────────────────────────────────
REQUIRED = ["pywin32", "schedule", "psutil", "ollama"]

def install_deps():
    for pkg in REQUIRED:
        try:
            __import__(pkg.replace("-", "_").split("[")[0])
        except ImportError:
            print(f"Installing {pkg}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", pkg])

print("ClarityOS Tracker starting...")
install_deps()

# ── 2. Now import everything ─────────────────────────────────────────────────────
import re
import time
import sqlite3
import threading
import urllib.request
import urllib.error
import schedule
import ollama
from datetime import datetime

# ── 3. Config ─────────────────────────────────────────────────────────────────────
# Priority order for token:
#   1. --token CLI argument
#   2. config.json next to this script  ← written by install.bat
#   3. ~/.clarityos/config.json          ← manual / legacy path
#   4. Interactive prompt (only if running in a real terminal)

SCRIPT_DIR  = Path(__file__).parent
SCRIPT_CFG  = SCRIPT_DIR / "config.json"   # install.bat puts it here

CONFIG_DIR  = Path.home() / ".clarityos"
CONFIG_FILE = CONFIG_DIR / "config.json"
DB_PATH     = str(CONFIG_DIR / "tracker.db")
CONFIG_DIR.mkdir(parents=True, exist_ok=True)

API_ENDPOINT = "https://clarityos.kvantumtech.com/api/sync"

def load_config():
    # Check script-local config first (set by install.bat)
    for cfg_path in [SCRIPT_CFG, CONFIG_FILE]:
        if cfg_path.exists():
            try:
                return json.loads(cfg_path.read_text())
            except Exception:
                pass
    return {}

def save_config(cfg):
    CONFIG_FILE.write_text(json.dumps(cfg, indent=2))

def get_api_token():
    """Return API token. Only prompts if no token found anywhere and stdin is a TTY."""
    import argparse
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--token", default="")
    parser.add_argument("--reset-token", action="store_true")
    args, _ = parser.parse_known_args()

    # --reset-token: clear saved token and prompt again
    if args.reset_token:
        cfg = load_config()
        cfg.pop("api_token", None)
        save_config(cfg)
        print("[Reset] API token cleared. Enter a new one below.")

    # --token flag takes highest priority
    if args.token:
        cfg = load_config()
        cfg["api_token"] = args.token
        save_config(cfg)
        print(f"[OK] Token saved.")
        return args.token

    # Load from saved config
    cfg = load_config()
    token = cfg.get("api_token", "").strip()
    if token:
        return token

    # No token found — only prompt if we have a real terminal (not running as background service)
    if not sys.stdin or not sys.stdin.isatty():
        print("[WARN] No API token found. Run install.bat to set up, or use: python tracker.py --token YOUR_TOKEN")
        return ""

    print()
    print("=" * 55)
    print("  Welcome to ClarityOS! First-time setup.")
    print("=" * 55)
    print()
    print("  1. Go to: https://clarityos.kvantumtech.com")
    print("  2. Sign in with Google")
    print("  3. Copy your API token from the Dashboard")
    print()
    token = input("  Paste your API Token here: ").strip()
    if not token:
        print("[WARN] No token entered. Tracking locally only (no cloud sync).")
    else:
        cfg["api_token"] = token
        save_config(cfg)
        print(f"[OK] Token saved to {CONFIG_FILE}")
    print()
    return token

API_TOKEN = get_api_token()


VALID_CATEGORIES = {"Deep Work", "Admin", "Research", "Communication", "Learning", "General Work"}
SESSION_THRESHOLD_SECONDS = 15 * 60

# ── 4. Database ───────────────────────────────────────────────────────────────────
def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS raw_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            start_time DATETIME NOT NULL, end_time DATETIME NOT NULL,
            duration_seconds INTEGER NOT NULL, app_name TEXT NOT NULL,
            window_title TEXT NOT NULL, is_idle BOOLEAN DEFAULT 0)""")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_ra_time ON raw_activity(start_time)")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_start DATETIME, session_end DATETIME,
            duration_minutes REAL, primary_category TEXT,
            primary_project TEXT, apps_used TEXT,
            ai_context_summary TEXT, context_switches INTEGER DEFAULT 0,
            synced BOOLEAN DEFAULT 0)""")
    conn.commit(); conn.close()

def log_activity(start, end, duration, app, title, is_idle=False):
    conn = sqlite3.connect(DB_PATH)
    conn.execute("INSERT INTO raw_activity VALUES (null,?,?,?,?,?,?)",
        (start.isoformat(), end.isoformat(), duration, app, title, is_idle))
    conn.commit(); conn.close()

def get_unprocessed_activities(since=None):
    conn = sqlite3.connect(DB_PATH)
    if since:
        rows = conn.execute("SELECT * FROM raw_activity WHERE start_time > ? ORDER BY start_time",
            (since.isoformat(),)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM raw_activity ORDER BY start_time").fetchall()
    conn.close(); return rows

# ── 5. Window Monitor ─────────────────────────────────────────────────────────────
IDLE_THRESHOLD_SECONDS = 300  # 5 minutes

def get_active_window():
    try:
        import win32gui, win32process
        import psutil
        hwnd = win32gui.GetForegroundWindow()
        title = win32gui.GetWindowText(hwnd)
        _, pid = win32process.GetWindowThreadProcessId(hwnd)
        proc = psutil.Process(pid)
        return proc.name(), title
    except Exception:
        return "Unknown", "Unknown"

def get_idle_seconds():
    try:
        import win32api
        info = win32api.GetLastInputInfo()
        millis = win32api.GetTickCount() - info
        return millis / 1000.0
    except Exception:
        return 0

def run_tracker():
    """Continuously logs the active window every 5 seconds."""
    print(f"[OK] Tracking started. Data stored at: {DB_PATH}")
    last_app, last_title = "", ""
    window_start = datetime.now()

    while True:
        try:
            app, title = get_active_window()
            idle = get_idle_seconds() > IDLE_THRESHOLD_SECONDS
            now = datetime.now()

            if app != last_app or title != last_title:
                if last_app:
                    duration = int((now - window_start).total_seconds())
                    if duration > 1:
                        log_activity(window_start, now, duration, last_app, last_title, idle)
                last_app, last_title, window_start = app, title, now

            time.sleep(5)
        except KeyboardInterrupt:
            print("\n[Stopped] ClarityOS tracker shutting down.")
            break
        except Exception:
            time.sleep(5)

# ── 6. AI Classifier ──────────────────────────────────────────────────────────────
def _extract_json(text):
    for pattern in [r'\{[\s\S]*?\}', r'\{[\s\S]+\}']:
        try:
            m = re.search(pattern, text)
            if m: return json.loads(m.group())
        except: pass
    result = {}
    for key in ("primary_category", "primary_project", "ai_context_summary"):
        m = re.search(rf'''["']?{key}["']?\s*:\s*["']([^"'{{}}]+)["']''', text, re.IGNORECASE)
        if m: result[key] = m.group(1).strip()
    return result or None

def classify(activities_text, max_retries=3):
    prompt = f"""You are a work-tracking AI. Classify this work session.

ACTIVITIES:
{activities_text}

CATEGORIES (pick one): Deep Work, Research, Communication, Admin, Learning, General Work

EXAMPLE OUTPUT:
{{"primary_category": "Deep Work", "primary_project": "ClarityOS", "ai_context_summary": "User was coding the tracker script."}}

Respond with ONLY the JSON. No markdown, no explanation."""

    fallback = {"primary_category": "General Work", "primary_project": "Unknown",
                "ai_context_summary": "Could not classify this session."}

    for attempt in range(1, max_retries + 1):
        try:
            resp = ollama.chat(model='llama3.2',
                messages=[{'role': 'user', 'content': prompt}],
                options={'temperature': 0.0})
            content = resp.message.content.strip()
            parsed = _extract_json(content)
            if not parsed:
                continue
            cat = parsed.get("primary_category", "").strip()
            if cat not in VALID_CATEGORIES:
                parsed["primary_category"] = "General Work"
            parsed.setdefault("primary_project", "Unknown")
            parsed.setdefault("ai_context_summary", "No summary.")
            return parsed
        except Exception as e:
            print(f"  [AI attempt {attempt}] {e}")
    return fallback

# ── 7. Sync ───────────────────────────────────────────────────────────────────────
def sync_session(data):
    if not API_TOKEN:
        return False
    try:
        payload = json.dumps(data).encode("utf-8")
        req = urllib.request.Request(API_ENDPOINT, method="POST")
        req.add_header("Content-Type", "application/json")
        req.add_header("Authorization", f"Bearer {API_TOKEN}")
        with urllib.request.urlopen(req, data=payload, timeout=15) as r:
            print(f"  Synced ✓ [{r.status}]")
            return True
    except Exception as e:
        print(f"  Sync failed: {e}")
        return False

# ── 8. Aggregator ─────────────────────────────────────────────────────────────────
def aggregate_sessions():
    print(f"\n[{datetime.now().strftime('%H:%M')}] Running AI classification...")
    conn = sqlite3.connect(DB_PATH)
    row = conn.execute("SELECT session_end FROM sessions ORDER BY session_end DESC LIMIT 1").fetchone()
    conn.close()
    since = datetime.fromisoformat(row[0]) if row else None
    activities = get_unprocessed_activities(since)
    if not activities:
        print("  No new activities."); return

    chunk, chunk_start = [], datetime.fromisoformat(activities[0][1])
    def flush(chunk):
        if not chunk: return
        start, end = chunk[0][1], chunk[-1][2]
        total = sum(a[3] for a in chunk)
        idle = sum(a[3] for a in chunk if a[6] == 1)
        switches = len(chunk)
        app_usage = {}
        for a in chunk:
            if a[3] < 5: continue
            if a[4] not in app_usage: app_usage[a[4]] = {"d": 0, "t": set()}
            app_usage[a[4]]["d"] += a[3]
            if len(app_usage[a[4]]["t"]) < 3: app_usage[a[4]]["t"].add(a[5])
        lines = [f"- App: {app} ({d['d']}s)\n  Titles: {', '.join(d['t'])}" for app, d in app_usage.items()]

        if idle > total * 0.8 or (total - idle) < 30:
            ai = {"primary_category": "Idle", "primary_project": "Away",
                  "ai_context_summary": "User was away from the computer."}
        else:
            ai = classify("\n".join(lines))

        dur_mins = total / 60.0
        apps_str = ", ".join(app_usage.keys())
        print(f"  ✓ {ai['primary_category']} | {ai['primary_project']} | {dur_mins:.1f}m")

        conn2 = sqlite3.connect(DB_PATH)
        conn2.execute("""INSERT INTO sessions VALUES (null,?,?,?,?,?,?,?,?,0)""",
            (start, end, dur_mins, ai["primary_category"], ai["primary_project"],
             apps_str, ai["ai_context_summary"], switches))
        conn2.commit(); conn2.close()

        sync_session({
            "sessionStart": start, "sessionEnd": end, "durationMinutes": dur_mins,
            "primaryCategory": ai["primary_category"], "primaryProject": ai["primary_project"],
            "appsUsed": apps_str, "aiContextSummary": ai["ai_context_summary"],
            "contextSwitches": switches
        })

    for act in activities:
        s = datetime.fromisoformat(act[1])
        if (s - chunk_start).total_seconds() > SESSION_THRESHOLD_SECONDS:
            flush(chunk); chunk = [act]; chunk_start = s
        else:
            chunk.append(act)
    flush(chunk)
    print("  Done.")

# ── 9. Scheduler + Main ───────────────────────────────────────────────────────────
def run_scheduler():
    schedule.every(15).minutes.do(aggregate_sessions)
    while True:
        schedule.run_pending()
        time.sleep(60)

def main():
    print(f"ClarityOS Tracker v1.0")
    print(f"Dashboard: https://clarityos.kvantumtech.com")
    print(f"Token:     {API_TOKEN[:8]}..." if API_TOKEN else "Token:     (none — local only)")
    print()
    init_db()
    t = threading.Thread(target=run_scheduler, daemon=True)
    t.start()
    run_tracker()

if __name__ == "__main__":
    main()
