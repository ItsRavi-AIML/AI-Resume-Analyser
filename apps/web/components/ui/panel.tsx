import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-lg p-5 transition duration-300 hover:border-white/18 hover:bg-white/[0.075]", className)} {...props} />;
}
