"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProducts() {
    return db.product.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createProduct(data: {
    name: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    minStock: number;
    color: string;
}) {
    await db.product.create({ data });
    revalidatePath("/inventario");
    revalidatePath("/pdv");
}

export async function updateProduct(
    id: string,
    data: {
        name?: string;
        category?: string;
        price?: number;
        cost?: number;
        stock?: number;
        minStock?: number;
        color?: string;
    }
) {
    await db.product.update({ where: { id }, data });
    revalidatePath("/inventario");
    revalidatePath("/pdv");
}

export async function deleteProduct(id: string) {
    await db.product.delete({ where: { id } });
    revalidatePath("/inventario");
    revalidatePath("/pdv");
}
