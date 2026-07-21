"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, Clock3, FileUp, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/history", label: "History", icon: Clock3 },
  { href: "/upload", label: "Upload", icon: FileUp },
  { href: "/tips", label: "Tips", icon: Lightbulb }
] as const;

export function Navigation() {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-line bg-background/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-black">
            <Sparkles size={18} />
          </span>
          Resumind AI
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Button key={href} asChild variant="ghost" className="h-10">
              <Link href={href}>
                <Icon size={16} />
                {label}
              </Link>
            </Button>
          ))}
        </nav>
        <Button asChild className="h-10">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </motion.header>
  );
}
