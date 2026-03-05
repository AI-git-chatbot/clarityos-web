import Link from "next/link";

export default function SiteFooter() {
    return (
        <footer className="border-t border-white/5 bg-black/30 mt-16">
            <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.35)]">
                                <span className="text-sm font-black text-white">C</span>
                            </div>
                            <span className="font-black text-white text-base">ClarityOS</span>
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mb-5">
                            AI-powered work tracking that runs silently on your desktop. Know exactly where your time goes — every single day.
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
                                Free forever
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
                                { href: "/download", label: "Download Tracker" },
                            ].map(l => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                                        {l.label}
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
                            className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
                        >
                            <span>✉</span>
                            aman@kvantumtech.com
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-zinc-600">
                        © 2026 ClarityOS. Built with ❤️ — Privacy first, AI powered.
                    </p>
                    <a
                        href="https://kvantumtech.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 group"
                    >
                        <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">Powered by</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                                <span className="text-[9px] font-black text-white">K</span>
                            </div>
                            <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">Kvantum Tech</span>
                        </div>
                    </a>
                </div>
            </div>
        </footer>
    );
}
