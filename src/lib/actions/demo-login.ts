"use server";

import { signIn } from "@/lib/auth";

/**
 * Server-side demo login — credentials never leave the server.
 * Returns { success: true } or { error: string }.
 */
export async function demoLogin(): Promise<{ success?: boolean; error?: string }> {
    try {
        await signIn("credentials", {
            email: "demo@lepaiper.com",
            password: "demo123",
            redirect: false,
        });
        return { success: true };
    } catch {
        return { error: "Erro ao entrar no modo demo." };
    }
}
