import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";

// In-memory rate limiter (per-instance; use Redis for multi-instance)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(email: string): boolean {
    const now = Date.now();
    const entry = loginAttempts.get(email);
    if (!entry || now > entry.resetAt) {
        loginAttempts.set(email, { count: 1, resetAt: now + WINDOW_MS });
        return true;
    }
    entry.count++;
    return entry.count <= MAX_ATTEMPTS;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const email = credentials?.email as string;
                    const password = credentials?.password as string;
                    if (!email || !password) return null;

                    // Rate limit: max 5 attempts per email per 15 min
                    if (!checkRateLimit(email.toLowerCase())) {
                        console.warn(`[AUTH] Rate limited: ${email}`);
                        return null;
                    }

                    // Case-insensitive email lookup
                    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
                    if (!user) {
                        // Timing-safe: delay even on invalid email
                        await new Promise((r) => setTimeout(r, 800));
                        return null;
                    }

                    // Fixed delay to slow down brute force
                    await new Promise((r) => setTimeout(r, 800));
                    const isValid = await compare(password, user.password);
                    if (!isValid) return null;

                    // Clear rate limit on successful login
                    loginAttempts.delete(email.toLowerCase());
                    return { id: user.id, name: user.name, email: user.email, role: user.role };
                } catch (error) {
                    console.error("[AUTH] Authorize error:", error);
                    return null;
                }
            },
        }),
    ],
    session: { strategy: "jwt", maxAge: 8 * 60 * 60 }, // 8 hours
    pages: { signIn: "/login" },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: string }).role;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                (session.user as { role?: string }).role = token.role as string;
            }
            return session;
        },
    },
});
