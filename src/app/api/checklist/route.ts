import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ── GET /api/checklist — fetch today's items ───────────────────────────────────
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const intention = await prisma.dailyIntention.findUnique({
            where: { userId_date: { userId: user.id, date: today } },
        });
        const items = JSON.parse(intention?.checklistItems ?? "[]");
        return NextResponse.json({ items });
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch checklist" }, { status: 500 });
    }
}

// ── PATCH /api/checklist  — toggle a single task item done/undone ──────────────
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { itemId, done } = await req.json();

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const intention = await prisma.dailyIntention.findUnique({
            where: { userId_date: { userId: user.id, date: today } },
        });
        if (!intention) return NextResponse.json({ error: "No intention for today" }, { status: 404 });

        const items: ChecklistItem[] = JSON.parse(intention.checklistItems || "[]");
        const updated = items.map(item =>
            item.id === itemId ? { ...item, done: done ?? !item.done } : item
        );

        await prisma.dailyIntention.update({
            where: { userId_date: { userId: user.id, date: today } },
            data: { checklistItems: JSON.stringify(updated) },
        });

        return NextResponse.json({ success: true, items: updated });
    } catch (err) {
        console.error("Checklist PATCH error:", err);
        return NextResponse.json({ error: "Failed to update checklist" }, { status: 500 });
    }
}

// ── POST /api/checklist/auto-check — match session summary → tasks ─────────────
// Called by the sync route after a new session is created.
export async function POST(req: Request) {
    try {
        const { userId, primaryCategory, primaryProject, aiContextSummary } = await req.json();
        if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const intention = await prisma.dailyIntention.findUnique({
            where: { userId_date: { userId, date: today } },
        });
        if (!intention) return NextResponse.json({ skipped: true });

        const items: ChecklistItem[] = JSON.parse(intention.checklistItems || "[]");
        if (!items.length) return NextResponse.json({ skipped: true });

        // Build a searchable haystack from the session data
        const sessionText = [primaryCategory, primaryProject, aiContextSummary]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        let anyChanged = false;
        const updated = items.map(item => {
            if (item.done) return item; // already done, skip

            // Tokenize the task text, check if most keywords appear in session
            const taskWords = item.text
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .split(/\s+/)
                .filter(w => w.length > 3); // ignore short words like "and", "to"

            if (!taskWords.length) return item;

            const matches = taskWords.filter(w => sessionText.includes(w));
            const matchRatio = matches.length / taskWords.length;

            // If > 50% of meaningful keywords appear in the session, auto-check
            if (matchRatio >= 0.5) {
                anyChanged = true;
                return { ...item, done: true };
            }
            return item;
        });

        if (anyChanged) {
            await prisma.dailyIntention.update({
                where: { userId_date: { userId, date: today } },
                data: { checklistItems: JSON.stringify(updated) },
            });
        }

        return NextResponse.json({ success: true, autoChecked: anyChanged, items: updated });
    } catch (err) {
        console.error("Auto-check error:", err);
        return NextResponse.json({ error: "Failed to auto-check" }, { status: 500 });
    }
}

interface ChecklistItem {
    id: string;
    text: string;
    done: boolean;
}
