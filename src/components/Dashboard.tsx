"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

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

// Focus score: % of tracked time that is deep work
function calcFocusScore(total: number, deep: number) {
    if (!total) return 0;
    return Math.round((deep / total) * 100);
}

const CATEGORY_COLORS: Record<string, { badge: string; dot: string; bar: string; glow: string }> = {
    "Deep Work": { badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20", dot: "bg-emerald-400", bar: "bg-gradient-to-r from-emerald-500 to-emerald-400", glow: "rgba(52,211,153,0.2)" },
    "Research": { badge: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20", dot: "bg-indigo-400", bar: "bg-gradient-to-r from-indigo-500 to-indigo-400", glow: "rgba(99,102,241,0.2)" },
    "Learning": { badge: "bg-sky-500/15 text-sky-400 border border-sky-500/20", dot: "bg-sky-400", bar: "bg-gradient-to-r from-sky-500 to-sky-400", glow: "rgba(56,189,248,0.2)" },
    "Communication": { badge: "bg-amber-500/15 text-amber-400 border border-amber-500/20", dot: "bg-amber-400", bar: "bg-gradient-to-r from-amber-500 to-amber-400", glow: "rgba(251,191,36,0.2)" },
    "Admin": { badge: "bg-orange-500/15 text-orange-400 border border-orange-500/20", dot: "bg-orange-400", bar: "bg-gradient-to-r from-orange-500 to-orange-400", glow: "rgba(251,146,60,0.2)" },
    "General Work": { badge: "bg-zinc-500/15 text-zinc-300 border border-zinc-500/20", dot: "bg-zinc-400", bar: "bg-gradient-to-r from-zinc-500 to-zinc-400", glow: "rgba(161,161,170,0.15)" },
    "Idle": { badge: "bg-red-500/10 text-red-400 border border-red-500/15", dot: "bg-red-400", bar: "bg-gradient-to-r from-red-500 to-red-400", glow: "rgba(248,113,113,0.15)" },
};
function getColor(cat: string | null) {
    return CATEGORY_COLORS[cat ?? ""] ?? CATEGORY_COLORS["General Work"];
}

// Focus score ring SVG
function FocusRing({ score }: { score: number }) {
    const r = 28;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color = score >= 60 ? "#34d399" : score >= 30 ? "#facc15" : "#f87171";
    return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="drop-shadow-lg">
            <circle cx="36" cy="36" r={r} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
            <circle
                cx="36" cy="36" r={r}
                stroke={color}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 6px ${color})` }}
            />
            <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="900" fill="white">{score}%</text>
        </svg>
    );
}

// Stat card component
function StatCard({
    label, value, sub, accent = "white", glow = false
}: {
    label: string; value: string; sub?: string; accent?: string; glow?: boolean;
}) {
    return (
        <div className={`glass-card rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] group ${glow ? "border-emerald-500/20 hover:border-emerald-500/35 hover:shadow-[0_0_32px_rgba(52,211,153,0.12)]" : "border-white/6 hover:border-white/12 hover:shadow-[0_0_24px_rgba(139,92,246,0.08)]"}`}>
            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">{label}</div>
            <div className={`text-3xl font-black tracking-tight text-${accent} group-hover:scale-[1.03] transition-transform origin-left duration-200`} style={accent !== "white" ? {} : { color: "white" }}>
                {value}
            </div>
            {sub && <div className="text-zinc-600 text-[11px] mt-1">{sub}</div>}
        </div>
    );
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
        setChecklist(prev => prev.map(i => i.id === itemId ? { ...i, done } : i));
        try {
            await fetch("/api/checklist", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId, done }),
            });
        } catch { fetchChecklist(); }
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
            const newItem = { id: crypto.randomUUID(), text, done: false };
            setChecklist(next => [...next, newItem]);
            setNewTask("");
            await fetch("/api/checklist/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item: newItem }),
            });
        } finally { setAddingTask(false); }
    };

    const handleNewTaskKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { e.preventDefault(); void addTask(); }
    };

    const maxCatMinutes = stats ? Math.max(...Object.values(stats.categoryBreakdown), 1) : 1;
    const doneCount = checklist.filter(i => i.done).length;
    const totalCount = checklist.length;
    const focusScore = calcFocusScore(stats?.totalMinutes ?? 0, stats?.deepWorkMinutes ?? 0);

    return (
        <div className="min-h-screen bg-[#080810] pb-24">

            {/* ── Header ── */}
            <header className="border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-[180px]">
                            <Image
                                src="/clarityos-logo.png"
                                alt="ClarityOS"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                            Live
                        </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        {user?.name && (
                            <span className="text-xs text-zinc-400 hidden sm:block max-w-[140px] truncate">{user.name}</span>
                        )}
                        <button
                            onClick={() => signOut()}
                            className="text-xs font-semibold text-zinc-500 hover:text-white bg-white/4 hover:bg-white/8 border border-white/6 hover:border-white/12 px-3 py-1.5 rounded-lg transition-all"
                        >Sign out</button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">

                {/* ── Greeting ── */}
                <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            {getGreeting(user?.name)} 👋
                        </h1>
                        <p className="text-zinc-500 text-sm mt-0.5">
                            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                            <span className="mx-1.5 text-zinc-700">·</span>
                            <span className="text-zinc-600">Let's make today count.</span>
                        </p>
                    </div>
                    {/* Focus score ring */}
                    {!loadingStats && stats && stats.totalMinutes > 0 && (
                        <div className="flex items-center gap-3 animate-in fade-in duration-700">
                            <FocusRing score={focusScore} />
                            <div>
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Focus Score</div>
                                <div className="text-xs text-zinc-400 mt-0.5">of tracked time = deep work</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Top stats row ── */}
                {!loadingStats && stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-3 duration-600">
                        <StatCard label="Total Tracked" value={fmtMins(stats.totalMinutes)} sub={`${stats.sessionCount} sessions`} />
                        <StatCard label="Focused Work" value={fmtMins(stats.deepWorkMinutes)} accent="emerald-400" glow />
                        <StatCard label="Context Switches" value={String(stats.contextSwitches)} sub="interruptions" accent="amber-400" />
                        <StatCard label="Longest Session" value={fmtMins(stats.longestSessionMinutes)} sub="unbroken focus" />
                    </div>
                )}
                {loadingStats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="glass-card rounded-2xl p-5 border border-white/5 animate-pulse">
                                <div className="h-2 w-16 bg-white/8 rounded mb-3" />
                                <div className="h-8 w-20 bg-white/8 rounded" />
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* ── LEFT col: checklist + activity ── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Checklist card */}
                        <div className="glass-card rounded-2xl border border-white/6 p-5 animate-in fade-in slide-in-from-bottom-4 duration-600 hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Today's Tasks</h2>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {doneCount}/{totalCount} completed
                                        {doneCount > 0 && doneCount === totalCount && " 🎉"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-28 h-1.5 bg-white/5 rounded-full overflow-hidden">
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

                            {checklist.length > 0 ? (
                                <ul className="space-y-2 mb-4">
                                    {checklist.map((item, i) => (
                                        <li
                                            key={item.id}
                                            className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all group ${item.done
                                                ? "bg-emerald-500/8 border border-emerald-500/15 shadow-[0_0_12px_rgba(52,211,153,0.05)]"
                                                : "bg-white/3 border border-white/5 hover:border-white/12 hover:bg-white/5"
                                                }`}
                                            style={{ animationDelay: `${i * 50}ms` }}
                                            onClick={() => toggleItem(item.id, !item.done)}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${item.done
                                                ? "bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.35)]"
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
                                                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-500/15 px-2 py-0.5 rounded-full">
                                                    Done ✓
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-6 mb-3">
                                    <div className="text-3xl mb-2">📋</div>
                                    <p className="text-zinc-500 text-sm">No tasks yet — add your first one below</p>
                                </div>
                            )}

                            {/* Add task */}
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
                                    className="shrink-0 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-[0_0_16px_rgba(139,92,246,0.2)] hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]"
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
                                // ── Rich empty state ──────────────────────────
                                <div className="glass-card rounded-2xl p-10 border border-white/5 text-center relative overflow-hidden">
                                    {/* Ambient glow behind the icon */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-48 h-48 bg-violet-600/8 rounded-full blur-[60px]" />
                                    </div>
                                    <div className="relative">
                                        {/* Animated radar icon */}
                                        <div className="relative w-16 h-16 mx-auto mb-5">
                                            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 animate-ping" style={{ animationDuration: "2s" }} />
                                            <div className="absolute inset-2 rounded-full border border-violet-500/30 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
                                            <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-2xl">
                                                📡
                                            </div>
                                        </div>
                                        <p className="text-white font-bold text-base mb-2">Waiting for your first session</p>
                                        <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-7 leading-relaxed">
                                            Install the desktop tracker and ClarityOS will start capturing your work activity — silently, in the background.
                                        </p>
                                        <div className="flex items-center justify-center gap-3 flex-wrap">
                                            <a
                                                href="/setup"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_24px_rgba(139,92,246,0.3)]"
                                            >
                                                ⚡ View Setup Guide
                                            </a>
                                            <a
                                                href="/api/download"
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 bg-white/6 hover:bg-white/10 border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-xl transition-all"
                                            >
                                                ⬇ Download Tracker
                                            </a>
                                        </div>
                                        <p className="text-zinc-700 text-[11px] mt-5">
                                            Your API token is in the sidebar →
                                        </p>
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
                                                className="glass-card p-4 rounded-xl border border-white/5 hover:border-white/12 transition-all animate-in fade-in slide-in-from-bottom-3 hover:shadow-lg group"
                                                style={{ animationDelay: `${i * 50}ms`, ["--tw-shadow" as any]: `0 0 20px ${color.glow}` }}
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
                                                    <span className={`font-bold text-sm shrink-0 text-white group-hover:scale-110 transition-transform`}>
                                                        {fmtMins(s.durationMinutes)}
                                                    </span>
                                                </div>
                                                {s.aiContextSummary && (
                                                    <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{s.aiContextSummary}</p>
                                                )}
                                                {apps.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2.5">
                                                        {apps.slice(0, 6).map(app => (
                                                            <span key={app} className="text-[10px] bg-white/4 hover:bg-white/8 text-zinc-500 px-2 py-0.5 rounded transition-colors cursor-default">{app}</span>
                                                        ))}
                                                        {apps.length > 6 && <span className="text-[10px] text-zinc-700">+{apps.length - 6}</span>}
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
                        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Insights</h2>

                        {/* Category breakdown */}
                        {!loadingStats && stats && Object.keys(stats.categoryBreakdown).length > 0 ? (
                            <div className="glass-card p-5 rounded-2xl border border-white/6 hover:border-white/10 transition-colors">
                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">By Category</h3>
                                <div className="space-y-3">
                                    {Object.entries(stats.categoryBreakdown)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([cat, mins]) => {
                                            const color = getColor(cat);
                                            const pct = Math.round((mins / maxCatMinutes) * 100);
                                            return (
                                                <div key={cat}>
                                                    <div className="flex justify-between text-xs mb-1.5">
                                                        <span className="text-zinc-300 font-medium">{cat}</span>
                                                        <span className="text-zinc-500 font-mono">{fmtMins(mins)}</span>
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
                        ) : !loadingStats && (
                            <div className="glass-card p-5 rounded-2xl border border-white/5 text-center">
                                <div className="text-2xl mb-2">📊</div>
                                <p className="text-zinc-600 text-xs">Category breakdown will appear once sessions are synced</p>
                            </div>
                        )}
                        {loadingStats && (
                            <div className="glass-card p-5 rounded-2xl border border-white/5 animate-pulse space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i}>
                                        <div className="h-2 w-20 bg-white/8 rounded mb-2" />
                                        <div className="h-1.5 w-full bg-white/5 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* AI Reflection */}
                        {!loadingStats && stats?.latestAiSummary && (
                            <div className="glass-card p-5 rounded-2xl border border-violet-500/20 bg-violet-500/4 hover:border-violet-500/30 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-base">🤖</span>
                                    <h3 className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">AI Reflection</h3>
                                </div>
                                <p className="text-xs text-zinc-300 leading-relaxed italic">"{stats.latestAiSummary}"</p>
                            </div>
                        )}

                        {/* ── Tracker Status ── */}
                        {(() => {
                            const now = new Date();
                            const lastSession = sessions.length > 0
                                ? sessions.reduce((latest, s) =>
                                    new Date(s.sessionEnd) > new Date(latest.sessionEnd) ? s : latest
                                )
                                : null;
                            const minsAgo = lastSession
                                ? Math.round((now.getTime() - new Date(lastSession.sessionEnd).getTime()) / 60000)
                                : null;

                            const isLive = minsAgo !== null && minsAgo <= 120;
                            const isIdle = minsAgo !== null && minsAgo > 120;
                            const isOffline = minsAgo === null;

                            let statusColor = isLive
                                ? "border-emerald-500/25 bg-emerald-500/5"
                                : isIdle ? "border-amber-500/25 bg-amber-500/5"
                                    : "border-white/8 bg-white/3";
                            let dotColor = isLive ? "bg-emerald-400 animate-pulse" : isIdle ? "bg-amber-400" : "bg-zinc-600";
                            let textColor = isLive ? "text-emerald-400" : isIdle ? "text-amber-400" : "text-zinc-500";
                            let label = isLive ? "Connected · Live"
                                : isIdle ? "Connected · Idle"
                                    : "Waiting for tracker";
                            let sub = isLive
                                ? `Last sync ${minsAgo}m ago`
                                : isIdle ? `Last sync ${minsAgo! >= 60 ? `${Math.floor(minsAgo! / 60)}h ${minsAgo! % 60}m` : `${minsAgo}m`} ago`
                                    : "No sessions synced yet today";

                            return (
                                <div className={`glass-card p-5 rounded-2xl border ${statusColor} transition-colors`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">📡</span>
                                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tracker Status</h3>
                                        </div>
                                        <span className={`flex items-center gap-1.5 text-[10px] font-bold ${textColor} bg-black/20 border ${isLive ? 'border-emerald-500/20' : isIdle ? 'border-amber-500/20' : 'border-white/6'} px-2.5 py-1 rounded-full`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                            {label}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-600">{sub}</p>
                                    {isOffline && (
                                        <a href="/setup" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition-colors mt-2">
                                            ⚡ Set up tracker →
                                        </a>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Desktop Token */}
                        <div className="glass-card p-5 rounded-2xl border border-violet-500/15 bg-violet-500/3 hover:border-violet-500/25 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-base">🔑</span>
                                <h3 className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Desktop API Token</h3>
                            </div>
                            <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                                Paste this once into the installer dialog — stored locally, never shared.
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex-1 bg-black/50 border border-white/8 rounded-xl px-3 py-2.5 text-xs font-mono text-zinc-300 truncate select-all">
                                    {user?.apiToken ?? "—"}
                                </div>
                                <button
                                    onClick={copyToken}
                                    className={`shrink-0 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${copied
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        : "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_16px_rgba(139,92,246,0.25)] hover:shadow-[0_0_24px_rgba(139,92,246,0.4)]"
                                        }`}
                                >
                                    {copied ? "✓ Copied!" : "Copy"}
                                </button>
                            </div>
                            <p className="text-[10px] text-zinc-700">Used during install.bat setup on your PC</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
