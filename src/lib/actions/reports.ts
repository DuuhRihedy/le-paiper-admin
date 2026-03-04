"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

const getReportsSchema = z.number().int().positive().max(365).default(30);

export async function getReportsData(days = 30) {
    await requireAuth();
    const safeDays = getReportsSchema.parse(days);

    const now = new Date();
    const startDate = new Date(now.getTime() - safeDays * 24 * 60 * 60 * 1000);

    // All sales in range
    const sales = await db.sale.findMany({
        where: { createdAt: { gte: startDate } },
        include: {
            items: {
                include: { product: { select: { name: true, category: true, cost: true } } },
            },
        },
        orderBy: { createdAt: "asc" },
    });

    // Revenue by day
    const revenueByDay: Record<string, { revenue: number; cost: number }> = {};
    for (const sale of sales) {
        const day = sale.createdAt.toISOString().split("T")[0];
        if (!revenueByDay[day]) revenueByDay[day] = { revenue: 0, cost: 0 };
        revenueByDay[day].revenue += Number(sale.total);
        for (const item of sale.items) {
            revenueByDay[day].cost += Number(item.product?.cost ?? 0) * item.quantity;
        }
    }

    const dailyRevenue = Object.entries(revenueByDay).map(([date, data]) => ({
        date,
        revenue: Math.round(data.revenue * 100) / 100,
        cost: Math.round(data.cost * 100) / 100,
    }));

    // Sales by category
    const categoryMap: Record<string, number> = {};
    for (const sale of sales) {
        for (const item of sale.items) {
            const cat = item.product?.category ?? "Produto excluído";
            categoryMap[cat] = (categoryMap[cat] || 0) + item.quantity;
        }
    }
    const salesByCategory = Object.entries(categoryMap)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

    // Payment methods
    const methodMap: Record<string, number> = {};
    for (const sale of sales) {
        methodMap[sale.paymentMethod] = (methodMap[sale.paymentMethod] || 0) + 1;
    }
    const paymentMethods = Object.entries(methodMap).map(([method, count]) => ({
        method,
        count,
    }));

    // Top products
    const productMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
    for (const sale of sales) {
        for (const item of sale.items) {
            const key = item.product?.name ?? item.productName ?? "Produto excluído";
            if (!productMap[key]) productMap[key] = { name: key, quantity: 0, revenue: 0 };
            productMap[key].quantity += item.quantity;
            productMap[key].revenue += Number(item.price) * item.quantity;
        }
    }
    const topProducts = Object.values(productMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    // KPIs
    const totalRevenue = sales.reduce((acc, s) => acc + Number(s.total), 0);
    const totalOrders = sales.length;
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalClients = await db.client.count();

    return {
        kpis: {
            revenue: Math.round(totalRevenue * 100) / 100,
            sales: totalOrders,
            avgTicket: Math.round(avgTicket * 100) / 100,
            clients: totalClients,
        },
        dailyRevenue,
        salesByCategory,
        paymentMethods,
        topProducts,
    };
}
