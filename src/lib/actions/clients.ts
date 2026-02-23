"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";
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
    await requireAuth();
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
    await requireAuth();
    const clientId = z.string().cuid().parse(id);
    const validated = updateClientSchema.parse(data);
    await db.client.update({ where: { id: clientId }, data: validated });
    await createAuditLog({ action: "update", entity: "client", entityId: clientId });
    revalidatePath("/clientes");
}

export async function deleteClient(id: string) {
    await requireAuth();
    const clientId = z.string().cuid().parse(id);
    const client = await db.client.findUnique({ where: { id: clientId }, select: { name: true } });
    await db.client.delete({ where: { id: clientId } });
    await createAuditLog({ action: "delete", entity: "client", entityId: clientId, details: client?.name });
    revalidatePath("/clientes");
}
