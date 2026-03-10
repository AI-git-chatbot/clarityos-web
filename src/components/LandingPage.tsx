"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import { useEffect, useRef, useState } from "react";

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
    const [val, setVal] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            obs.disconnect();
            let start = 0;
            const step = Math.ceil(to / 40);
            const id = setInterval(() => {
                start = Math.min(start + step, to);
                setVal(start);
                if (start >= to) clearInterval(id);
            }, 30);
        });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [to]);
    return <span ref={ref}>{val}{suffix}</span>;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
    {
        icon: "🎯",
        title: "Set Your Daily Intention",
        desc: "Start each morning with a task checklist. ClarityOS tracks whether you actually completed them — no more lost to-dos.",
        color: "from-violet-500/20 to-violet-500/0",
        border: "border-violet-500/20",
        glow: "rgba(139,92,246,0.12)"
    },
    {
        icon: "🖥️",
        title: "Silent Background Tracker",
        desc: "A tiny Python process runs invisibly on your PC, logging which apps and windows are in focus — no terminal, no popups.",
        color: "from-blue-500/20 to-blue-500/0",
        border: "border-blue-500/20",
        glow: "rgba(59,130,246,0.12)"
    },
    {
        icon: "🤖",
        title: "Local AI Classification",
        desc: "Every 15 minutes, a local AI (Ollama) reads your activity and labels it: Deep Work, Research, Admin, Communication, and more.",
        color: "from-emerald-500/20 to-emerald-500/0",
        border: "border-emerald-500/20",
        glow: "rgba(52,211,153,0.12)"
    },
    {
        icon: "✅",
        title: "Auto-Complete Tasks",
        desc: "When the tracker detects you've completed something on your list, the task auto-checks itself. No manual logging needed.",
        color: "from-amber-500/20 to-amber-500/0",
        border: "border-amber-500/20",
        glow: "rgba(251,191,36,0.12)"
    },
    {
        icon: "📊",
        title: "Live Dashboard",
        desc: "A beautiful real-time view of your sessions, category breakdown, deep-work minutes, and focus streaks — always up to date.",
        color: "from-indigo-500/20 to-indigo-500/0",
        border: "border-indigo-500/20",
        glow: "rgba(99,102,241,0.12)"
    },
    {
        icon: "📧",
        title: "Daily Email Report",
        desc: "Get an AI-written reflection of your day delivered to your inbox automatically — what you did, how focused you were, what to improve.",
        color: "from-pink-500/20 to-pink-500/0",
        border: "border-pink-500/20",
        glow: "rgba(236,72,153,0.12)"
    },
];

const STEPS = [
    { n: "01", title: "Sign in with Google", desc: "One click. No forms. Your personal dashboard is ready instantly at clarityos.kvantumtech.com.", icon: "🔐" },
    { n: "02", title: "Copy your API token", desc: "Find your unique token in your dashboard sidebar. It links the desktop tracker to your account.", icon: "🔑" },
    { n: "03", title: "Download & run install.bat", desc: "Download the tracker zip, extract it anywhere, and run install.bat as Administrator. A dialog opens for your token — paste and done.", icon: "⚡" },
    { n: "04", title: "Work as normal", desc: "ClarityOS starts immediately and auto-starts on every Windows login. Completely silent — no windows, no interruptions.", icon: "💻" },
    { n: "05", title: "Watch your stats live", desc: "Every 15 minutes, your session is classified by AI and synced to your dashboard. Check in anytime.", icon: "📈" },
];

