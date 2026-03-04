import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

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
        const dateParam = searchParams.get("date"); // optional: YYYY-MM-DD

        let startOfDay: Date;
        let endOfDay: Date;

        if (dateParam) {
            startOfDay = new Date(`${dateParam}T00:00:00.000Z`);
            endOfDay = new Date(`${dateParam}T23:59:59.999Z`);
        } else {
            // Default: today in local time
            startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
        }

        const sessions = await prisma.session.findMany({
            where: {
                userId: user.id,
                sessionStart: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            orderBy: { sessionStart: "desc" },
        });

        return NextResponse.json({ sessions });
    } catch (error) {
        console.error("Sessions API Error:", error);
        return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }
}
