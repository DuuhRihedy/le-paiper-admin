/**
 * Mock data for viewer/demo mode.
 * Viewers see this fake data instead of real business data.
 */

// ── Stable fake IDs (deterministic for consistency) ──
const pid = (n: number) => `clmock_prod_${String(n).padStart(3, "0")}`;
const cid = (n: number) => `clmock_cli_${String(n).padStart(3, "0")}`;
const sid = (n: number) => `clmock_sale_${String(n).padStart(3, "0")}`;

function daysAgo(d: number) {
    return new Date(Date.now() - d * 86_400_000);
}

// ── Products ──
export const MOCK_PRODUCTS = [
    { id: pid(1), name: "Caderno Espiral 200fls", category: "Cadernos", price: 32.9, cost: 18.5, stock: 45, minStock: 10, color: "#8B5CF6", createdAt: daysAgo(60) },
    { id: pid(2), name: "Caneta Gel Azul 0.7", category: "Canetas", price: 4.5, cost: 1.8, stock: 120, minStock: 30, color: "#3B82F6", createdAt: daysAgo(55) },
    { id: pid(3), name: "Lápis Grafite HB (cx 12)", category: "Lápis", price: 15.9, cost: 7.2, stock: 38, minStock: 15, color: "#F59E0B", createdAt: daysAgo(50) },
    { id: pid(4), name: "Borracha Branca Macia", category: "Borrachas", price: 2.5, cost: 0.9, stock: 200, minStock: 50, color: "#EC4899", createdAt: daysAgo(45) },
    { id: pid(5), name: "Papel Sulfite A4 (500fls)", category: "Papéis", price: 28.9, cost: 19.0, stock: 60, minStock: 20, color: "#10B981", createdAt: daysAgo(40) },
    { id: pid(6), name: "Régua 30cm Transparente", category: "Acessórios", price: 3.9, cost: 1.2, stock: 85, minStock: 20, color: "#6366F1", createdAt: daysAgo(38) },
    { id: pid(7), name: "Marca-texto Amarelo", category: "Canetas", price: 5.9, cost: 2.1, stock: 70, minStock: 25, color: "#FBBF24", createdAt: daysAgo(35) },
    { id: pid(8), name: "Tesoura Escolar 13cm", category: "Acessórios", price: 8.9, cost: 3.5, stock: 4, minStock: 10, color: "#EF4444", createdAt: daysAgo(30) },
    { id: pid(9), name: "Cola Bastão 21g", category: "Colas", price: 4.2, cost: 1.5, stock: 3, minStock: 15, color: "#14B8A6", createdAt: daysAgo(25) },
    { id: pid(10), name: "Estojo Escolar Básico", category: "Acessórios", price: 19.9, cost: 8.0, stock: 25, minStock: 8, color: "#A855F7", createdAt: daysAgo(20) },
    { id: pid(11), name: "Fita Adesiva Transparente", category: "Acessórios", price: 6.5, cost: 2.8, stock: 55, minStock: 15, color: "#64748B", createdAt: daysAgo(15) },
    { id: pid(12), name: "Agenda 2026", category: "Cadernos", price: 45.0, cost: 22.0, stock: 18, minStock: 5, color: "#D946EF", createdAt: daysAgo(10) },
];

// ── Clients ──
export const MOCK_CLIENTS = [
    { id: cid(1), name: "Maria Silva", email: "maria@exemplo.com", phone: "(11) 99999-1234", totalSpent: 456.8, totalOrders: 12, lastPurchase: daysAgo(2), joinDate: daysAgo(90) },
    { id: cid(2), name: "João Santos", email: "joao@exemplo.com", phone: "(11) 98888-5678", totalSpent: 289.5, totalOrders: 8, lastPurchase: daysAgo(5), joinDate: daysAgo(75) },
    { id: cid(3), name: "Ana Oliveira", email: "ana@exemplo.com", phone: "(11) 97777-9012", totalSpent: 672.3, totalOrders: 18, lastPurchase: daysAgo(1), joinDate: daysAgo(120) },
    { id: cid(4), name: "Pedro Costa", email: "pedro@exemplo.com", phone: "(11) 96666-3456", totalSpent: 134.0, totalOrders: 4, lastPurchase: daysAgo(10), joinDate: daysAgo(45) },
    { id: cid(5), name: "Lucia Ferreira", email: "lucia@exemplo.com", phone: "(11) 95555-7890", totalSpent: 890.2, totalOrders: 22, lastPurchase: daysAgo(0), joinDate: daysAgo(150) },
];

