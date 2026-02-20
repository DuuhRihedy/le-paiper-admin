import { requireAuth } from "@/lib/auth-guard";
import { getProducts } from "@/lib/actions/products";
import { getClients } from "@/lib/actions/clients";
import { PdvClient } from "./pdv-client";

export default async function PdvPage() {
    await requireAuth();
    const [products, clients] = await Promise.all([getProducts(), getClients()]);
    return <PdvClient products={products} clients={clients} />;
}
