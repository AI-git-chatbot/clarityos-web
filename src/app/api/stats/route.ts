import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import type { Session as PrismaSession } from "@prisma/client";

// Force dynamic rendering — prevents Prisma initialization error at build time
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get("date");

        let startOfDay: Date;
        let endOfDay: Date;

        if (dateParam) {
            startOfDay = new Date(`${dateParam}T00:00:00.000Z`);
            endOfDay = new Date(`${dateParam}T23:59:59.999Z`);
        } else {
            startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
        }

        const sessions: PrismaSession[] = await prisma.session.findMany({
            where: {
                userId: user.id,
                sessionStart: { gte: startOfDay, lte: endOfDay },
            },
        });

        // Aggregate stats
        const totalMinutes = sessions.reduce((sum: number, s: PrismaSession) => sum + s.durationMinutes, 0);
        const totalContextSwitches = sessions.reduce((sum: number, s: PrismaSession) => sum + (s.contextSwitches ?? 0), 0);
        const longestSession = sessions.reduce((max: number, s: PrismaSession) => s.durationMinutes > max ? s.durationMinutes : max, 0);

        // Category-level minutes for "Deep Work" = only sessions in this list
        const deepWorkCategories = ["Deep Work", "Research", "Learning"];
        const deepWorkMinutes = sessions
            .filter((s: PrismaSession) => deepWorkCategories.includes(s.primaryCategory ?? ""))
            .reduce((sum: number, s: PrismaSession) => sum + s.durationMinutes, 0);

        // Category breakdown map
        const categoryBreakdown: Record<string, number> = {};
        for (const s of sessions) {
            const cat = s.primaryCategory ?? "Unknown";
            categoryBreakdown[cat] = (categoryBreakdown[cat] ?? 0) + s.durationMinutes;
        }

        // Latest AI summary
        const latestWithSummary = sessions
            .filter((s: PrismaSession) => s.aiContextSummary && s.aiContextSummary.length > 0)
            .sort((a: PrismaSession, b: PrismaSession) => b.sessionStart.getTime() - a.sessionStart.getTime())[0];

        return NextResponse.json({
            totalMinutes: Math.round(totalMinutes),
            deepWorkMinutes: Math.round(deepWorkMinutes),
            contextSwitches: totalContextSwitches,
            longestSessionMinutes: Math.round(longestSession),
            categoryBreakdown,
            latestAiSummary: latestWithSummary?.aiContextSummary ?? null,
            sessionCount: sessions.length,
        });
    } catch (error) {
        console.error("Stats API Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
