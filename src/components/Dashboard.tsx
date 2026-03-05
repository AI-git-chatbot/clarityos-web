"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChecklistItem { id: string; text: string; done: boolean; }
interface Session {
    id: string; sessionStart: string; sessionEnd: string;
    durationMinutes: number; primaryCategory: string | null;
    primaryProject: string | null; appsUsed: string | null;
    aiContextSummary: string | null; contextSwitches: number;
}
interface Stats {
    totalMinutes: number; deepWorkMinutes: number; contextSwitches: number;
    longestSessionMinutes: number; categoryBreakdown: Record<string, number>;
    latestAiSummary: string | null; sessionCount: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtMins(mins: number) {
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m`;
    return `${Math.round(mins)}m`;
}
function fmtTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
function getGreeting(name: string | null | undefined) {
    const h = new Date().getHours();
    const part = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
    return `Good ${part}${name ? `, ${name.split(" ")[0]}` : ""}`;
}

const CATEGORY_COLORS: Record<string, { badge: string; dot: string; bar: string; bg: string }> = {
    "Deep Work": { badge: "bg-emerald-500/15 text-emerald-400", dot: "bg-emerald-400", bar: "bg-emerald-400", bg: "rgba(52,211,153,0.15)" },
    "Research": { badge: "bg-indigo-500/15 text-indigo-400", dot: "bg-indigo-400", bar: "bg-indigo-400", bg: "rgba(99,102,241,0.15)" },
    "Learning": { badge: "bg-sky-500/15 text-sky-400", dot: "bg-sky-400", bar: "bg-sky-400", bg: "rgba(56,189,248,0.15)" },
    "Communication": { badge: "bg-amber-500/15 text-amber-400", dot: "bg-amber-400", bar: "bg-amber-400", bg: "rgba(251,191,36,0.15)" },
    "Admin": { badge: "bg-orange-500/15 text-orange-400", dot: "bg-orange-400", bar: "bg-orange-400", bg: "rgba(251,146,60,0.15)" },
    "General Work": { badge: "bg-zinc-500/15 text-zinc-300", dot: "bg-zinc-400", bar: "bg-zinc-400", bg: "rgba(161,161,170,0.12)" },
    "Idle": { badge: "bg-red-500/10 text-red-400", dot: "bg-red-400", bar: "bg-red-400", bg: "rgba(248,113,113,0.10)" },
};
function getColor(cat: string | null) {
    return CATEGORY_COLORS[cat ?? ""] ?? CATEGORY_COLORS["General Work"];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Dashboard({ user, intention }: { user: any; intention: any }) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [loadingStats, setLoadingStats] = useState(true);
    const [copied, setCopied] = useState(false);
    const [newTask, setNewTask] = useState("");
    const [addingTask, setAddingTask] = useState(false);

    // Checklist state
    const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
        try { return JSON.parse(intention?.checklistItems ?? "[]"); } catch { return []; }
    });

    // ── Data fetching ──────────────────────────────────────────────────────────
    const fetchSessions = useCallback(async () => {
        setLoadingSessions(true);
        try {
            const res = await fetch("/api/sessions");
            const data = await res.json();
            setSessions(data.sessions ?? []);
        } catch { } finally { setLoadingSessions(false); }
    }, []);

    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const res = await fetch("/api/stats");
            setStats(await res.json());
        } catch { } finally { setLoadingStats(false); }
    }, []);

    const fetchChecklist = useCallback(async () => {
        try {
            const res = await fetch("/api/checklist");
            if (res.ok) {
                const data = await res.json();
                if (data.items) setChecklist(data.items);
            }
        } catch { }
    }, []);

    useEffect(() => {
        fetchSessions(); fetchStats(); fetchChecklist();
        const interval = setInterval(() => { fetchSessions(); fetchStats(); fetchChecklist(); }, 60_000);
        return () => clearInterval(interval);
    }, [fetchSessions, fetchStats, fetchChecklist]);

    // ── Checklist toggle ──────────────────────────────────────────────────────
    const toggleItem = async (itemId: string, done: boolean) => {
        // Optimistic update
        setChecklist(prev => prev.map(i => i.id === itemId ? { ...i, done } : i));
        try {
            await fetch("/api/checklist", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId, done }),
            });
        } catch { fetchChecklist(); } // revert on error
    };

    const copyToken = () => {
        navigator.clipboard.writeText(user?.apiToken ?? "").then(() => {
            setCopied(true); setTimeout(() => setCopied(false), 2000);
        });
    };

    // ── Add Task ──────────────────────────────────────────────────────────────
    const addTask = async () => {
        const text = newTask.trim();
        if (!text) return;
        setAddingTask(true);
        try {
            // Build new item and merge into checklist via the existing upsert path
            const newItem = { id: crypto.randomUUID(), text, done: false };
            const next = [...checklist, newItem];
            setChecklist(next);
            setNewTask("");
            // Persist: update checklistItems on the server
            await fetch("/api/checklist/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item: newItem }),
            });
        } finally {
            setAddingTask(false);
        }
    };

    const handleNewTaskKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { e.preventDefault(); void addTask(); }
    };

    const maxCatMinutes = stats ? Math.max(...Object.values(stats.categoryBreakdown), 1) : 1;
    const doneCount = checklist.filter(i => i.done).length;
    const totalCount = checklist.length;

    return (
        <div className="min-h-screen bg-[#080810] pb-24">

            {/* ── Header ── */}
            <header className="border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.45)]">
                            <span className="text-[11px] font-black text-white">C</span>
                        </div>
                        <span className="font-black text-sm tracking-tight">ClarityOS</span>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                            Live
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {user?.name && (
                            <span className="text-xs text-zinc-400 hidden sm:block max-w-[120px] truncate">
                                {user.name}
                            </span>
                        )}
                        <button
                            onClick={() => signOut()}
                            className="text-xs font-semibold text-zinc-500 hover:text-white bg-white/4 hover:bg-white/8 border border-white/6 hover:border-white/12 px-3 py-1.5 rounded-lg transition-all"
                        >Sign out</button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-8 space-y-6">

                {/* ── Greeting ── */}
                <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <h1 className="text-2xl font-black tracking-tight text-white">
                        {getGreeting(user?.name)} 👋
                    </h1>
                    <p className="text-zinc-500 text-sm mt-0.5">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        <span className="mx-1.5 text-zinc-700">·</span>
                        <span className="text-zinc-600">Let's make today count.</span>
                    </p>
                </div>

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* ── LEFT col: checklist + activity ── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Checklist card */}
                        <div className="glass-card rounded-2xl border border-white/6 p-5 animate-in fade-in slide-in-from-bottom-4 duration-600">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Today's Tasks</h2>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {doneCount}/{totalCount} completed
                                        {doneCount > 0 && doneCount === totalCount && " 🎉"}
                                    </p>
                                </div>
                                {/* Progress bar */}
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-700"
                                            style={{ width: totalCount ? `${(doneCount / totalCount) * 100}%` : "0%" }}
                                        />
                                    </div>
                                    <span className="text-xs text-zinc-500 font-medium w-8 text-right">
                                        {totalCount ? Math.round((doneCount / totalCount) * 100) : 0}%
                                    </span>
                                </div>
                            </div>

                            {checklist.length > 0 && (
                                <ul className="space-y-2 mb-4">
                                    {checklist.map((item, i) => (
                                        <li
                                            key={item.id}
                                            className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all group ${item.done
                                                ? "bg-emerald-500/8 border border-emerald-500/15"
                                                : "bg-white/3 border border-white/5 hover:border-white/10"
                                                }`}
                                            style={{ animationDelay: `${i * 50}ms` }}
                                            onClick={() => toggleItem(item.id, !item.done)}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${item.done
                                                ? "bg-emerald-500 border-emerald-500"
                                                : "border-zinc-600 group-hover:border-zinc-400"
                                                }`}>
                                                {item.done && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`text-sm flex-1 transition-all ${item.done ? "line-through text-zinc-500" : "text-white/90"}`}>
                                                {item.text}
                                            </span>
                                            {item.done && (
                                                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                                    Done ✓
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Add task inline input */}
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={e => setNewTask(e.target.value)}
                                    onKeyDown={handleNewTaskKey}
                                    placeholder={checklist.length === 0 ? "Add your first task for today…" : "Add another task…"}
                                    className="flex-1 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/40 focus:bg-violet-500/5 transition-all"
                                />
                                <button
                                    onClick={() => void addTask()}
                                    disabled={!newTask.trim() || addingTask}
                                    className="shrink-0 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                                >
                                    {addingTask ? "…" : "+ Add"}
                                </button>
                            </div>
                        </div>

                        {/* Activity Feed */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Activity Feed</h2>
                                <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Syncs every 15 min
                                </div>
                            </div>

                            {loadingSessions ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
                                            <div className="flex justify-between mb-3">
                                                <div className="h-4 w-32 bg-white/8 rounded" />
                                                <div className="h-4 w-12 bg-white/8 rounded" />
                                            </div>
                                            <div className="h-3 w-56 bg-white/5 rounded" />
                                        </div>
                                    ))}
                                </div>
                            ) : sessions.length === 0 ? (
                                <div className="glass-card rounded-2xl p-10 border border-white/5 text-center">
                                    <div className="text-5xl mb-4">📡</div>
                                    <p className="text-white font-bold text-base mb-1">No activity tracked yet today</p>
                                    <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                                        Your desktop tracker isn't running yet. Install it in under 2 minutes — no coding required.
                                    </p>
                                    <div className="flex items-center justify-center gap-3 flex-wrap">
                                        <a
                                            href="/setup"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.45)]"
                                        >
                                            ⚡ View Setup Guide
                                        </a>
                                        <a
                                            href="/api/download"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 bg-white/6 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl transition-all"
                                        >
                                            ⬇ Download Tracker
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sessions.map((s, i) => {
                                        const color = getColor(s.primaryCategory);
                                        const apps = s.appsUsed?.split(",").map(a => a.trim()).filter(Boolean) ?? [];
                                        return (
                                            <div
                                                key={s.id}
                                                className="glass-card p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all animate-in fade-in slide-in-from-bottom-3"
                                                style={{ animationDelay: `${i * 50}ms` }}
                                            >
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex items-center gap-2.5 flex-wrap">
                                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${color.badge}`}>
                                                            {s.primaryCategory ?? "Unknown"}
                                                        </span>
                                                        <span className="font-semibold text-sm text-white">{s.primaryProject ?? "—"}</span>
                                                        <span className="text-zinc-500 text-xs hidden sm:block">
                                                            {fmtTime(s.sessionStart)} – {fmtTime(s.sessionEnd)}
                                                        </span>
                                                    </div>
                                                    <span className={`font-bold text-sm shrink-0 ${color.dot.replace("bg-", "text-")}`}>
                                                        {fmtMins(s.durationMinutes)}
                                                    </span>
                                                </div>
                                                {s.aiContextSummary && (
                                                    <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{s.aiContextSummary}</p>
                                                )}
                                                {apps.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2.5">
                                                        {apps.slice(0, 5).map(app => (
                                                            <span key={app} className="text-[10px] bg-white/4 text-zinc-500 px-2 py-0.5 rounded">{app}</span>
                                                        ))}
                                                        {apps.length > 5 && <span className="text-[10px] text-zinc-700">+{apps.length - 5}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT col: Metrics ── */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Today's Metrics</h2>

                        {/* Core stats */}
                        <div className="glass-card p-5 rounded-2xl border border-white/6 space-y-5">
                            {loadingStats ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3].map(i => (
                                        <div key={i}>
                                            <div className="h-3 w-20 bg-white/8 rounded mb-1.5" />
                                            <div className="h-7 w-24 bg-white/8 rounded" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Tracked</div>
                                        <div className="text-3xl font-black">{fmtMins(stats?.totalMinutes ?? 0)}</div>
                                    </div>
                                    <div>
                                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Focused Work</div>
                                        <div className="text-3xl font-black text-emerald-400">{fmtMins(stats?.deepWorkMinutes ?? 0)}</div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div>
                                            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Switches</div>
                                            <div className="text-2xl font-black text-amber-400">{stats?.contextSwitches ?? 0}</div>
                                        </div>
                                        <div>
                                            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Longest</div>
                                            <div className="text-2xl font-black">{fmtMins(stats?.longestSessionMinutes ?? 0)}</div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Category breakdown */}
                        {!loadingStats && stats && Object.keys(stats.categoryBreakdown).length > 0 && (
                            <div className="glass-card p-5 rounded-2xl border border-white/6">
                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">By Category</h3>
                                <div className="space-y-2.5">
                                    {Object.entries(stats.categoryBreakdown)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([cat, mins]) => {
                                            const color = getColor(cat);
                                            const pct = Math.round((mins / maxCatMinutes) * 100);
                                            return (
                                                <div key={cat}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-zinc-300 font-medium">{cat}</span>
                                                        <span className="text-zinc-500">{fmtMins(mins)}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/4 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ${color.bar}`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )}

                        {/* AI Reflection */}
                        {!loadingStats && stats?.latestAiSummary && (
                            <div className="glass-card p-5 rounded-2xl border border-violet-500/20 bg-violet-500/4">
                                <h3 className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">🤖 AI Reflection</h3>
                                <p className="text-xs text-zinc-300 leading-relaxed">{stats.latestAiSummary}</p>
                            </div>
                        )}

                        {/* Desktop Token */}
                        <div className="glass-card p-5 rounded-2xl border border-violet-500/15 bg-violet-500/3">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-base">🔑</span>
                                <h3 className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Desktop API Token</h3>
                            </div>
                            <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                                Paste this once into the installer dialog. Stored locally — never shared.
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex-1 bg-black/50 border border-white/8 rounded-xl px-3 py-2.5 text-xs font-mono text-zinc-300 truncate select-all">
                                    {user?.apiToken ?? "—"}
                                </div>
                                <button
                                    onClick={copyToken}
                                    className={`shrink-0 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${copied
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                            : "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_16px_rgba(139,92,246,0.25)]"
                                        }`}
                                >
                                    {copied ? "✓ Copied!" : "Copy"}
                                </button>
                            </div>
                            <p className="text-[10px] text-zinc-700">Use during install.bat setup on your PC</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
