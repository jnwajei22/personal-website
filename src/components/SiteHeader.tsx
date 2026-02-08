"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Now", href: "/now" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Brand = Home */}
        <Link href="/" className="text-sm font-semibold tracking-tight">
          JSTN
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            const isContact = item.href === "/contact";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isContact
                    ? "rounded-full border border-black/15 px-4 py-2 text-sm font-medium hover:border-black/30 dark:border-white/20 dark:hover:border-white/40"
                    : `text-sm ${active ? "font-semibold" : "text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white"}`
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
