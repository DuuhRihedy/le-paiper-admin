import { Metadata } from "next";
import { requireAuth } from "@/lib/auth-guard";
import { getReportsData } from "@/lib/actions/reports";
import { RelatoriosClient } from "./relatorios-client";

export const metadata: Metadata = {
    title: "Relatórios | Le Paiper Admin",
    description: "Relatórios de vendas, receita e análises da papelaria Le Paiper",
};


export default async function RelatoriosPage() {
    await requireAuth();
    const data = await getReportsData();
    return <RelatoriosClient data={data} />;
}
