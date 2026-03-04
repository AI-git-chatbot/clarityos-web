"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export interface ChecklistItem {
    id: string;
    text: string;
    done: boolean;
}

export async function saveIntention(items: ChecklistItem[]) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // todos = plain text for email reports
    const todosText = items.map((i) => `• ${i.text}`).join("\n");

    await prisma.dailyIntention.upsert({
        where: {
            userId_date: {
                userId: user.id,
                date: today
            }
        },
        update: {
            todos: todosText,
            checklistItems: JSON.stringify(items)
        },
        create: {
            userId: user.id,
            date: today,
            todos: todosText,
            checklistItems: JSON.stringify(items)
        }
    });

    revalidatePath("/");
    return { success: true };
}

export async function skipIntention() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error("User not found");

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await prisma.dailyIntention.upsert({
        where: { userId_date: { userId: user.id, date: today } },
        update: {},
        create: {
            userId: user.id,
            date: today,
            todos: "",
            checklistItems: "[]",
        },
    });

    revalidatePath("/");
    return { success: true };
}
