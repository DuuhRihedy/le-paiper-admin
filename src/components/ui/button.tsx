import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantStyles: Record<ButtonVariant, string> = {
    default: "bg-brand-purple text-white hover:bg-brand-purple/90 shadow-sm",
    secondary: "bg-brand-lilac/20 text-brand-purple hover:bg-brand-lilac/30",
    outline: "border border-brand-lilac/40 bg-transparent hover:bg-brand-lilac/10 text-brand-purple",
    ghost: "hover:bg-brand-lilac/10 text-brand-purple",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
    default: "h-10 px-5 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-medium transition-all duration-200 ease-out",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "active:scale-[0.97]",
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
