"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createSale(data: {
    clientId: string | null;
    paymentMethod: string;
    items: { productId: string; quantity: number; price: number }[];
}) {
    const total = data.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Create sale with items
    await db.sale.create({
        data: {
            clientId: data.clientId,
            total,
            paymentMethod: data.paymentMethod,
            items: { create: data.items },
        },
    });

    // Update stock for each product
    for (const item of data.items) {
        await db.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
        });
    }

    // Update client stats if clientId provided
    if (data.clientId) {
        await db.client.update({
            where: { id: data.clientId },
            data: {
                totalSpent: { increment: total },
                totalOrders: { increment: 1 },
                lastPurchase: new Date(),
            },
        });
    }

    revalidatePath("/");
    revalidatePath("/pdv");
    revalidatePath("/inventario");
    revalidatePath("/clientes");
    revalidatePath("/relatorios");
}

export async function getRecentSales(limit = 10) {
    return db.sale.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
            client: { select: { name: true } },
            items: { include: { product: { select: { name: true } } } },
        },
    });
}
