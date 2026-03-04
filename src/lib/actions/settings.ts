"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

const settingSchema = z.object({
    key: z.string().min(1).max(100),
    value: z.string().max(5000),
});

export async function getSettings() {
    await requireAuth();
    const settings = await db.setting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
        map[s.key] = s.value;
    }
    return map;
}

export async function updateSetting(key: string, value: string) {
    await requireAdmin();
    const validated = settingSchema.parse({ key, value });
    await db.setting.upsert({
        where: { key: validated.key },
        update: { value: validated.value },
        create: { key: validated.key, value: validated.value },
    });
    revalidatePath("/configuracoes");
}

export async function updateSettings(entries: { key: string; value: string }[]) {
    await requireAdmin();
    const validated = z.array(settingSchema).parse(entries);

    // Batch upserts in a single transaction for atomicity
    await db.$transaction(
        validated.map((entry) =>
            db.setting.upsert({
                where: { key: entry.key },
                update: { value: entry.value },
                create: { key: entry.key, value: entry.value },
            })
        )
    );

    revalidatePath("/configuracoes");
}

/* ─── Change Password ─── */
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z.string().min(8, "A nova senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação é obrigatória"),
}).refine((d) => d.newPassword === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export async function changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    const session = await requireAdmin();
    const validated = changePasswordSchema.parse({ currentPassword, newPassword, confirmPassword });

    const { compare, hash } = await import("bcryptjs");

    const user = await db.user.findUnique({ where: { id: session.user?.id ?? "" } });
    if (!user) throw new Error("Usuário não encontrado");

    const isValid = await compare(validated.currentPassword, user.password);
    if (!isValid) throw new Error("Senha atual incorreta");

    const hashedPassword = await hash(validated.newPassword, 12);
    await db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });

    revalidatePath("/configuracoes");
    return { success: true };
}
