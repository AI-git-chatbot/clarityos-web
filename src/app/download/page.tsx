"use client";
import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

const STEPS = [
    { n: "1", title: "Sign in with Google", done: true, desc: "You're already here ✓" },
    { n: "2", title: "Copy your API token", done: false, desc: "From the dashboard sidebar — click Copy next to your token." },
    { n: "3", title: "Install Python 3.10+", done: false, desc: 'Download from python.org. During install, check "Add Python to PATH".' },
    { n: "4", title: "Download the tracker", done: false, desc: "Click download below — you'll get a zip with the tracker and auto-installer." },
    { n: "5", title: "Run install.bat as Admin", done: false, desc: 'Right-click "install.bat" → "Run as Administrator". Paste your token when asked.' },
];

export default function DownloadPage() {
    const [copiedToken, setCopiedToken] = useState(false);

    return (
        <div className="min-h-screen bg-[#080810] text-white flex flex-col">
            {/* Nav */}
            <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-3">
                    <a href="/" className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                            <span className="text-[10px] font-black text-white">C</span>
                        </div>
                        <span className="font-bold text-sm">ClarityOS</span>
                    </a>
                    <span className="text-zinc-700">/</span>
                    <span className="text-sm text-zinc-400">Download</span>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto px-6 pt-16 pb-24 flex-1">

                {/* Header */}
                <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                        Windows Tracker
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Get the Desktop Tracker</h1>
                    <p className="text-zinc-400">
                        Runs silently in the background. Auto-starts on login. Zero maintenance.
                    </p>
                </div>

                {/* Requirements */}
                <div className="glass-card rounded-2xl p-5 border border-white/6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: "100ms" }}>
                    <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Requirements</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: "🪟", label: "Windows 10/11" },
                            { icon: "🐍", label: "Python 3.10+" },
                            { icon: "🤖", label: "Ollama (local AI)" },
                        ].map(r => (
                            <div key={r.label} className="bg-white/4 rounded-xl p-3 text-center">
                                <div className="text-2xl mb-1">{r.icon}</div>
                                <div className="text-xs text-zinc-300 font-medium">{r.label}</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-zinc-600 mt-3">
                        Don&apos;t have Ollama?{" "}
                        <a href="https://ollama.com" target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">
                            Download from ollama.com
                        </a>
                        {" "}then run: <code className="bg-black/40 px-1.5 rounded text-zinc-300">ollama pull llama3.2</code>
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-3 mb-8">
                    {STEPS.map((step, i) => (
                        <div
                            key={step.n}
                            className="glass-card rounded-xl p-4 border border-white/6 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500"
                            style={{ animationDelay: `${i * 80 + 150}ms` }}
                        >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${step.done ? "bg-emerald-500/20 text-emerald-400" : "bg-white/8 text-zinc-400"
                                }`}>
                                {step.done ? "✓" : step.n}
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-white mb-0.5">{step.title}</div>
                                <div className="text-xs text-zinc-500">{step.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Download Button */}
                <div className="glass-card rounded-2xl p-6 border border-violet-500/20 bg-violet-500/4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: "600ms" }}>
                    <h2 className="text-sm font-bold text-white mb-1">Download ClarityOS Tracker</h2>
                    <p className="text-xs text-zinc-500 mb-4">Includes tracker + install.bat auto-installer · Windows only</p>
                    <a
                        href="/api/download"
                        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-95"
                    >
                        ⬇ Download ClarityOS-Tracker.zip
                    </a>
                    <p className="text-xs text-zinc-600 mt-3">
                        Includes tracker, installer, and all required files ·{" "}
                        <Link href="/setup" className="text-violet-400 hover:underline">Setup Guide →</Link>
                    </p>
                </div>

                {/* What happens after */}
                <div className="glass-card rounded-2xl p-5 border border-white/6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: "700ms" }}>
                    <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">After installing</h2>
                    <ul className="space-y-2">
                        {[
                            "✓ Tracker starts immediately — no reboot needed",
                            "✓ Auto-starts silently every time you log in",
                            "✓ AI classifies your work every 15 minutes",
                            "✓ Live stats appear on your dashboard",
                        ].map(t => (
                            <li key={t} className="text-xs text-zinc-400">{t}</li>
                        ))}
                    </ul>
                    <p className="text-xs text-zinc-600 mt-4">
                        To stop: run <code className="bg-black/40 px-1 rounded text-zinc-400">stop.bat</code> — included in the download.
                    </p>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
