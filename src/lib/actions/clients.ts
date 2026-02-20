"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getClients() {
    return db.client.findMany({ orderBy: { joinDate: "desc" } });
}

export async function createClient(data: {
    name: string;
    email: string;
    phone: string;
}) {
    await db.client.create({ data });
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
    await db.client.update({ where: { id }, data });
    revalidatePath("/clientes");
}

export async function deleteClient(id: string) {
    await db.client.delete({ where: { id } });
    revalidatePath("/clientes");
}
