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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-widest text-white/90">
            JSTN
          </Link>

          {/* Desktop */}
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
                      ? "rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/90 hover:border-white/40"
                      : `text-sm ${
                          active ? "font-semibold text-white" : "text-white/70 hover:text-white"
                        }`
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile */}
        <nav className="-mx-2 flex gap-4 overflow-x-auto whitespace-nowrap px-2 pb-3 text-sm md:hidden">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "text-white" : "text-white/70 hover:text-white"}
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
