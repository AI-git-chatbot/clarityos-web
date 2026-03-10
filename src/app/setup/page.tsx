import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export const metadata = {
    title: "How to Set Up — ClarityOS",
    description: "Set up ClarityOS in under 2 minutes. No coding required. Download, run, paste token — done.",
};

const STEPS = [
    {
        n: "01",
        icon: "🔐",
        title: "Create your free account",
        color: "from-violet-500/15 to-violet-500/0",
        border: "border-violet-500/20",
        accent: "text-violet-400",
        accentBg: "bg-violet-500/12 border-violet-500/25",
        dot: "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]",
        steps: [
            "Go to clarityos.kvantumtech.com in your browser",
            "Click \"Get Started Free\" and sign in with Google",
            "Your dashboard is ready instantly — no forms, no credit card",
        ],
        tip: null,
    },
    {
        n: "02",
        icon: "🔑",
        title: "Copy your API Token",
        color: "from-blue-500/15 to-blue-500/0",
        border: "border-blue-500/20",
        accent: "text-blue-400",
        accentBg: "bg-blue-500/12 border-blue-500/25",
        dot: "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]",
        steps: [
            "After signing in, your Dashboard opens",
            "On the right sidebar, find the \"Desktop API Token\" card",
            "Click Copy — you'll paste it in the dialog box in Step 05",
        ],
        tip: "Keep this tab open — you'll need the token in Step 05.",
    },
    {
        n: "03",
        icon: "🐍",
        title: "Install Python",
        color: "from-emerald-500/15 to-emerald-500/0",
        border: "border-emerald-500/20",
        accent: "text-emerald-400",
        accentBg: "bg-emerald-500/12 border-emerald-500/25",
        dot: "bg-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.6)]",
        steps: [
            "Download Python 3.10+ from python.org (it's free)",
            "During install, check ✅ \"Add Python to PATH\"",
            "Only needs to be installed once — skip if already installed",
        ],
        tip: null,
    },
    {
        n: "04",
        icon: "🤖",
        title: "Install Ollama (local AI engine)",
        color: "from-amber-500/15 to-amber-500/0",
        border: "border-amber-500/20",
        accent: "text-amber-400",
        accentBg: "bg-amber-500/12 border-amber-500/25",
        dot: "bg-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.6)]",
        steps: [
            "Download Ollama from ollama.com — free, runs entirely on your machine",
            "After installing, open a terminal (press Win + R, type cmd, press Enter)",
            "Run the command below to download the AI model (~2 GB, one time only):",
        ],
        code: "ollama pull llama3.2",
        tip: "The AI runs 100% locally. Your activity data never leaves your computer.",
    },
    {
        n: "05",
        icon: "⚡",
        title: "Download and run the installer",
        color: "from-pink-500/15 to-pink-500/0",
        border: "border-pink-500/20",
        accent: "text-pink-400",
        accentBg: "bg-pink-500/12 border-pink-500/25",
        dot: "bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.6)]",
        steps: [
            "Click Download below to get ClarityOS-Tracker.zip",
            "Extract the zip anywhere on your PC (Desktop works fine)",
            "Right-click install.bat → \"Run as Administrator\"",
            "A dialog box pops up — paste your API Token from Step 02 and click OK",
            "Done! The tracker starts immediately",
        ],
        highlight: "No coding, no terminal, no configuration — just paste your token in the dialog.",
        tip: null,
    },
    {
        n: "06",
        icon: "🎉",
        title: "You're done — just work",
        color: "from-indigo-500/15 to-indigo-500/0",
        border: "border-indigo-500/20",
        accent: "text-indigo-400",
        accentBg: "bg-indigo-500/12 border-indigo-500/25",
        dot: "bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]",
        steps: [
            "ClarityOS runs silently — no windows, no popups, zero distraction",
            "Every 15 minutes it classifies your session with AI and syncs to your dashboard",
            "It auto-starts on every Windows login — no maintenance needed",
            "Open your dashboard anytime to see live stats, AI reflections, and task completions",
        ],
        tip: null,
    },
];

const FAQ = [
    {
        q: "Do I need to know how to code?",
        a: "Absolutely not. The installer shows a simple dialog box where you paste your API token. That's the only input required.",
        icon: "💻",
    },
    {
        q: "Does the tracker see my passwords or files?",
        a: "No. It only logs the foreground app name and window title. It never reads file contents, clipboard, keystrokes, or browser URLs.",
        icon: "🔒",
    },
    {
        q: "Does it work offline?",
        a: "Yes — the tracker stores activity locally. When back online it syncs automatically. Nothing is ever lost.",
        icon: "📡",
    },
    {
        q: "How much CPU and RAM does it use?",
        a: "Virtually zero when monitoring. The AI classification runs briefly every 15 minutes and takes a few seconds on any modern PC.",
        icon: "⚙️",
    },
    {
        q: "Can I stop it whenever I want?",
        a: "Yes — run stop.bat to kill the tracker immediately. You can restart anytime by running run_hidden.vbs.",
        icon: "🛑",
    },
    {
        q: "How do I update to a newer version?",
        a: "Download the latest tracker zip and run install.bat again in the new folder. Your token and data are preserved.",
        icon: "🔄",
    },
];

