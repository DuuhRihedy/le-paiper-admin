"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-guard";

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
    try {
        const session = await auth();
        if (!session?.user?.id) return; // Silently skip if no session

        const validated = auditSchema.parse(data);
        await db.auditLog.create({
            data: {
                userId: session.user.id,
                ...validated,
            },
        });
    } catch {
        // Audit log failure should never break the calling operation
    }
}

export async function getAuditLogs(limit = 50) {
    await requireAdmin(); // Only admins can view audit logs
    const safeLimit = z.number().int().positive().max(200).parse(limit);
    return db.auditLog.findMany({
        take: safeLimit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
    });
}
