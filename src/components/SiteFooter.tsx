import Link from "next/link";

export default function SiteFooter() {
    return (
        <footer className="border-t border-white/5 bg-black/20 mt-16">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                                <span className="text-xs font-black text-white">C</span>
                            </div>
                            <span className="font-black text-white">ClarityOS</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
                            AI-powered work tracker that runs on your desktop, silently logging what you actually do each day.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Product</div>
                        <ul className="space-y-2">
                            {[
                                { href: "/", label: "Home" },
                                { href: "/setup", label: "How to Setup" },
                                { href: "/download", label: "Download Tracker" },
                            ].map(l => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-xs text-zinc-500 hover:text-white transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Get in Touch</div>
                        <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
                            Have a suggestion, bug report, or feature request?
                        </p>
                        <a
                            href="mailto:aman@kvantumtech.com"
                            className="inline-flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
                        >
                            <span>✉</span>
                            aman@kvantumtech.com
                        </a>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-zinc-600">
                        © 2026 ClarityOS. Privacy first, AI powered.
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