const TESTIMONIALS = [
    { quote: "I had no idea I was spending 40% of my day in email. ClarityOS showed me in the first week.", name: "Arjun K.", role: "Product Manager" },
    { quote: "The auto-complete on my task list feels like magic. It just knows when I've done something.", name: "Priya S.", role: "Freelance Developer" },
    { quote: "Setup took 3 minutes. Now I get a daily AI summary of what I actually did. Genuinely useful.", name: "Mihail D.", role: "Startup Founder" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#080810]">

            {/* ── Fixed ambient background ── */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-violet-600/10 rounded-full blur-[200px]" />
                <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[160px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-emerald-600/6 rounded-full blur-[140px]" />
                {/* Grid lines */}
                <div className="absolute inset-0 hero-grid opacity-40" />
                {/* Fade out grid at edges */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_60%,#080810_100%)]" />
            </div>

            <SiteNav />

            {/* ════════════════════════════════════════════════
                HERO
            ════════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 pt-28 pb-16 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold px-4 py-2 rounded-full mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                    AI-powered · Runs locally · Privacy first · 100% Free
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.0] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-600">
                    <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Know exactly where
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        your day went.
                    </span>
                </h1>

                <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    ClarityOS silently tracks what you work on, classifies it with local AI, and gives you a live productivity dashboard. Stop guessing and start improving.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <button
                        onClick={() => signIn("google")}
                        className="group relative flex items-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-base px-9 py-4 rounded-2xl transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_60px_rgba(255,255,255,0.15)] cursor-pointer"
                    >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Get Started Free
                        <span className="text-zinc-400 text-xs font-normal">takes 30 sec</span>
                    </button>
                    <Link
                        href="/setup"
                        className="flex items-center gap-2 text-zinc-300 hover:text-white font-semibold text-sm px-7 py-4 rounded-2xl border border-white/10 hover:border-white/20 bg-white/4 hover:bg-white/7 transition-all"
                    >
                        How to Set Up →
                    </Link>
                </div>
                <p className="text-xs text-zinc-600 animate-in fade-in duration-700 delay-300">No credit card · Works on Windows · 100% Free</p>

                {/* Stats strip */}
                <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16 flex-wrap animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300">
                    {[
                        { val: 100, suffix: "%", label: "Free" },
                        { val: 2, suffix: " min", label: "Setup time" },
                        { label: "Local AI", isText: true, text: "🔒" },
                        { label: "Real-time dashboard", isText: true, text: "⚡" },
                    ].map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-2xl sm:text-3xl font-black text-white">
                                {s.isText ? s.text : <Counter to={s.val!} suffix={s.suffix} />}
                            </div>
                            <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════
                DASHBOARD PREVIEW
            ════════════════════════════════════════════════ */}
            <section className="max-w-5xl mx-auto px-6 pb-20">
                <div className="relative rounded-3xl overflow-hidden border border-white/8 shadow-[0_0_120px_rgba(139,92,246,0.15)]">
                    {/* Faux browser bar */}
                    <div className="bg-[#0d0d1a] border-b border-white/5 px-5 py-3 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/70" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                        </div>
                        <div className="flex-1 mx-4 bg-white/4 rounded-md px-3 py-1 text-xs text-zinc-500 font-mono text-center">
                            clarityos.kvantumtech.com
                        </div>
                    </div>
                    {/* Mini dashboard mockup */}
                    <div className="bg-[#080810] p-5 sm:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                            {[
                                { label: "Total Tracked", val: "5h 42m", color: "text-white" },
                                { label: "Focused Work", val: "3h 18m", color: "text-emerald-400" },
                                { label: "Context Switches", val: "14", color: "text-amber-400" },
                            ].map(s => (
                                <div key={s.label} className="glass-card rounded-xl p-4 border border-white/6">
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{s.label}</div>
                                    <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Activity feed preview */}
                            <div className="glass-card rounded-xl border border-white/6 p-4">
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Activity Feed</div>
                                {[
                                    { category: "Deep Work", project: "ClarityOS", time: "2h 10m", color: "bg-emerald-500/15 text-emerald-400" },
                                    { category: "Research", project: "Product Design", time: "45m", color: "bg-indigo-500/15 text-indigo-400" },
                                    { category: "Communication", project: "Client Email", time: "38m", color: "bg-amber-500/15 text-amber-400" },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/4 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>{s.category}</span>
                                            <span className="text-xs text-zinc-300">{s.project}</span>
                                        </div>
                                        <span className="text-xs font-bold text-zinc-400">{s.time}</span>
                                    </div>
                                ))}
                            </div>
                            {/* AI reflection preview */}
                            <div className="glass-card rounded-xl border border-violet-500/20 bg-violet-500/4 p-4">
                                <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">🤖 AI Reflection</div>
                                <p className="text-xs text-zinc-300 leading-relaxed">
                                    "Strong focus session today — over 3 hours of Deep Work. The biggest time sink was context switching between the dashboard build and client emails mid-afternoon. Consider batching communication to two time blocks tomorrow."
                                </p>
                                <div className="mt-3 flex flex-wrap gap-1">
                                    {["Deep Work · 58%", "Research · 13%", "Comms · 11%"].map(t => (
                                        <span key={t} className="text-[10px] bg-white/5 text-zinc-500 px-2 py-0.5 rounded">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#080810] to-transparent pointer-events-none" />
                </div>
                <p className="text-center text-xs text-zinc-600 mt-3">Live dashboard — always up to date</p>
            </section>

            {/* ════════════════════════════════════════════════
                HOW IT WORKS
            ════════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3">How it works</div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white">Up and running in 5 steps</h2>
                    <p className="text-zinc-500 mt-3 text-sm max-w-md mx-auto">No terminal knowledge needed. One dialog, one click, you're done.</p>
                </div>

                <div className="relative max-w-3xl mx-auto">
                    {/* Vertical line */}
                    <div className="absolute left-7 sm:left-[2.15rem] top-8 bottom-8 w-px bg-gradient-to-b from-violet-500/40 via-blue-500/20 to-transparent hidden sm:block" />

                    <div className="space-y-4">
                        {STEPS.map((s, i) => (
                            <div
                                key={s.n}
                                className="flex items-start gap-5 animate-in fade-in slide-in-from-left-4 duration-500"
                                style={{ animationDelay: `${i * 80}ms` }}
                            >
                                {/* Icon bubble */}
                                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/10 border border-white/8 flex flex-col items-center justify-center gap-0.5">
                                    <span className="text-xl">{s.icon}</span>
                                    <span className="text-[9px] font-black text-zinc-500">{s.n}</span>
                                </div>
                                {/* Card */}
                                <div className="flex-1 glass-card rounded-2xl p-5 border border-white/6 hover:border-white/10 transition-colors">
                                    <h3 className="font-bold text-white mb-1">{s.title}</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-10">
                    <Link href="/setup" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors border border-violet-500/20 hover:border-violet-500/40 px-5 py-2.5 rounded-full bg-violet-500/5 hover:bg-violet-500/10">
                        Full setup guide →
                    </Link>
                </div>
            </section>

            {/* ════════════════════════════════════════════════
                FEATURES GRID
            ════════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3">Features</div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white">Everything you need. Nothing you don't.</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FEATURES.map((f, i) => (
                        <div
                            key={f.title}
                            className={`rounded-2xl p-6 bg-gradient-to-br ${f.color} border ${f.border} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-default group`}
                            style={{ animationDelay: `${i * 70}ms`, boxShadow: `0 0 0 0 ${f.glow}` }}
                        >
                            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">{f.icon}</div>
                            <h3 className="font-bold text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════
                TESTIMONIALS
            ════════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3">Early Users</div>
                    <h2 className="text-3xl font-black text-white">People who get their time back</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={i}
                            className="glass-card rounded-2xl p-6 border border-white/6 hover:border-violet-500/20 transition-colors"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="text-violet-400 text-2xl mb-3">"</div>
                            <p className="text-sm text-zinc-300 leading-relaxed mb-4 italic">"{t.quote}"</p>
                            <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-black text-white">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white">{t.name}</div>
                                    <div className="text-[10px] text-zinc-500">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════
                FINAL CTA
            ════════════════════════════════════════════════ */}
            <section className="max-w-2xl mx-auto px-6 py-24 text-center">
                <div className="relative">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-emerald-600/10 rounded-3xl blur-xl" />
                    <div className="glass-card rounded-3xl p-10 border border-white/6">
                        <div className="text-5xl mb-4">🚀</div>
                        <h2 className="text-4xl font-black tracking-tight text-white mb-3">
                            Start tracking today.
                        </h2>
                        <p className="text-zinc-500 mb-8 text-sm leading-relaxed max-w-sm mx-auto">
                            Free forever. Set up in under 2 minutes. Know exactly where your time is going — starting today.
                        </p>
                        <button
                            onClick={() => signIn("google")}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-base px-10 py-4 rounded-2xl transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_60px_rgba(139,92,246,0.4)] cursor-pointer mb-3"
                        >
                            Get Started Free →
                        </button>
                        <p className="text-xs text-zinc-600">Google sign-in · No credit card · Windows 10/11</p>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
