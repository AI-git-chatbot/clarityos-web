"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

const FEATURES = [
    { icon: "🎯", title: "Set Your Intention", desc: "Start each day by building a task checklist. ClarityOS tracks whether you actually did them.", color: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/20" },
    { icon: "🖥️", title: "Silent Background Tracker", desc: "A lightweight Python script runs on your desktop, invisibly logging which apps and tasks you work on.", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20" },
    { icon: "🤖", title: "AI-Powered Classification", desc: "Local AI (Ollama) reads your activity and classifies sessions into Deep Work, Research, Admin, and more.", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20" },
    { icon: "✅", title: "Auto-Complete Tasks", desc: "When your tracker detects you've done something on your list, the task gets checked off automatically.", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20" },
    { icon: "📊", title: "Live Dashboard", desc: "See your real-time activity feed, category breakdown, and focused work time — all in one beautiful view.", color: "from-indigo-500/20 to-indigo-500/5", border: "border-indigo-500/20" },
    { icon: "📧", title: "Daily Email Report", desc: "Get an AI-written summary of your day emailed to you automatically at the end of every session.", color: "from-pink-500/20 to-pink-500/5", border: "border-pink-500/20" },
];

const STEPS = [
    { n: "01", title: "Sign in with Google", desc: "One click. No form. Your dashboard is ready instantly at clarityos.kvantumtech.com." },
    { n: "02", title: "Copy your API token", desc: "Find it in your dashboard sidebar. You'll need it in the next step." },
    { n: "03", title: "Download & install", desc: "Download the tracker zip, extract it, and right-click install.bat → Run as administrator. Paste your token when prompted." },
    { n: "04", title: "Work as normal", desc: "The tracker starts immediately and auto-starts on every login — completely silent, no terminal window." },
    { n: "05", title: "Check your progress", desc: "Every 15 min, AI classifies your sessions. Watch live stats update on your dashboard." },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-violet-600/12 rounded-full blur-[180px]" />
                <div className="absolute bottom-1/3 right-0 w-[600px] h-[500px] bg-blue-600/8 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[120px]" />
            </div>

            <SiteNav />

            {/* ── Hero ── */}
            <section className="max-w-6xl mx-auto px-6 pt-28 pb-24 text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold px-4 py-2 rounded-full mb-8">
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                    AI-powered · Runs locally · Privacy first · 100% Free
                </div>

                {/* Headline */}
                <h1 className="text-6xl sm:text-8xl font-black tracking-tight leading-[1.0] mb-8">
                    <span className="bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
                        Know exactly where
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        your day went.
                    </span>
                </h1>

                <p className="text-xl sm:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
                    ClarityOS silently tracks what you work on, classifies it with AI, and gives you a live productivity dashboard — so you never wonder where your time went.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <button
                        onClick={() => signIn("google")}
                        className="flex items-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-lg px-10 py-5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)] cursor-pointer"
                    >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Get Started Free
                    </button>
                    <Link
                        href="/setup"
                        className="flex items-center gap-2 text-zinc-300 hover:text-white font-semibold text-base px-8 py-5 rounded-2xl border border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/6 transition-all"
                    >
                        How to Set Up →
                    </Link>
                </div>
                <p className="text-xs text-zinc-600">No credit card. Sign in in 5 seconds. Works on Windows.</p>

                {/* Stats */}
                <div className="flex items-center justify-center gap-10 mt-16 flex-wrap">
                    {[
                        { val: "100%", label: "Free" },
                        { val: "< 2 min", label: "Setup time" },
                        { val: "Local AI", label: "Privacy first" },
                        { val: "Real-time", label: "Dashboard" },
                    ].map(s => (
                        <div key={s.label} className="text-center">
                            <div className="text-2xl font-black text-white">{s.val}</div>
                            <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">How it works</h2>
                    <p className="text-2xl font-black text-white">Up and running in 5 steps</p>
                </div>
                <div className="relative">
                    <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-white/5" />
                    <div className="space-y-6">
                        {STEPS.map((s, i) => (
                            <div key={s.n} className={`flex items-start gap-6 md:gap-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} animate-in fade-in slide-in-from-bottom-4 duration-500`} style={{ animationDelay: `${i * 100}ms` }}>
                                <div className={`flex-1 glass-card rounded-2xl p-6 border border-white/6 hover:border-white/10 transition-colors ${i % 2 !== 0 ? "md:text-right" : ""}`}>
                                    <div className="text-5xl font-black text-white/6 mb-2">{s.n}</div>
                                    <h3 className="font-bold text-white text-lg mb-1">{s.title}</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
                                </div>
                                <div className="md:w-6 shrink-0 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-violet-500 ring-4 ring-violet-500/20 hidden md:block" />
                                </div>
                                <div className="flex-1 hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-center mt-10">
                    <Link href="/setup" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors">
                        Full setup guide →
                    </Link>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Features</h2>
                    <p className="text-2xl font-black text-white">Everything you need. Nothing you don't.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FEATURES.map((f, i) => (
                        <div key={f.title} className={`rounded-2xl p-6 bg-gradient-to-br ${f.color} border ${f.border} hover:scale-[1.02] transition-transform duration-200`} style={{ animationDelay: `${i * 80}ms` }}>
                            <div className="text-3xl mb-3">{f.icon}</div>
                            <h3 className="font-bold text-white mb-1.5">{f.title}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="max-w-2xl mx-auto px-6 py-20 text-center">
                <h2 className="text-5xl font-black tracking-tight text-white mb-4">
                    Start tracking.<br />
                    <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Stop guessing.</span>
                </h2>
                <p className="text-zinc-500 mb-8 text-base">Free forever. Set up in under 2 minutes.</p>
                <button
                    onClick={() => signIn("google")}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(139,92,246,0.35)] cursor-pointer"
                >
                    Get Started — It's Free →
                </button>
            </section>

            <SiteFooter />
        </div>
    );
}
