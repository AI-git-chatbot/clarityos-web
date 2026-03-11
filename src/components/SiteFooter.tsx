import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
    return (
        <footer className="border-t border-white/5 bg-black/30 mt-16 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-violet-600/4 blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 pt-14 pb-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="relative h-10 w-[200px] rounded-xl overflow-hidden mb-4">
                            <Image
                                src="/clarityos-logo.png"
                                alt="ClarityOS — AI Work Tracker"
                                fill
                                className="object-contain object-left"
                            />
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mb-4">
                            AI-powered work tracking that runs silently on your desktop. Know exactly where your time goes — every single day.
                        </p>
                        <p className="text-xs text-zinc-600 italic mb-5">
                            "You can't improve what you can't measure."
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
                                Free
                            </span>
                            <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
                                Local AI
                            </span>
                            <span className="text-[10px] font-bold text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
                                Privacy first
                            </span>
                        </div>
                    </div>

                    {/* Product links */}
                    <div>
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em] mb-4">Product</div>
                        <ul className="space-y-2.5">
                            {[
                                { href: "/", label: "Home" },
                                { href: "/setup", label: "Setup Guide" },
                                { href: "/api/download", label: "Download Tracker" },
                                { href: "https://github.com/AI-git-chatbot/clarityos-web", label: "GitHub", external: true },
                                { href: "/privacy", label: "Privacy Policy" },
                            ].map(l => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        target={l.external ? "_blank" : undefined}
                                        rel={l.external ? "noreferrer" : undefined}
                                        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors group"
                                    >
                                        {l.external && (
                                            <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234C5.663 21.23 4.967 19.05 4.967 19.05c-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            </span>
                                        )}
                                        {l.label}
                                        {l.external && (
                                            <span className="text-zinc-700 group-hover:text-zinc-400 transition-colors text-[10px]">↗</span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em] mb-4">Contact</div>
                        <p className="text-sm text-zinc-500 mb-3 leading-relaxed">
                            Bug reports, feature requests, or just to say hi.
                        </p>
                        <a
                            href="mailto:aman@kvantumtech.com"
                            className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium mb-4"
                        >
                            <span>✉</span>
                            aman@kvantumtech.com
                        </a>

                        {/* GitHub CTA */}
                        <a
                            href="https://github.com/AI-git-chatbot/clarityos-web"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 mt-3 text-xs font-semibold text-zinc-400 hover:text-white bg-white/4 hover:bg-white/8 border border-white/6 hover:border-white/12 px-3 py-2 rounded-lg transition-all w-fit"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234C5.663 21.23 4.967 19.05 4.967 19.05c-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                            View on GitHub
                            <span className="text-zinc-700 text-[10px]">↗</span>
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-zinc-600">
                        © 2026 ClarityOS · All rights reserved ·{" "}
                        <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
                            Privacy Policy
                        </Link>
                    </p>
                    <a
                        href="https://kvantumtech.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2.5 group"
                    >
                        <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">Powered by</span>
                        <div className="flex items-center gap-2">
                            {/* Real Kvantum Tech logo */}
                            <div className="w-7 h-7 rounded-md overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                                <Image
                                    src="/kvantum-logo.jpg"
                                    alt="Kvantum Tech"
                                    width={28}
                                    height={28}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">Kvantum Tech</span>
                        </div>
                    </a>
                </div>
            </div>
        </footer>
    );
}
