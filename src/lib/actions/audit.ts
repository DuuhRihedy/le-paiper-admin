"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const auditSchema = z.object({
    action: z.string().min(1).max(50),
    entity: z.string().min(1).max(50),
    entityId: z.string().max(100).optional(),
    details: z.string().max(1000).optional(),
});

export async function createAuditLog(data: {
    action: string;
    entity: string;
    entityId?: string;
    details?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) return; // Silently skip if no session

    const validated = auditSchema.parse(data);
    await db.auditLog.create({
        data: {
            userId: session.user.id,
            ...validated,
        },
    });
}

export async function getAuditLogs(limit = 50) {
    const session = await auth();
    if (!session?.user) return [];

    return db.auditLog.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
    });
}
