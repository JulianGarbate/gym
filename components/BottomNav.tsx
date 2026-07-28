"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Home, ListChecks, Play } from "lucide-react";

const items = [
  { href: "/", icon: Home },
  { href: "/exercises", icon: Dumbbell },
  { href: "/routines", icon: ListChecks },
  { href: "/workout", icon: Play },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <ul className="mx-auto flex max-w-md items-stretch justify-between pb-[env(safe-area-inset-bottom)]">
        {items.map(({ href, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex min-h-[52px] items-center justify-center py-3"
              >
                <Icon
                  size={26}
                  strokeWidth={active ? 2.3 : 1.75}
                  className={`shrink-0 transition-transform duration-150 active:scale-90 ${
                    active ? "text-foreground" : "text-muted"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
