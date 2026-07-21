import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-md px-4 text-sm font-medium transition duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25",
        variant === "primary" && "bg-brand text-black shadow-glow hover:-translate-y-0.5 hover:bg-[#62f0c6]",
        variant === "secondary" && "border border-line bg-white/[0.08] text-white hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.12]",
        variant === "ghost" && "text-muted hover:bg-white/[0.08] hover:text-white",
        className
      )}
      {...props}
    />
  );
}
