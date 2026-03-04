import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export const metadata = {
    title: "How to Set Up — ClarityOS",
    description: "Step-by-step guide to install and use ClarityOS, the AI-powered work tracker.",
};

const STEPS = [
    {
        n: "01",
        title: "Create your account",
        color: "border-violet-500/30 bg-violet-500/5",
        badge: "bg-violet-500/20 text-violet-400",
        steps: [
            "Visit clarityos.kvantumtech.com in your browser",
            'Click "Get Started Free" — sign in with your Google account',
            "Your dashboard is created instantly. No forms, no credit card.",
        ],
    },
    {
        n: "02",
        title: "Copy your API Token",
        color: "border-blue-500/30 bg-blue-500/5",
        badge: "bg-blue-500/20 text-blue-400",
        steps: [
            "After signing in, go to your Dashboard",
            "Find the API Token section in the sidebar — click to copy it",
            "Keep it handy — you'll paste it into the installer in Step 05",
        ],
    },
    {
        n: "03",
        title: "Install Python (if needed)",
        color: "border-emerald-500/30 bg-emerald-500/5",
        badge: "bg-emerald-500/20 text-emerald-400",
        steps: [
            "Python 3.10 or newer is required. Download from python.org if not installed.",
            "During install, check ✅ Add Python to PATH",
            'Open a terminal and verify: type "python --version"',
        ],
    },
    {
        n: "04",
        title: "Install Ollama (local AI)",
        color: "border-amber-500/30 bg-amber-500/5",
        badge: "bg-amber-500/20 text-amber-400",
        steps: [
            "Download Ollama from ollama.com — it's free and runs entirely on your machine",
            "After install, open any terminal and run:",
            "This downloads the ~2GB AI model (only needs to happen once)",
        ],
        code: "ollama pull llama3.2",
    },
    {
        n: "05",
        title: "Download & install the tracker",
        color: "border-pink-500/30 bg-pink-500/5",
        badge: "bg-pink-500/20 text-pink-400",
        steps: [
            "Click the Download button below to get ClarityOS-Tracker.zip",
            "Extract the zip anywhere on your PC (e.g. Desktop or C:\\Program Files)",
            'Right-click "install.bat" → "Run as administrator"',
            "Paste your API Token from Step 02 when prompted — done!",
        ],
    },
    {
        n: "06",
        title: "Work as normal — you're done",
        color: "border-indigo-500/30 bg-indigo-500/5",
        badge: "bg-indigo-500/20 text-indigo-400",
        steps: [
            "The tracker runs silently in the background. No windows, no popups.",
            "Every 15 minutes, it classifies your activity with AI and syncs to your dashboard",
            "ClarityOS auto-starts every time you log in to Windows — no maintenance needed",
            "Open your dashboard anytime to see live stats and AI summaries",
        ],
    },
];

const FAQ = [
    {
        q: "Does the tracker see my passwords or private data?",
        a: "No. It only logs the app name and window title of whatever is in the foreground. It never reads file contents, clipboard, or keystrokes.",
    },
    {
        q: "Does it work when I'm offline?",
        a: "Yes — the tracker stores activity locally. When you're back online it syncs to the dashboard automatically.",
    },
    {
        q: "What happens if I close the tracker terminal?",
        a: "Tracking stops. Rerun the command to restart it. For automatic startup use the install.bat from the GitHub repo.",
    },
    {
        q: "How much CPU/RAM does it use?",
        a: "Practically zero when tracking. The AI classification runs every 15 minutes and takes a few seconds on any modern PC.",
    },
    {
        q: "Can multiple people use the same account?",
        a: "No — each person should sign in with their own Google account. Each account gets its own separate dashboard and tracking.",
    },
];

export default function SetupPage() {
    return (
        <div className="min-h-screen bg-[#080810] text-white">
            <SiteNav />

            <main className="max-w-3xl mx-auto px-6 pt-16 pb-8">
                {/* Header */}
                <div className="mb-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                        Setup Guide
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
                        Up and running<br />
                        <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">in under 2 minutes.</span>
                    </h1>
                    <p className="text-zinc-400 text-base leading-relaxed max-w-xl">
                        ClarityOS is a web dashboard + a lightweight Python file on your desktop. Follow these 6 steps to get started.
                    </p>
                </div>

                {/* Requirements */}
                <div className="glass-card rounded-2xl p-5 border border-white/6 mb-10">
                    <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Requirements</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { icon: "🪟", label: "Windows 10 / 11" },
                            { icon: "🐍", label: "Python 3.9+" },
                            { icon: "🤖", label: "Ollama (free)" },
                            { icon: "🌐", label: "Google account" },
                        ].map(r => (
                            <div key={r.label} className="bg-white/4 rounded-xl p-3 text-center">
                                <div className="text-2xl mb-1">{r.icon}</div>
                                <div className="text-xs text-zinc-300 font-medium">{r.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-5 mb-14">
                    {STEPS.map((step, i) => (
                        <div
                            key={step.n}
                            className={`rounded-2xl p-6 border ${step.color} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${step.badge}`}>
                                    Step {step.n}
                                </span>
                                <h3 className="font-bold text-white text-base">{step.title}</h3>
                            </div>
                            <ul className="space-y-2 mb-3">
                                {step.steps.filter(s => s !== step.code).map((s, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm text-zinc-400">
                                        <span className="text-zinc-600 mt-0.5">•</span>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                            {step.code && (
                                <div className="bg-black/50 border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3">
                                    <code className="flex-1 text-xs text-emerald-400 font-mono">{step.code}</code>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Download CTA */}
                <div className="glass-card rounded-2xl p-8 border border-violet-500/20 bg-violet-500/4 text-center mb-14">
                    <div className="text-4xl mb-3">🚀</div>
                    <h2 className="text-xl font-black text-white mb-2">Ready to start?</h2>
                    <p className="text-zinc-500 text-sm mb-5">Sign in first, then download the tracker from your dashboard.</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 bg-white text-zinc-900 font-bold text-sm px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
                        >
                            Sign In with Google →
                        </a>
                        <Link
                            href="/download"
                            className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/12 text-zinc-300 font-semibold text-sm px-6 py-3 rounded-xl border border-white/10 transition-all"
                        >
                            Download tracker.py
                        </Link>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mb-8">
                    <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">FAQ</h2>
                    <div className="space-y-3">
                        {FAQ.map((item, i) => (
                            <div key={i} className="glass-card rounded-xl p-5 border border-white/5">
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
