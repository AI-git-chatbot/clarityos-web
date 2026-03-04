"use client";

import { useState, useRef, useTransition } from "react";
import { ChecklistItem, skipIntention } from "@/app/actions";

function makeId() {
    // browser-safe UUID
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function IntentionForm({ onSubmit }: { onSubmit: (items: ChecklistItem[]) => Promise<any> }) {
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const addItem = () => {
        const text = inputValue.trim();
        if (!text) return;
        setItems(prev => [...prev, { id: makeId(), text, done: false }]);
        setInputValue("");
        inputRef.current?.focus();
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") { e.preventDefault(); addItem(); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = inputValue.trim();
        const finalItems = text ? [...items, { id: makeId(), text, done: false }] : items;
        if (!finalItems.length) return;
        setIsSubmitting(true);
        try {
            await onSubmit(finalItems);
        } catch (err) {
            console.error("Failed to save intention:", err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden px-4">
            {/* Background orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/8 rounded-full blur-[130px] -z-10 pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-blue-500/6 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                        ClarityOS
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                        What needs to get done today?
                    </h1>
                    <p className="text-zinc-500 text-sm">Add your tasks below. ClarityOS will track your progress automatically.</p>
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl border border-white/8 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">

                    {/* Task list */}
                    {items.length > 0 && (
                        <ul className="px-5 pt-5 space-y-2">
                            {items.map((item, i) => (
                                <li
                                    key={item.id}
                                    className="flex items-center gap-3 bg-white/4 rounded-xl px-4 py-3 group animate-in fade-in slide-in-from-left-2 duration-300"
                                    style={{ animationDelay: `${i * 40}ms` }}
                                >
                                    <span className="w-5 h-5 rounded-full border-2 border-zinc-600 shrink-0" />
                                    <span className="flex-1 text-sm text-white/90">{item.text}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.id)}
                                        className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all text-lg leading-none"
                                        title="Remove"
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Input row */}
                    <form onSubmit={handleSubmit} className="p-5">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-violet-500/50 focus-within:bg-violet-500/5 transition-all">
                            <span className="text-zinc-600 text-lg">+</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder={items.length === 0 ? "E.g. Send email to client, write 3 posts…" : "Add another task…"}
                                className="flex-1 bg-transparent text-white text-sm placeholder:text-zinc-600 focus:outline-none"
                                autoFocus
                            />
                            {inputValue.trim() && (
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="text-xs bg-white/10 hover:bg-white/15 text-zinc-300 px-2.5 py-1 rounded-lg transition-colors"
                                >
                                    Add ↵
                                </button>
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                            <p className="text-xs text-zinc-600">
                                {items.length === 0 ? "Press Enter to add tasks" : `${items.length} task${items.length !== 1 ? "s" : ""} added`}
                            </p>
                            <button
                                type="submit"
                                disabled={isSubmitting || (items.length === 0 && !inputValue.trim())}
                                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-95"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Locking in…
                                    </>
                                ) : (
                                    <>Lock In Day</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Skip link */}
            <button
                type="button"
                disabled={isPending}
                onClick={() => startTransition(() => { void skipIntention(); })}
                className="mt-5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors disabled:opacity-40 cursor-pointer"
            >
                {isPending ? "Skipping…" : "Skip for today — go straight to dashboard →"}
            </button>
        </div>
    );
}
