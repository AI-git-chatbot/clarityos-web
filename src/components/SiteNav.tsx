"use client";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function SiteNav() {
    const { data: session } = useSession();

    return (
        <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all">
                        <span className="text-sm font-black text-white">C</span>
                    </div>
                    <div>
                        <div className="font-black text-base tracking-tight text-white leading-none">ClarityOS</div>
                        <div className="text-[9px] text-zinc-500 leading-none tracking-widest uppercase font-semibold">AI Work Tracker</div>
                    </div>
                </Link>

                {/* Nav links */}
                <div className="hidden md:flex items-center gap-1">
                    {[
                        { href: "/setup", label: "How to Setup" },
                        { href: "/download", label: "Download" },
                    ].map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                {session ? (
                    <Link
                        href="/"
                        className="text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-full transition-colors"
                    >
                        Dashboard →
                    </Link>
                ) : (
                    <button
                        onClick={() => signIn("google")}
                        className="text-xs font-semibold text-white bg-white/8 hover:bg-white/14 transition-colors px-4 py-2 rounded-full border border-white/10"
                    >
                        Sign in →
                    </button>
                )}
            </div>
        </nav>
    );
}
