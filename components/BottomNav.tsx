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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/80">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
                  active ? "text-cyan-400" : "text-gray-400 active:text-cyan-300"
                }`}
              >
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
