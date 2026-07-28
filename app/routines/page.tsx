import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import PageHeader from "@/components/PageHeader";
import { Plus, ChevronRight, ListChecks } from "lucide-react";

export default async function RoutinesPage() {
  const user = await getCurrentUser();
  const routines = await prisma.routine.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Rutinas" subtitle="Tus planes de entrenamiento" />
      <div className="px-5 py-5 space-y-2.5">
        <Link
          href="/routines/new"
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-muted font-medium transition-colors active:bg-surface"
        >
          <Plus size={19} />
          Nueva rutina
        </Link>

        {routines.map((r) => (
          <Link
            key={r.id}
            href={`/routines/${r.id}`}
            className="flex min-h-[68px] items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 transition-transform active:scale-[0.98] active:bg-surface-2"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <ListChecks size={18} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">{r.name}</p>
              <p className="text-sm text-muted">
                {r.items.length} ejercicio{r.items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <ChevronRight className="shrink-0 text-muted" size={18} />
          </Link>
        ))}

        {routines.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-10 text-center">
            <p className="text-sm text-muted">
              Todavía no creaste ninguna rutina.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
