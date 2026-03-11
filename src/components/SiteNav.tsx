"use client";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

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

                    {/* Logo — full image, clipped to show icon + wordmark */}
                    <Link href="/" className="flex items-center shrink-0 group" onClick={() => setMobileOpen(false)}>
                        {/* 
                          The logo image includes the icon + ClarityOS text + AI WORK TRACKER subtitle.
                          We show it at a fixed height and let the image sit naturally.
                          White bg is masked by a rounded container with overflow-hidden.
                        */}
                        <div className="relative h-12 w-[230px] rounded-xl overflow-hidden group-hover:opacity-90 transition-opacity duration-200">
                            <Image
                                src="/clarityos-logo.png"
                                alt="ClarityOS — AI Work Tracker"
                                fill
                                className="object-contain object-left"
                                priority
                            />
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
                    <div className="relative h-10 w-[170px] rounded-lg overflow-hidden">
                        <Image
                            src="/clarityos-logo.png"
                            alt="ClarityOS"
                            fill
                            className="object-contain object-left"
                        />
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
                    <p className="text-center text-[10px] text-zinc-700 mt-3">Free · Local AI · Windows 10/11</p>
                </div>
            </div>
        </>
    );
}
