"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAuth() {
    const session = await auth();
    if (!session?.user) redirect("/login");
    return session;
}

export async function requireAdmin() {
    const session = await requireAuth();
    const role = (session.user as { role?: string }).role;
    if (role === "viewer") {
        throw new Error("Acesso negado: modo demonstração (somente leitura)");
    }
    return session;
}

export async function getUserRole() {
    const session = await auth();
    if (!session?.user) return null;
    return (session.user as { role?: string }).role ?? "admin";
}
