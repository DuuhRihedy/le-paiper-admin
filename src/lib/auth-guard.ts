"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const VALID_ROLES = ["admin", "viewer"] as const;
type Role = (typeof VALID_ROLES)[number];

function parseRole(raw: unknown): Role {
    if (typeof raw === "string" && VALID_ROLES.includes(raw as Role)) {
        return raw as Role;
    }
    return "viewer"; // Unknown roles default to read-only for safety
}

export async function requireAuth() {
    const session = await auth();
    if (!session?.user) redirect("/login");
    return session;
}

export async function requireAdmin() {
    const session = await requireAuth();
    const role = parseRole((session.user as { role?: string }).role);
    if (role !== "admin") {
        throw new Error("Acesso negado: permissão insuficiente");
    }
    return session;
}

export async function getUserRole(): Promise<Role | null> {
    const session = await auth();
    if (!session?.user) return null;
    return parseRole((session.user as { role?: string }).role);
}
