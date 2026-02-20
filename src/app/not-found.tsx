"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            {/* Animated 404 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                className="relative mb-8"
            >
                <span className="text-[120px] font-black leading-none tracking-tighter text-brand-lilac/20 sm:text-[160px]">
                    404
                </span>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-purple to-brand-pink shadow-lg shadow-brand-purple/20">
                        <Package className="h-10 w-10 text-white" />
                    </div>
                </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Página não encontrada
                </h1>
                <p className="mx-auto mt-3 max-w-md text-sm text-foreground/50">
                    Parece que esta página se perdeu entre os cadernos e canetas.
                    Verifique o endereço ou volte para o início.
                </p>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex gap-3"
            >
                <Button variant="outline" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>
                <Link href="/">
                    <Button>
                        <Home className="h-4 w-4" />
                        Início
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