export default function SetupPage() {
    return (
        <div className="min-h-screen bg-[#080810] text-white">
            {/* Fixed ambient background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-600/8 rounded-full blur-[160px]" />
                <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />
            </div>

            <SiteNav />

            <main className="max-w-3xl mx-auto px-6 pt-16 pb-24">

                {/* ── Header ── */}
                <div className="mb-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                        Setup Guide · 6 steps · Under 2 minutes
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.05]">
                        Up and running{" "}
                        <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            in under 2 minutes.
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-base leading-relaxed max-w-xl">
                        No coding required. ClarityOS is a web dashboard plus a tiny silent app on your PC. Follow the steps below once — then forget about it forever.
                    </p>
                </div>

                {/* ── Requirements bar ── */}
                <div className="glass-card rounded-2xl p-5 border border-white/6 mb-10 hover:border-white/10 transition-colors animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em] mb-4">What you'll need</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { icon: "🪟", label: "Windows 10 / 11", sub: "Required" },
                            { icon: "🐍", label: "Python 3.10+", sub: "Free at python.org" },
                            { icon: "🤖", label: "Ollama", sub: "Free at ollama.com" },
                            { icon: "🌐", label: "Google account", sub: "For sign-in" },
                        ].map(r => (
                            <div key={r.label} className="bg-white/3 hover:bg-white/6 transition-colors rounded-xl p-4 text-center border border-white/5 hover:border-white/10 group">
                                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">{r.icon}</div>
                                <div className="text-xs text-zinc-200 font-semibold mb-0.5">{r.label}</div>
                                <div className="text-[10px] text-zinc-600">{r.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Steps — timeline layout ── */}
                <div className="relative space-y-0 mb-14">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[19px] top-8 bottom-8 w-px bg-gradient-to-b from-violet-500/40 via-blue-500/20 via-emerald-500/15 to-transparent hidden sm:block" />

                    {STEPS.map((step, i) => (
                        <div
                            key={step.n}
                            className="flex gap-5 pb-4 animate-in fade-in slide-in-from-left-4 duration-500"
                            style={{ animationDelay: `${i * 70}ms` }}
                        >
                            {/* Timeline dot */}
                            <div className="hidden sm:flex flex-col items-center shrink-0">
                                <div className={`w-10 h-10 rounded-full ${step.dot} flex items-center justify-center text-white font-black text-xs z-10 relative border-2 border-[#080810]`}>
                                    {step.n}
                                </div>
                            </div>

                            {/* Card */}
                            <div className={`flex-1 rounded-2xl p-6 bg-gradient-to-br ${step.color} border ${step.border} hover:shadow-lg transition-all duration-300 hover:scale-[1.005] mb-2`}>
                                {/* Step header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{step.icon}</span>
                                    <div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${step.accent} sm:hidden`}>Step {step.n} · </span>
                                        <span className="font-bold text-white text-base">{step.title}</span>
                                    </div>
                                </div>

                                {/* Sub-steps */}
                                <ul className="space-y-2.5 mb-3">
                                    {step.steps.map((s, j) => (
                                        <li key={j} className="flex items-start gap-3 text-sm text-zinc-400 leading-relaxed">
                                            <span className={`shrink-0 mt-0.5 w-4 h-4 rounded-full ${step.accentBg} border flex items-center justify-center text-[9px] font-black ${step.accent}`}>
                                                {j + 1}
                                            </span>
                                            {s}
                                        </li>
                                    ))}
                                </ul>

                                {/* Code block */}
                                {step.code && (
                                    <div className="bg-black/60 border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3 mt-3">
                                        <code className="flex-1 text-sm text-emerald-400 font-mono tracking-wide">{step.code}</code>
                                        <span className="text-[10px] text-zinc-600 shrink-0 font-mono">terminal</span>
                                    </div>
                                )}

                                {/* Highlight pill */}
                                {step.highlight && (
                                    <div className={`mt-4 ${step.accentBg} border rounded-xl px-4 py-3`}>
                                        <p className={`text-xs font-semibold ${step.accent}`}>✨ {step.highlight}</p>
                                    </div>
                                )}

                                {/* Tip */}
                                {step.tip && (
                                    <div className="mt-3 bg-white/3 border border-white/6 rounded-xl px-4 py-3">
                                        <p className="text-xs text-zinc-500 leading-relaxed">
                                            <span className="text-zinc-400 font-semibold">Tip:</span> {step.tip}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Download CTA ── */}
                <div className="relative glass-card rounded-2xl p-8 border border-violet-500/20 bg-gradient-to-br from-violet-500/8 to-blue-500/4 text-center mb-14 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(139,92,246,0.08),transparent)]" />
                    </div>
                    <div className="text-5xl mb-4">🚀</div>
                    <h2 className="text-2xl font-black text-white mb-2">Ready to install?</h2>
                    <p className="text-zinc-500 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
                        Sign in first to get your API token, then download the tracker. Setup takes under 2 minutes.
                    </p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm px-7 py-3.5 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.12)]"
                        >
                            Sign In with Google →
                        </Link>
                        <a
                            href="/api/download"
                            className="inline-flex items-center gap-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 hover:text-violet-200 font-semibold text-sm px-7 py-3.5 rounded-xl border border-violet-500/30 hover:border-violet-500/50 transition-all"
                        >
                            ⬇ Download Tracker
                        </a>
                    </div>
                    <p className="text-zinc-700 text-xs mt-5">ClarityOS-Tracker.zip · Windows 10/11 · Requires Python 3.10+</p>
                </div>

                {/* ── FAQ ── */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="text-xs font-bold text-zinc-600 uppercase tracking-[0.15em]">Frequently Asked Questions</div>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {FAQ.map((item, i) => (
                            <div
                                key={i}
                                className="glass-card rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all hover:shadow-md group animate-in fade-in slide-in-from-bottom-2 duration-500"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-lg shrink-0 group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                                    <div>
                                        <h3 className="font-semibold text-sm text-white mb-1.5">{item.q}</h3>
                                        <p className="text-xs text-zinc-500 leading-relaxed">{item.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            <SiteFooter />
        </div>
    );
}
