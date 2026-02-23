"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";
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
    await requireAuth();
    const validated = settingSchema.parse({ key, value });
    await db.setting.upsert({
        where: { key: validated.key },
        update: { value: validated.value },
        create: { key: validated.key, value: validated.value },
    });
    revalidatePath("/configuracoes");
}

export async function updateSettings(entries: { key: string; value: string }[]) {
    await requireAuth();
    const validated = z.array(settingSchema).parse(entries);
    for (const entry of validated) {
        await db.setting.upsert({
            where: { key: entry.key },
            update: { value: entry.value },
            create: { key: entry.key, value: entry.value },
        });
    }
    revalidatePath("/configuracoes");
}
