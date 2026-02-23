import { Metadata } from "next";
import { requireAuth, getUserRole } from "@/lib/auth-guard";
import { getClients } from "@/lib/actions/clients";
import { MOCK_CLIENTS } from "@/lib/mock-data";
import { serialize } from "@/lib/serialize";
import { ClientesClient } from "./clientes-client";

export const metadata: Metadata = {
    title: "Clientes | Le Paiper Admin",
    description: "Gerenciamento de clientes e programa de fidelidade Le Paiper",
};

export default async function ClientesPage() {
    await requireAuth();
    const role = await getUserRole();
    const isViewer = role === "viewer";
    const clients = isViewer ? MOCK_CLIENTS : serialize(await getClients());
    return <ClientesClient clients={clients} role={role ?? "admin"} />;
}
