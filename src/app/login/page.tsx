"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Email ou senha incorretos.");
            setLoading(false);
            return;
        }

        router.push("/");
        router.refresh();
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-lilac/10 via-background to-brand-sky/10 p-4">
            {/* Floating background shapes */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-brand-lilac/10 blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-brand-sky/10 blur-3xl"
                />
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full max-w-md"
            >
                <div className="glass overflow-hidden rounded-3xl border border-border-glass p-8 shadow-2xl sm:p-10">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8 flex flex-col items-center"
                    >
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink shadow-lg shadow-brand-purple/20">
                            <Package className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-brand-purple">
                            Le Paiper
                        </h1>
                        <p className="mt-1 text-sm text-foreground/50">
                            Acesse o painel administrativo
                        </p>
                    </motion.div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
                        >
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30" />
                                <input
                                    name="email"
                                    type="email"
                                    className="flex h-11 w-full rounded-2xl border border-border-glass bg-surface pl-10 pr-4 text-sm text-foreground transition-all placeholder:text-foreground/30 focus-visible:outline-2 focus-visible:outline-brand-purple"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-foreground/60">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30" />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className="flex h-11 w-full rounded-2xl border border-border-glass bg-surface pl-10 pr-12 text-sm text-foreground transition-all placeholder:text-foreground/30 focus-visible:outline-2 focus-visible:outline-brand-purple"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-foreground/30 transition-colors hover:text-foreground/60"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs text-foreground/50">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="h-4 w-4 rounded-md border-border-glass accent-brand-purple"
                                />
                                Lembrar de mim
                            </label>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-purple/80 text-sm font-semibold text-white shadow-lg shadow-brand-purple/20 transition-all hover:shadow-xl hover:shadow-brand-purple/30 disabled:opacity-70"
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                                />
                            ) : (
                                "Entrar"
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Footer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 text-center text-xs text-foreground/30"
                    >
                        © 2026 Le Paiper · Papelaria Premium
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}
