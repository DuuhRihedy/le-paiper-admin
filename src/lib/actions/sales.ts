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

    await db.$transaction(async (tx) => {
        // Fetch all products in a single query (eliminates N+1)
        const productIds = validated.items.map((item) => item.productId);
        const products = await tx.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true, stock: true, price: true },
        });

        const productMap = new Map(products.map((p) => [p.id, p]));

        // Validate all products exist and have stock
        for (const item of validated.items) {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new Error(`Produto não encontrado: ${item.productId}`);
            }
            if (product.stock < item.quantity) {
                throw new Error(
                    `Estoque insuficiente para "${product.name}": disponível ${product.stock}, solicitado ${item.quantity}`
                );
            }
        }

        // Atomic stock decrement — prevents race conditions
        // Uses WHERE stock >= quantity so concurrent sales can't oversell
        for (const item of validated.items) {
            const result = await tx.product.updateMany({
                where: {
                    id: item.productId,
                    stock: { gte: item.quantity },
                },
                data: { stock: { decrement: item.quantity } },
            });
            if (result.count === 0) {
                const product = productMap.get(item.productId);
                throw new Error(
                    `Estoque insuficiente para "${product?.name ?? item.productId}" (venda concorrente detectada)`
                );
            }
        }

        // Calculate total using server-side prices (don't trust client price)
        const total = validated.items.reduce((acc, item) => {
            const product = productMap.get(item.productId);
            const serverPrice = product ? Number(product.price) : item.price;
            return acc + serverPrice * item.quantity;
        }, 0);

        // Get client name if provided
        let clientName: string | null = null;
        if (validated.clientId) {
            const c = await tx.client.findUnique({ where: { id: validated.clientId }, select: { name: true } });
            clientName = c?.name || null;
        }

        // Create sale with items using server-side prices
        await tx.sale.create({
            data: {
                clientId: validated.clientId,
                clientName,
                total,
                paymentMethod: validated.paymentMethod,
                items: {
                    create: validated.items.map((item) => {
                        const product = productMap.get(item.productId);
                        return {
                            productId: item.productId,
                            quantity: item.quantity,
                            price: product ? Number(product.price) : item.price,
                            productName: product?.name || null,
                        };
                    }),
                },
            },
        });

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

    // Audit log outside transaction (non-critical, should not block sale)
    try {
        const total = validated.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await createAuditLog({ action: "create", entity: "sale", details: `Venda R$${total.toFixed(2)} - ${validated.items.length} itens` });
    } catch {
        // Audit failure should never break a successful sale
    }

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
        select: {
            id: true,
            total: true,
            paymentMethod: true,
            clientName: true,
            clientDeleted: true,
            createdAt: true,
            client: { select: { name: true } },
            items: {
                select: {
                    id: true,
                    productName: true,
                    productDeleted: true,
                    quantity: true,
                    price: true,
                    product: { select: { name: true } },
                },
            },
        },
    });
}
