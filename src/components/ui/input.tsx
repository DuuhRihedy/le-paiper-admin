import * as React from "react";
import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-2xl border border-border-glass bg-surface px-4 py-2 text-sm text-foreground",
                    "placeholder:text-foreground/40",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "transition-all duration-200",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
