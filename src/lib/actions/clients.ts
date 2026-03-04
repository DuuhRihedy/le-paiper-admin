"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/actions/audit";

const createClientSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(200),
    email: z.string().email("Email inválido"),
    phone: z.string().min(1, "Telefone é obrigatório").max(30),
});

const updateClientSchema = createClientSchema.partial();

export async function getClients() {
    await requireAuth();
    return db.client.findMany({ orderBy: { joinDate: "desc" } });
}

export async function createClient(data: {
    name: string;
    email: string;
    phone: string;
}) {
    await requireAdmin();
    const validated = createClientSchema.parse(data);
    const client = await db.client.create({ data: validated });
    await createAuditLog({ action: "create", entity: "client", entityId: client.id, details: validated.name });
    revalidatePath("/clientes");
}

export async function updateClient(
    id: string,
    data: {
        name?: string;
        email?: string;
        phone?: string;
    }
) {
    await requireAdmin();
    const validated = updateClientSchema.parse(data);
    if (Object.keys(validated).length === 0) return;
    const clientId = z.string().cuid().parse(id);
    await db.client.update({ where: { id: clientId }, data: validated });
    await createAuditLog({ action: "update", entity: "client", entityId: clientId });
    revalidatePath("/clientes");
}

export async function deleteClient(id: string): Promise<{ error?: string }> {
    await requireAdmin();
    const clientId = z.string().cuid().parse(id);
    const client = await db.client.findUnique({
        where: { id: clientId },
        select: { name: true },
    });
    if (!client) return { error: "Cliente não encontrado" };

    // Atomic: mark sales + delete client in single transaction
    await db.$transaction(async (tx) => {
        await tx.sale.updateMany({
            where: { clientId },
            data: { clientName: client.name, clientDeleted: true },
        });
        await tx.client.delete({ where: { id: clientId } });
    });

    try {
        await createAuditLog({ action: "delete", entity: "client", entityId: clientId, details: client.name });
    } catch {
        // Audit failure should not break the operation
    }
    revalidatePath("/clientes");
    return {};
}
