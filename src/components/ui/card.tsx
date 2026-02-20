import * as React from "react";
import { cn } from "@/lib/cn";

/* ─── Card Root ─── */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = false, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "glass",
                hover && "transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-md hover:brightness-105",
                className
            )}
            {...props}
        />
    )
);
Card.displayName = "Card";

/* ─── Card Header ─── */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col gap-1.5 p-6 pb-3", className)} {...props} />
    )
);
CardHeader.displayName = "CardHeader";

/* ─── Card Title ─── */
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn("text-lg font-semibold tracking-tight", className)} {...props} />
    )
);
CardTitle.displayName = "CardTitle";

/* ─── Card Description ─── */
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-sm text-foreground/60", className)} {...props} />
    )
);
CardDescription.displayName = "CardDescription";

/* ─── Card Content ─── */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