// ── Recent Sales (for dashboard + PDV) ──
function buildMockSales() {
    return [
        {
            id: sid(1), total: 71.7, paymentMethod: "pix", clientName: "Ana Oliveira", clientDeleted: false, createdAt: daysAgo(0),
            client: { name: "Ana Oliveira" },
            items: [
                { id: `${sid(1)}_i1`, productName: "Caderno Espiral 200fls", productDeleted: false, quantity: 1, price: 32.9, product: { name: "Caderno Espiral 200fls" } },
                { id: `${sid(1)}_i2`, productName: "Caneta Gel Azul 0.7", productDeleted: false, quantity: 2, price: 4.5, product: { name: "Caneta Gel Azul 0.7" } },
                { id: `${sid(1)}_i3`, productName: "Papel Sulfite A4 (500fls)", productDeleted: false, quantity: 1, price: 28.9, product: { name: "Papel Sulfite A4 (500fls)" } },
            ],
        },
        {
            id: sid(2), total: 45.0, paymentMethod: "cartao", clientName: "Lucia Ferreira", clientDeleted: false, createdAt: daysAgo(1),
            client: { name: "Lucia Ferreira" },
            items: [
                { id: `${sid(2)}_i1`, productName: "Agenda 2026", productDeleted: false, quantity: 1, price: 45.0, product: { name: "Agenda 2026" } },
            ],
        },
        {
            id: sid(3), total: 25.3, paymentMethod: "dinheiro", clientName: null, clientDeleted: false, createdAt: daysAgo(2),
            client: null,
            items: [
                { id: `${sid(3)}_i1`, productName: "Lápis Grafite HB (cx 12)", productDeleted: false, quantity: 1, price: 15.9, product: { name: "Lápis Grafite HB (cx 12)" } },
                { id: `${sid(3)}_i2`, productName: "Borracha Branca Macia", productDeleted: false, quantity: 2, price: 2.5, product: { name: "Borracha Branca Macia" } },
                { id: `${sid(3)}_i3`, productName: "Régua 30cm Transparente", productDeleted: false, quantity: 1, price: 3.9, product: { name: "Régua 30cm Transparente" } },
            ],
        },
        {
            id: sid(4), total: 56.7, paymentMethod: "pix", clientName: "Maria Silva", clientDeleted: false, createdAt: daysAgo(3),
            client: { name: "Maria Silva" },
            items: [
                { id: `${sid(4)}_i1`, productName: "Marca-texto Amarelo", productDeleted: false, quantity: 3, price: 5.9, product: { name: "Marca-texto Amarelo" } },
                { id: `${sid(4)}_i2`, productName: "Estojo Escolar Básico", productDeleted: false, quantity: 1, price: 19.9, product: { name: "Estojo Escolar Básico" } },
                { id: `${sid(4)}_i3`, productName: "Fita Adesiva Transparente", productDeleted: false, quantity: 3, price: 6.5, product: { name: "Fita Adesiva Transparente" } },
            ],
        },
        {
            id: sid(5), total: 37.8, paymentMethod: "cartao", clientName: "João Santos", clientDeleted: false, createdAt: daysAgo(5),
            client: { name: "João Santos" },
            items: [
                { id: `${sid(5)}_i1`, productName: "Caderno Espiral 200fls", productDeleted: false, quantity: 1, price: 32.9, product: { name: "Caderno Espiral 200fls" } },
                { id: `${sid(5)}_i2`, productName: "Caneta Gel Azul 0.7", productDeleted: false, quantity: 1, price: 4.5, product: { name: "Caneta Gel Azul 0.7" } },
            ],
        },
    ];
}

export const MOCK_RECENT_SALES = buildMockSales();

// ── Dashboard ──
export function getMockDashboardData() {
    const lowStock = MOCK_PRODUCTS.filter((p) => p.stock <= p.minStock);
    return {
        revenue: 3248.5,
        totalSales: 47,
        avgTicket: 69.12,
        newClients: 3,
        lowStock,
        recentSales: MOCK_RECENT_SALES.slice(0, 5),
    };
}

// ── Reports ──
export function getMockReportsData() {
    const dailyRevenue = Array.from({ length: 30 }, (_, i) => {
        const d = daysAgo(29 - i);
        const revenue = Math.round((40 + Math.random() * 180) * 100) / 100;
        const cost = Math.round(revenue * 0.45 * 100) / 100;
        return { date: d.toISOString().split("T")[0], revenue, cost };
    });

    return {
        kpis: { revenue: 3248.5, sales: 47, avgTicket: 69.12, clients: 5 },
        dailyRevenue,
        salesByCategory: [
            { category: "Cadernos", count: 18 },
            { category: "Canetas", count: 14 },
            { category: "Papéis", count: 9 },
            { category: "Acessórios", count: 8 },
            { category: "Lápis", count: 6 },
            { category: "Colas", count: 4 },
            { category: "Borrachas", count: 3 },
        ],
        paymentMethods: [
            { method: "pix", count: 22 },
            { method: "cartao", count: 16 },
            { method: "dinheiro", count: 9 },
        ],
        topProducts: [
            { name: "Caderno Espiral 200fls", quantity: 24, revenue: 789.6 },
            { name: "Papel Sulfite A4 (500fls)", quantity: 18, revenue: 520.2 },
            { name: "Caneta Gel Azul 0.7", quantity: 45, revenue: 202.5 },
            { name: "Agenda 2026", quantity: 8, revenue: 360.0 },
            { name: "Marca-texto Amarelo", quantity: 22, revenue: 129.8 },
        ],
    };
}
