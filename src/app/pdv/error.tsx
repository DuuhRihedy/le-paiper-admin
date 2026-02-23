"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PdvError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-4 text-center"
            >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                    Erro no PDV
                </h2>
                <p className="max-w-md text-sm text-foreground/60">
                    Não foi possível carregar o ponto de venda. Tente novamente.
                </p>
            </motion.div>
            <Button onClick={reset} variant="default" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Tentar novamente
            </Button>
        </div>
    );
}
