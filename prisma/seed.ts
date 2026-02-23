import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Clean existing data
    await prisma.saleItem.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.client.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // Admin user
    const admin = await prisma.user.create({
        data: {
            name: "Le Paiper Admin",
            email: "admin@lepaiper.com",
            password: hashSync("lepaiper123", 10),
            role: "admin",
        },
    });
    console.log(`✅ User: ${admin.email}`);

    // Demo viewer user (portfolio)
    const demo = await prisma.user.create({
        data: {
            name: "Visitante Demo",
            email: "demo@lepaiper.com",
            password: hashSync("demo123", 10),
            role: "viewer",
        },
    });
    console.log(`✅ Demo: ${demo.email}`);

    // Products
    const productsData = [
        { name: "Caderno Kraft A5", category: "Cadernos", price: 45.9, cost: 22.0, stock: 34, minStock: 5, color: "#8B5CF6" },
        { name: "Caneta Nankin 0.5", category: "Canetas", price: 28.5, cost: 12.0, stock: 2, minStock: 5, color: "#EC4899" },
        { name: "Washi Tape Floral", category: "Acessórios", price: 18.9, cost: 7.5, stock: 3, minStock: 5, color: "#F59E0B" },
        { name: "Lápis Grafite 6B", category: "Canetas", price: 12.0, cost: 4.5, stock: 56, minStock: 10, color: "#6366F1" },
        { name: "Aquarela 24 Cores", category: "Tintas", price: 89.9, cost: 42.0, stock: 12, minStock: 3, color: "#14B8A6" },
        { name: "Sketchbook A4 200g", category: "Cadernos", price: 62.0, cost: 28.0, stock: 18, minStock: 5, color: "#8B5CF6" },
        { name: "Borracha Maleável", category: "Acessórios", price: 8.5, cost: 3.0, stock: 45, minStock: 10, color: "#F59E0B" },
        { name: "Marcador Brush Pen", category: "Canetas", price: 35.0, cost: 15.0, stock: 22, minStock: 5, color: "#EC4899" },
        { name: "Papel Vergê A4 120g", category: "Papéis", price: 32.0, cost: 14.0, stock: 8, minStock: 10, color: "#06B6D4" },
        { name: "Kit Caligrafia", category: "Canetas", price: 125.0, cost: 55.0, stock: 6, minStock: 3, color: "#6366F1" },
    ];

    const products = await Promise.all(
        productsData.map((p) => prisma.product.create({ data: p }))
    );
    console.log(`✅ ${products.length} products`);

    // Clients
    const clientsData = [
        { name: "Maria Silva", email: "maria@email.com", phone: "(11) 98765-4321", totalSpent: 1890.5, totalOrders: 12, joinDate: new Date("2024-03-15") },
        { name: "Pedro Santos", email: "pedro@email.com", phone: "(11) 91234-5678", totalSpent: 2450.0, totalOrders: 18, joinDate: new Date("2024-01-20") },
        { name: "Ana Costa", email: "ana@email.com", phone: "(21) 99876-5432", totalSpent: 560.0, totalOrders: 4, joinDate: new Date("2024-06-10") },
        { name: "Lucas Oliveira", email: "lucas@email.com", phone: "(31) 98888-7777", totalSpent: 890.3, totalOrders: 7, joinDate: new Date("2024-04-22") },
        { name: "Camila Ferreira", email: "camila@email.com", phone: "(11) 97654-3210", totalSpent: 345.0, totalOrders: 3, joinDate: new Date("2024-08-05") },
        { name: "Rafael Lima", email: "rafael@email.com", phone: "(21) 96543-2109", totalSpent: 1650.8, totalOrders: 11, joinDate: new Date("2024-02-14") },
        { name: "Juliana Mendes", email: "juliana@email.com", phone: "(31) 95432-1098", totalSpent: 420.0, totalOrders: 5, joinDate: new Date("2024-07-30") },
        { name: "Bruno Almeida", email: "bruno@email.com", phone: "(11) 94321-0987", totalSpent: 3200.0, totalOrders: 22, joinDate: new Date("2023-11-10") },
    ];

    const clients = await Promise.all(
        clientsData.map((c) =>
            prisma.client.create({
                data: {
                    ...c,
                    lastPurchase: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                },
            })
        )
    );
    console.log(`✅ ${clients.length} clients`);

    // Sales with items
    const paymentMethods = ["pix", "cartao", "dinheiro"];
    const salesData: { clientIdx: number; items: { prodIdx: number; qty: number }[]; method: string; daysAgo: number }[] = [
        { clientIdx: 0, items: [{ prodIdx: 0, qty: 2 }, { prodIdx: 3, qty: 3 }], method: "pix", daysAgo: 1 },
        { clientIdx: 1, items: [{ prodIdx: 4, qty: 1 }, { prodIdx: 7, qty: 2 }], method: "cartao", daysAgo: 1 },
        { clientIdx: 7, items: [{ prodIdx: 9, qty: 1 }], method: "pix", daysAgo: 2 },
        { clientIdx: 2, items: [{ prodIdx: 5, qty: 1 }, { prodIdx: 6, qty: 4 }], method: "dinheiro", daysAgo: 3 },
        { clientIdx: 3, items: [{ prodIdx: 1, qty: 3 }, { prodIdx: 2, qty: 2 }], method: "cartao", daysAgo: 3 },
        { clientIdx: 5, items: [{ prodIdx: 0, qty: 1 }, { prodIdx: 8, qty: 2 }], method: "pix", daysAgo: 4 },
        { clientIdx: 4, items: [{ prodIdx: 3, qty: 5 }], method: "dinheiro", daysAgo: 5 },
        { clientIdx: 6, items: [{ prodIdx: 7, qty: 1 }, { prodIdx: 6, qty: 2 }], method: "cartao", daysAgo: 5 },
        { clientIdx: 0, items: [{ prodIdx: 4, qty: 1 }], method: "pix", daysAgo: 7 },
        { clientIdx: 1, items: [{ prodIdx: 5, qty: 2 }, { prodIdx: 3, qty: 1 }], method: "cartao", daysAgo: 8 },
        { clientIdx: 7, items: [{ prodIdx: 0, qty: 3 }, { prodIdx: 1, qty: 2 }], method: "pix", daysAgo: 10 },
        { clientIdx: 3, items: [{ prodIdx: 8, qty: 3 }], method: "dinheiro", daysAgo: 12 },
        { clientIdx: 5, items: [{ prodIdx: 9, qty: 1 }, { prodIdx: 2, qty: 3 }], method: "cartao", daysAgo: 14 },
        { clientIdx: 2, items: [{ prodIdx: 7, qty: 2 }], method: "pix", daysAgo: 15 },
        { clientIdx: 6, items: [{ prodIdx: 0, qty: 1 }, { prodIdx: 4, qty: 1 }], method: "cartao", daysAgo: 18 },
        { clientIdx: 4, items: [{ prodIdx: 5, qty: 1 }], method: "dinheiro", daysAgo: 20 },
        { clientIdx: 0, items: [{ prodIdx: 2, qty: 5 }, { prodIdx: 6, qty: 3 }], method: "pix", daysAgo: 22 },
        { clientIdx: 1, items: [{ prodIdx: 9, qty: 1 }], method: "cartao", daysAgo: 25 },
        { clientIdx: 7, items: [{ prodIdx: 8, qty: 2 }, { prodIdx: 3, qty: 4 }], method: "pix", daysAgo: 28 },
        { clientIdx: 5, items: [{ prodIdx: 4, qty: 2 }], method: "cartao", daysAgo: 30 },
    ];

    let saleCount = 0;
    for (const s of salesData) {
        const saleItems = s.items.map((item) => ({
            productId: products[item.prodIdx].id,
            quantity: item.qty,
            price: products[item.prodIdx].price,
        }));
        const total = saleItems.reduce((acc, si) => acc + si.price * si.quantity, 0);

        await prisma.sale.create({
            data: {
                clientId: clients[s.clientIdx].id,
                total,
                paymentMethod: s.method,
                createdAt: new Date(Date.now() - s.daysAgo * 24 * 60 * 60 * 1000),
                items: { create: saleItems },
            },
        });
        saleCount++;
    }
    console.log(`✅ ${saleCount} sales`);

    console.log("🎉 Seed complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
