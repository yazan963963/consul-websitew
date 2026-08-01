import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold)", { variants: { variant: { default: "bg-(--color-gold) text-(--color-ink) hover:opacity-90", outline: "border border-(--color-line) bg-transparent text-(--color-ivory) hover:bg-(--color-surface-2)", ghost: "text-(--color-bone) hover:bg-(--color-surface-2) hover:text-(--color-ivory)", destructive: "bg-red-500/15 text-red-400 hover:bg-red-500/25" }, size: { default: "h-10 px-4", sm: "h-8 px-3 text-xs", icon: "size-10" } }, defaultVariants: { variant: "default", size: "default" } });
export function Button({ className, variant, size, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) { return <button className={cn(buttonVariants({variant,size}),className)} {...props} />; }
export { buttonVariants };
