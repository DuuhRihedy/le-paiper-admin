"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

export async function exportReportsCsv(days = 30) {
    await requireAuth();

    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const sales = await db.sale.findMany({
        where: { createdAt: { gte: startDate } },
        include: {
            client: { select: { name: true } },
            items: { include: { product: { select: { name: true, category: true } } } },
        },
        orderBy: { createdAt: "desc" },
    });

    // Build CSV rows
    const headers = ["Data", "Cliente", "Produto", "Categoria", "Qtd", "Preço Unit.", "Subtotal", "Pagamento"];
    const rows: string[][] = [];

    for (const sale of sales) {
        for (const item of sale.items) {
            rows.push([
                sale.createdAt.toISOString().split("T")[0],
                sale.client?.name ?? "Sem cliente",
                item.product.name,
                item.product.category,
                String(item.quantity),
                item.price.toFixed(2),
                (item.price * item.quantity).toFixed(2),
                sale.paymentMethod,
            ]);
        }
    }

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    return csvContent;
}
