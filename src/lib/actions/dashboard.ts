"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

export async function getDashboardData() {
    await requireAuth();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total revenue (last 30 days)
    const salesLast30 = await db.sale.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        include: { items: true },
    });

    const revenue = salesLast30.reduce((acc, s) => acc + Number(s.total), 0);
    const totalSales = salesLast30.length;
    const avgTicket = totalSales > 0 ? revenue / totalSales : 0;

    // New clients (last 30 days)
    const newClients = await db.client.count({
        where: { joinDate: { gte: thirtyDaysAgo } },
    });

    // Low stock products — PostgreSQL supports column-to-column comparison via raw query
    const finalLowStock = await db.$queryRaw<
        { id: string; name: string; stock: number; minStock: number; color: string }[]
    >`SELECT id, name, stock, "minStock", color FROM "Product" WHERE stock <= "minStock" ORDER BY stock ASC LIMIT 5`;

    // Recent sales
    const recentSales = await db.sale.findMany({
        take: 5,
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
                    quantity: true,
                    price: true,
                    productName: true,
                    productDeleted: true,
                    product: { select: { name: true } },
                },
            },
        },
    });

    return {
        revenue,
        totalSales,
        avgTicket,
        newClients,
        lowStock: finalLowStock,
        recentSales,
    };
}
