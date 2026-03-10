"use client";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

// ── ClarityOS SVG Logo Mark ────────────────────────────────────────────────────
function LogoMark({ size = 36 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logo-bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7C3AED" />
                    <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="logo-ring" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="rgba(255,255,255,0.35)" />
                    <stop offset="1" stopColor="rgba(255,255,255,0.05)" />
                </linearGradient>
            </defs>
            {/* Background rounded square */}
            <rect width="36" height="36" rx="10" fill="url(#logo-bg)" />
            {/* Inner highlight ring */}
            <rect x="0.75" y="0.75" width="34.5" height="34.5" rx="9.25" stroke="url(#logo-ring)" strokeWidth="1.5" />
            {/* C letterform as a track arc */}
            <circle cx="18" cy="18" r="9" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray="43" strokeDashoffset="13" transform="rotate(-40 18 18)" opacity="0.9" />
            {/* Centre dot — the "pulse" */}
            <circle cx="18" cy="18" r="2.5" fill="white" opacity="0.95" />
            {/* Small tick / check at the gap of the C */}
            <path d="M25.5 12.5 L27.5 15 L24 17" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function SiteNav() {
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    const links = [
        { href: "/setup", label: "How to Setup", icon: "⚡" },
        { href: "/api/download", label: "Download", icon: "⬇", highlight: true },
    ];

    // Close drawer on outside click
    useEffect(() => {
        if (!mobileOpen) return;
        const handler = (e: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [mobileOpen]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    return (
        <>
            <nav className="border-b border-white/5 bg-black/50 backdrop-blur-2xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0" onClick={() => setMobileOpen(false)}>
                        <div className="group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(139,92,246,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.7)]">
                            <LogoMark size={34} />
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
                                className={link.highlight
                                    ? "text-xs font-bold text-white bg-white/8 hover:bg-white/14 border border-white/12 hover:border-white/22 transition-all px-4 py-2 rounded-full flex items-center gap-1.5"
                                    : "text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3.5 py-2 rounded-lg hover:bg-white/6"
                                }
                            >
                                {link.highlight && <span>⬇</span>}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
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

                        {/* Hamburger */}
                        <button
                            onClick={() => setMobileOpen(o => !o)}
                            className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/6 transition-colors border border-white/6"
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                        >
                            <span className={`absolute block w-4 h-[1.5px] bg-zinc-300 transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-0" : "-translate-y-[5px]"}`} />
                            <span className={`absolute block w-4 h-[1.5px] bg-zinc-300 transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : "opacity-100"}`} />
                            <span className={`absolute block w-4 h-[1.5px] bg-zinc-300 transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 translate-y-0" : "translate-y-[5px]"}`} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                aria-hidden="true"
            />

            {/* Mobile drawer */}
            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 h-full w-72 z-50 bg-[#0a0a14] border-l border-white/6 shadow-2xl flex flex-col transition-transform duration-300 ease-out md:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                        <LogoMark size={28} />
                        <span className="font-black text-sm text-white">ClarityOS</span>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/6 text-zinc-500 hover:text-white transition-colors text-lg leading-none"
                        aria-label="Close menu"
                    >
                        ×
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-4 py-5 space-y-1">
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/5 transition-all font-medium border border-transparent hover:border-white/5"
                        >
                            <span className="text-base">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Drawer footer CTA */}
                <div className="p-4 border-t border-white/5">
                    {session ? (
                        <Link
                            href="/"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-center gap-2 w-full text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 px-5 py-3 rounded-xl transition-all shadow-[0_0_24px_rgba(139,92,246,0.35)]"
                        >
                            Go to Dashboard →
                        </Link>
                    ) : (
                        <button
                            onClick={() => { setMobileOpen(false); signIn("google"); }}
                            className="flex items-center justify-center gap-2 w-full text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 px-5 py-3 rounded-xl transition-all shadow-[0_0_24px_rgba(139,92,246,0.35)] cursor-pointer"
                        >
                            Sign in with Google →
                        </button>
                    )}
                    <p className="text-center text-[10px] text-zinc-700 mt-3">Free forever · Local AI · Windows 10/11</p>
                </div>
            </div>
        </>
    );
}
