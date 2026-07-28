"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Home, ListChecks, Play } from "lucide-react";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/exercises", label: "Ejercicios", icon: Dumbbell },
  { href: "/routines", label: "Rutinas", icon: ListChecks },
  { href: "/workout", label: "Entrenar", icon: Play },
];

export default function BottomNav() {
  const pathname = usePathname();

  const activeIndex = items.findIndex(({ href }) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <ul className="relative mx-auto flex max-w-md items-stretch justify-between gap-1 px-3 pb-[calc(env(safe-area-inset-bottom)+0.375rem)] pt-2">
        {activeIndex >= 0 && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-2 h-8 w-12 -translate-x-1/2 rounded-full bg-accent/15 transition-[left] duration-300 ease-out"
            style={{
              left: `calc(${(activeIndex + 0.5) * (100 / items.length)}% )`,
            }}
          />
        )}
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="group relative flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-2xl py-1.5 text-[11px] font-medium transition-colors"
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors duration-200 ${
                    active
                      ? "text-accent"
                      : "text-muted group-active:bg-surface-2 group-active:text-foreground"
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.4 : 1.9}
                    className="transition-transform duration-200 group-active:scale-90"
                  />
                </span>
                <span
                  className={`transition-colors duration-200 ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
