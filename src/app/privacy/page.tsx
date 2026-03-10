import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export const metadata = {
    title: "Privacy Policy — ClarityOS",
    description: "ClarityOS privacy policy. Your data stays on your machine — we only sync classified session summaries.",
};

export default function PrivacyPage() {
    const sections = [
        {
            title: "What We Collect",
            body: "ClarityOS only syncs classified session summaries to our servers — these include the activity category (e.g. \"Deep Work\"), project name, duration, and an AI-generated context summary. We never collect raw keystrokes, clipboard contents, file names, or window content.",
        },
        {
            title: "What Stays on Your Machine",
            body: "Raw activity data (exact app names and window titles) is processed entirely locally using Ollama. This data never leaves your PC. Only the classified summary is transmitted to our API.",
        },
        {
            title: "Authentication",
            body: "We use Google OAuth (via NextAuth.js) for authentication. We store your name, email, and profile image from Google, used only to identify your account. We do not share this with any third parties.",
        },
        {
            title: "Data Storage",
            body: "Session summaries and checklist data are stored in a PostgreSQL database hosted on Neon.tech. We do not sell, rent, or share your data with any third parties.",
        },
        {
            title: "How Long We Keep Your Data",
            body: "Your data is kept as long as you maintain an active account. You can request deletion of all your data at any time by emailing aman@kvantumtech.com.",
        },
        {
            title: "Third-Party Services",
            body: "We use: Google OAuth (authentication), Neon.tech (database hosting), Vercel (web hosting), and Ollama (local AI — runs on your machine). None of these services receive your raw activity data.",
        },
        {
            title: "Your Rights",
            body: "You can request a copy of all data we hold about you, or request complete deletion, at any time. Email aman@kvantumtech.com with the subject \"Data Request\".",
        },
    ];

    return (
        <div className="min-h-screen bg-[#080810]">
            <SiteNav />
            <main className="max-w-3xl mx-auto px-6 py-20">
                <div className="mb-12">
                    <div className="text-xs font-bold text-zinc-600 uppercase tracking-[0.18em] mb-3">Legal</div>
                    <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                        ClarityOS is built on a simple principle: <strong className="text-zinc-300">your raw data never leaves your machine.</strong> Here's exactly what we do and don't collect.
                    </p>
                    <p className="text-zinc-700 text-xs mt-3">Last updated: March 2026</p>
                </div>

                <div className="space-y-6">
                    {sections.map((s, i) => (
                        <div key={i} className="glass-card rounded-2xl p-6 border border-white/6 hover:border-white/10 transition-colors">
                            <h2 className="font-bold text-white mb-2">{s.title}</h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">{s.body}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 glass-card rounded-2xl p-6 border border-violet-500/20 bg-violet-500/4 text-center">
                    <p className="text-sm text-zinc-400 mb-3">Questions about your privacy?</p>
                    <a
                        href="mailto:aman@kvantumtech.com"
                        className="inline-flex items-center gap-2 text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors"
                    >
                        ✉ aman@kvantumtech.com
                    </a>
                </div>

                <div className="text-center mt-8">
                    <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">← Back to Home</Link>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
