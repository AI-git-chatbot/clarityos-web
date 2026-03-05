import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export const metadata = {
    title: "How to Set Up — ClarityOS",
    description: "Step-by-step guide to install ClarityOS in under 2 minutes. No coding required.",
};

const STEPS = [
    {
        n: "01",
        icon: "🔐",
        title: "Create your free account",
        color: "border-violet-500/25 bg-violet-500/5",
        badge: "bg-violet-500/20 text-violet-400 border-violet-500/30",
        steps: [
            "Visit clarityos.kvantumtech.com in your browser",
            "Click \"Get Started Free\" — sign in with your Google account",
            "Your personal dashboard is created instantly. No forms, no credit card.",
        ],
    },
    {
        n: "02",
        icon: "🔑",
        title: "Copy your API Token",
        color: "border-blue-500/25 bg-blue-500/5",
        badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        steps: [
            "After signing in, you'll see your Dashboard",
            "Find the \"Desktop API Token\" card in the sidebar on the right",
            "Click Copy — keep it ready for Step 05",
        ],
    },
    {
        n: "03",
        icon: "🐍",
        title: "Install Python (if needed)",
        color: "border-emerald-500/25 bg-emerald-500/5",
        badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        steps: [
            "Python 3.10+ is required. Download it free from python.org",
            "During install, check ✅ \"Add Python to PATH\"",
            "That's it — Python only needs to be installed once",
        ],
    },
    {
        n: "04",
        icon: "🤖",
        title: "Install Ollama (local AI engine)",
        color: "border-amber-500/25 bg-amber-500/5",
        badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        steps: [
            "Download Ollama from ollama.com — it's free and runs entirely on your computer",
            "After installing, open any terminal window (press Windows + R, type cmd, press Enter)",
            "Paste this command to download the AI model (~2GB, only once):",
        ],
        code: "ollama pull llama3.2",
    },
    {
        n: "05",
        icon: "⚡",
        title: "Download & run the installer",
        color: "border-pink-500/25 bg-pink-500/5",
        badge: "bg-pink-500/20 text-pink-400 border-pink-500/30",
        steps: [
            "Click the Download button below to get ClarityOS-Tracker.zip",
            "Extract the zip anywhere on your PC (e.g. Desktop, or C:\\Program Files)",
            "Right-click install.bat → \"Run as administrator\"",
            "A pop-up dialog will appear — paste your API Token from Step 02 and press OK",
            "Done! The tracker starts immediately and auto-starts on every Windows login",
        ],
        highlight: "No code, no terminal, no configuration — just paste your token in the dialog.",
    },
    {
        n: "06",
        icon: "🎉",
        title: "You're done — just work",
        color: "border-indigo-500/25 bg-indigo-500/5",
        badge: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
        steps: [
            "ClarityOS runs silently in the background — no windows, no popups, zero distraction",
            "Every 15 minutes it classifies your session with AI and syncs to your dashboard",
            "ClarityOS auto-starts on every Windows login — no maintenance needed ever",
            "Open your dashboard anytime to see live stats, AI reflections, and task completions",
        ],
    },
];

const FAQ = [
    {
        q: "Do I need to know how to code?",
        a: "Absolutely not. The installer shows a simple dialog box where you paste your API token. That's the only input needed from you.",
    },
    {
        q: "Does the tracker see my passwords or files?",
        a: "No. It only logs the app name and window title of the foreground window. It never reads file contents, clipboard, keystrokes, or browser URLs.",
    },
    {
        q: "Does it work offline?",
        a: "Yes — the tracker stores activity locally. When back online it syncs automatically. Nothing is lost.",
    },
    {
        q: "How much CPU/RAM does it use?",
        a: "Virtually zero when monitoring. The AI classification runs briefly every 15 minutes and takes a few seconds on any modern PC.",
    },
    {
        q: "Can I stop it whenever I want?",
        a: "Yes — run stop.bat to kill the tracker immediately. You can restart anytime by running run_hidden.vbs.",
    },
    {
        q: "How do I update to a newer version?",
        a: "Download the latest tracker zip and run install.bat again in the new folder. Your token and data are preserved.",
    },
];

export default function SetupPage() {
    return (
        <div className="min-h-screen bg-[#080810] text-white">
            {/* Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/8 rounded-full blur-[180px]" />
            </div>

            <SiteNav />

            <main className="max-w-3xl mx-auto px-6 pt-16 pb-20">

                {/* Header */}
                <div className="mb-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                        ⚡ Setup Guide
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
                        Up and running
                        <br />
                        <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                            in under 2 minutes.
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-base leading-relaxed max-w-lg">
                        No coding required. ClarityOS is a web dashboard + a small background app on your PC. Follow these 6 steps once — then forget about it.
                    </p>
                </div>

                {/* Requirements pill bar */}
                <div className="glass-card rounded-2xl p-5 border border-white/6 mb-10">
                    <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em] mb-4">Requirements</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { icon: "🪟", label: "Windows 10 / 11" },
                            { icon: "🐍", label: "Python 3.10+" },
                            { icon: "🤖", label: "Ollama (free)" },
                            { icon: "🌐", label: "Google account" },
                        ].map(r => (
                            <div key={r.label} className="bg-white/4 hover:bg-white/6 transition-colors rounded-xl p-4 text-center border border-white/4">
                                <div className="text-2xl mb-2">{r.icon}</div>
                                <div className="text-xs text-zinc-300 font-medium">{r.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-4 mb-14">
                    {STEPS.map((step, i) => (
                        <div
                            key={step.n}
                            className={`rounded-2xl p-6 border ${step.color} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-xl`}>{step.icon}</span>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${step.badge}`}>
                                    Step {step.n}
                                </span>
                                <h3 className="font-bold text-white text-base">{step.title}</h3>
                            </div>
                            <ul className="space-y-2 mb-3">
                                {step.steps.map((s, j) => (
                                    <li key={j} className="flex items-start gap-2.5 text-sm text-zinc-400">
                                        <span className="text-zinc-600 mt-0.5 shrink-0">▸</span>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                            {step.code && (
                                <div className="bg-black/50 border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3 mt-3">
                                    <code className="flex-1 text-xs text-emerald-400 font-mono">{step.code}</code>
                                    <span className="text-[10px] text-zinc-600 shrink-0">terminal command</span>
                                </div>
                            )}
                            {step.highlight && (
                                <div className="mt-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                                    <p className="text-xs text-zinc-300 font-medium">✨ {step.highlight}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Download CTA */}
                <div className="glass-card rounded-2xl p-8 border border-violet-500/20 bg-violet-500/4 text-center mb-14">
                    <div className="text-4xl mb-3">🚀</div>
                    <h2 className="text-xl font-black text-white mb-2">Ready to install?</h2>
                    <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
                        Sign in first to get your API token, then download the tracker.
                    </p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 bg-white text-zinc-900 font-bold text-sm px-6 py-3 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.98]"
                        >
                            Sign In with Google →
                        </a>
                        <a
                            href="/api/download"
                            className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/12 text-zinc-300 font-semibold text-sm px-6 py-3 rounded-xl border border-white/10 transition-all"
                        >
                            ⬇ Download Tracker
                        </a>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mb-8">
                    <h2 className="text-xs font-bold text-zinc-600 uppercase tracking-[0.15em] mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {FAQ.map((item, i) => (
                            <div key={i} className="glass-card rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                                <h3 className="font-semibold text-sm text-white mb-1.5">{item.q}</h3>
                                <p className="text-xs text-zinc-500 leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
