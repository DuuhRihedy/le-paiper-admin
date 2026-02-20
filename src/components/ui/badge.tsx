import * as React from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "mint" | "sky" | "purple" | "pink" | "default";

const variantStyles: Record<BadgeVariant, string> = {
    mint: "bg-brand-mint/30 text-emerald-700 dark:text-emerald-400 border-brand-mint/50",
    sky: "bg-brand-sky/30 text-blue-700 dark:text-blue-400 border-brand-sky/50",
    purple: "bg-brand-lilac/20 text-brand-purple border-brand-lilac/40",
    pink: "bg-brand-pink/20 text-pink-700 dark:text-pink-400 border-brand-pink/40",
    default: "bg-brand-light-gray text-foreground/70 border-foreground/10",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                variantStyles[variant],
                className
            )}
            {...props}
        />
    );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
