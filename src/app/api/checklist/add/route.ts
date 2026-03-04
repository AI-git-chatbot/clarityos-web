import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface ChecklistItem { id: string; text: string; done: boolean; }

// POST /api/checklist/add — append a new task to today's checklist from the dashboard
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { item } = await req.json() as { item: ChecklistItem };
        if (!item?.id || !item?.text) {
            return NextResponse.json({ error: "Invalid item" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // Upsert today's intention if it doesn't exist yet (handles "skipped" days too)
        const intention = await prisma.dailyIntention.upsert({
            where: { userId_date: { userId: user.id, date: today } },
            update: {},
            create: {
                userId: user.id,
                date: today,
                todos: "",
                checklistItems: "[]",
            },
        });

        const existing: ChecklistItem[] = JSON.parse(intention.checklistItems || "[]");

        // Avoid duplicates by id
        if (existing.find(i => i.id === item.id)) {
            return NextResponse.json({ success: true, items: existing });
        }

        const updated = [...existing, { id: item.id, text: item.text, done: false }];

        await prisma.dailyIntention.update({
            where: { userId_date: { userId: user.id, date: today } },
            data: {
                checklistItems: JSON.stringify(updated),
                todos: updated.map(i => `• ${i.text}`).join("\n"),
            },
        });

        return NextResponse.json({ success: true, items: updated });
    } catch (err) {
        console.error("Add task error:", err);
        return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
    }
}
