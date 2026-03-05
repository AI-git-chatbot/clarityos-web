"use client";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function SiteNav() {
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        { href: "/setup", label: "How to Setup" },
        { href: "/download", label: "Download" },
    ];

    return (
        <nav className="border-b border-white/5 bg-black/50 backdrop-blur-2xl sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group shrink-0">
                    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.45)] group-hover:shadow-[0_0_36px_rgba(139,92,246,0.65)] transition-all duration-300">
                        {/* Subtle inner glow ring */}
                        <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
                        <span className="text-sm font-black text-white z-10">C</span>
                    </div>
                    <div className="leading-none">
                        <div className="font-black text-[15px] tracking-tight text-white">ClarityOS</div>
                        <div className="text-[9px] text-zinc-500 tracking-[0.15em] uppercase font-semibold mt-0.5">AI Work Tracker</div>
                    </div>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-1">
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3.5 py-2 rounded-lg hover:bg-white/6"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right side CTA */}
                <div className="flex items-center gap-3">
                    {session ? (
                        <Link
                            href="/"
                            className="text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 px-4 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                        >
                            Dashboard →
                        </Link>
                    ) : (
                        <button
                            onClick={() => signIn("google")}
                            className="text-xs font-semibold text-white bg-white/8 hover:bg-white/14 transition-all px-4 py-2 rounded-full border border-white/10 hover:border-white/20 cursor-pointer"
                        >
                            Sign in →
                        </button>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(o => !o)}
                        className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-4 h-0.5 bg-zinc-400 transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`block w-4 h-0.5 bg-zinc-400 transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
                        <span className={`block w-4 h-0.5 bg-zinc-400 transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-white/5 bg-black/60 backdrop-blur-xl px-6 py-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block text-sm text-zinc-300 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors font-medium"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
