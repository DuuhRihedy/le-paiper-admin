"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/actions/audit";

const createProductSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(200),
    category: z.string().min(1, "Categoria é obrigatória").max(100),
    price: z.number().positive("Preço deve ser positivo"),
    cost: z.number().nonnegative("Custo não pode ser negativo"),
    stock: z.number().int().nonnegative("Estoque deve ser >= 0"),
    minStock: z.number().int().nonnegative("Estoque mínimo deve ser >= 0"),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve ser hexadecimal"),
});

const updateProductSchema = createProductSchema.partial();

export async function getProducts() {
    await requireAuth();
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
    await requireAdmin();
    const validated = createProductSchema.parse(data);
    const product = await db.product.create({ data: validated });
    await createAuditLog({ action: "create", entity: "product", entityId: product.id, details: validated.name });
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
    await requireAdmin();
    const validated = updateProductSchema.parse(data);
    if (Object.keys(validated).length === 0) return;
    const productId = z.string().cuid().parse(id);
    await db.product.update({ where: { id: productId }, data: validated });
    await createAuditLog({ action: "update", entity: "product", entityId: productId });
    revalidatePath("/inventario");
    revalidatePath("/pdv");
}

export async function deleteProduct(id: string): Promise<{ error?: string }> {
    await requireAdmin();
    const productId = z.string().cuid().parse(id);
    const product = await db.product.findUnique({
        where: { id: productId },
        select: { name: true },
    });
    if (!product) return { error: "Produto não encontrado" };

    // Atomic: mark sale items + delete product in single transaction
    await db.$transaction(async (tx) => {
        await tx.saleItem.updateMany({
            where: { productId },
            data: { productName: product.name, productDeleted: true },
        });
        await tx.product.delete({ where: { id: productId } });
    });

    try {
        await createAuditLog({ action: "delete", entity: "product", entityId: productId, details: product.name });
    } catch {
        // Audit failure should not break the operation
    }
    revalidatePath("/inventario");
    revalidatePath("/pdv");
    return {};
}
