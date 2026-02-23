"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/actions/audit";

const saleItemSchema = z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().positive("Quantidade deve ser > 0"),
    price: z.number().positive("Preço deve ser positivo"),
});

const createSaleSchema = z.object({
    clientId: z.string().cuid().nullable(),
    paymentMethod: z.enum(["pix", "cartao", "dinheiro"], {
        message: "Método de pagamento inválido",
    }),
    items: z.array(saleItemSchema).min(1, "Pelo menos 1 item é obrigatório"),
});

export async function createSale(data: {
    clientId: string | null;
    paymentMethod: string;
    items: { productId: string; quantity: number; price: number }[];
}) {
    await requireAdmin();
    const validated = createSaleSchema.parse(data);
    const total = validated.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    await db.$transaction(async (tx) => {
        // Validate stock availability before proceeding
        for (const item of validated.items) {
            const product = await tx.product.findUnique({
                where: { id: item.productId },
                select: { name: true, stock: true },
            });
            if (!product) {
                throw new Error(`Produto não encontrado: ${item.productId}`);
            }
            if (product.stock < item.quantity) {
                throw new Error(
                    `Estoque insuficiente para "${product.name}": disponível ${product.stock}, solicitado ${item.quantity}`
                );
            }
        }

        // Create sale with items
        await tx.sale.create({
            data: {
                clientId: validated.clientId,
                total,
                paymentMethod: validated.paymentMethod,
                items: { create: validated.items },
            },
        });

        // Update stock for each product
        for (const item of validated.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }

        // Update client stats if clientId provided
        if (validated.clientId) {
            await tx.client.update({
                where: { id: validated.clientId },
                data: {
                    totalSpent: { increment: total },
                    totalOrders: { increment: 1 },
                    lastPurchase: new Date(),
                },
            });
        }
    });

    await createAuditLog({ action: "create", entity: "sale", details: `Venda R$${total.toFixed(2)} - ${validated.items.length} itens` });

    revalidatePath("/");
    revalidatePath("/pdv");
    revalidatePath("/inventario");
    revalidatePath("/clientes");
    revalidatePath("/relatorios");
}

export async function getRecentSales(limit = 10) {
    await requireAuth();
    const safeLimit = z.number().int().positive().max(100).parse(limit);
    return db.sale.findMany({
        take: safeLimit,
        orderBy: { createdAt: "desc" },
        include: {
            client: { select: { name: true } },
            items: { include: { product: { select: { name: true } } } },
        },
    });
}
