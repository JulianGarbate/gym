"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { Dumbbell, Home, ListChecks, Play } from "lucide-react";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/exercises", label: "Ejercicios", icon: Dumbbell },
  { href: "/routines", label: "Rutinas", icon: ListChecks },
  { href: "/workout", label: "Entrenar", icon: Play },
];

export default function BottomNav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);

  const activeIndex = items.findIndex(({ href }) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)
  );

  useLayoutEffect(() => {
    const list = listRef.current;
    const item = itemRefs.current[activeIndex];
    if (!list || !item) return;

    const measure = () => {
      const listRect = list.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      setIndicator({
        width: itemRect.width,
        height: itemRect.height,
        x: itemRect.left - listRect.left,
        y: itemRect.top - listRect.top,
      });
    };

    measure();

    // Re-measure once layout settles (e.g. web fonts finish loading and
    // shift label widths) and whenever the nav itself resizes.
    const raf = requestAnimationFrame(measure);
    document.fonts?.ready.then(measure).catch(() => {});

    const observer = new ResizeObserver(measure);
    observer.observe(list);

    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [activeIndex]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <ul
        ref={listRef}
        className="relative mx-auto flex max-w-md items-stretch justify-between gap-1 px-3 pb-[calc(env(safe-area-inset-bottom)+0.375rem)] pt-2"
      >
        {indicator && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 rounded-2xl bg-accent/15 transition-[transform] duration-300 ease-out"
            style={{
              width: indicator.width,
              height: indicator.height,
              transform: `translate(${indicator.x}px, ${indicator.y}px)`,
            }}
          />
        )}
        {items.map(({ href, label, icon: Icon }, i) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                href={href}
                className="group relative flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-2xl py-1.5 text-[11px] font-medium transition-colors"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
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
