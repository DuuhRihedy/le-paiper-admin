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

    const revenue = salesLast30.reduce((acc, s) => acc + s.total, 0);
    const totalSales = salesLast30.length;
    const avgTicket = totalSales > 0 ? revenue / totalSales : 0;

    // New clients (last 30 days)
    const newClients = await db.client.count({
        where: { joinDate: { gte: thirtyDaysAgo } },
    });

    // Low stock products — query directly in the DB
    const lowStock = await db.product.findMany({
        where: {
            stock: { lte: 5 },
        },
        orderBy: { stock: "asc" },
        take: 5,
    });

    // For more accurate filtering, we post-filter products where stock <= minStock
    // SQLite doesn't support column-to-column comparison in WHERE easily with Prisma,
    // so we fetch a reasonable set and then filter
    const lowStockFiltered = lowStock.filter((p) => p.stock <= p.minStock);

    // If we didn't get enough, fetch more with a broader scope
    let finalLowStock = lowStockFiltered;
    if (lowStockFiltered.length < 5) {
        const allLowish = await db.product.findMany({
            where: { stock: { lte: 20 } },
            orderBy: { stock: "asc" },
            take: 20,
        });
        finalLowStock = allLowish
            .filter((p) => p.stock <= p.minStock)
            .slice(0, 5);
    }

    // Recent sales
    const recentSales = await db.sale.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
            client: { select: { name: true } },
            items: { include: { product: { select: { name: true } } } },
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
