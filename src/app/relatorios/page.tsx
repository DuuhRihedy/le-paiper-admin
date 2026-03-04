import { Metadata } from "next";
import { requireAuth, getUserRole } from "@/lib/auth-guard";
import { getReportsData } from "@/lib/actions/reports";
import { getMockReportsData } from "@/lib/mock-data";
import { serialize } from "@/lib/serialize";
import { RelatoriosClient } from "./relatorios-client";

export const metadata: Metadata = {
    title: "Relatórios | Le Paiper Admin",
    description: "Relatórios de vendas, receita e análises da papelaria Le Paiper",
};

export default async function RelatoriosPage() {
    await requireAuth();
    const role = await getUserRole();
    const isViewer = role === "viewer";
    const data = isViewer ? getMockReportsData() : serialize(await getReportsData());
    return <RelatoriosClient data={data} />;
}
