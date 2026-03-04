import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Force dynamic so Next.js doesn't try to statically pre-render this route at build time
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Missing or invalid authorization token" }, { status: 401 });
        }

        const apiToken = authHeader.split(" ")[1];

        // Find the user with this token
        const user = await prisma.user.findUnique({
            where: { apiToken }
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid API token" }, { status: 403 });
        }

        // Parse the payload
        const body = await req.json();
        const { sessionStart, sessionEnd, durationMinutes, primaryCategory, primaryProject, appsUsed, aiContextSummary, contextSwitches } = body;

        const newSession = await prisma.session.create({
            data: {
                userId: user.id,
                sessionStart: new Date(sessionStart),
                sessionEnd: new Date(sessionEnd),
                durationMinutes,
                primaryCategory,
                primaryProject,
                appsUsed,
                aiContextSummary,
                contextSwitches: contextSwitches ?? 0,
            }
        });

        // Fire auto-check in background (don't await — don't block the sync response)
        const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
        fetch(`${baseUrl}/api/checklist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, primaryCategory, primaryProject, aiContextSummary }),
        }).catch(() => { /* non-critical, ignore errors */ });

        return NextResponse.json({ success: true, session: newSession, userId: user.id });
    } catch (error) {
        console.error("Sync Error:", error);
        return NextResponse.json({ error: "Failed to sync session data" }, { status: 500 });
    }
}
