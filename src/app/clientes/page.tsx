import { Metadata } from "next";
import { requireAuth } from "@/lib/auth-guard";
import { getClients } from "@/lib/actions/clients";
import { ClientesClient } from "./clientes-client";

export const metadata: Metadata = {
    title: "Clientes | Le Paiper Admin",
    description: "Gerenciamento de clientes e programa de fidelidade Le Paiper",
};


export default async function ClientesPage() {
    await requireAuth();
    const clients = await getClients();
    return <ClientesClient clients={clients} />;
}
