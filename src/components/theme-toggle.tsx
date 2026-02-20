"use client";

import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-foreground/60 transition-colors hover:bg-brand-lilac/15 hover:text-brand-purple"
            aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === "light" ? (
                    <motion.div
                        key="sun"
                        initial={{ rotate: -90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun className="h-[18px] w-[18px]" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ rotate: 90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: -90, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon className="h-[18px] w-[18px]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
