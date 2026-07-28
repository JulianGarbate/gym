import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { startWorkout } from "@/app/actions/workouts";
import { ChevronRight, ListChecks, Zap } from "lucide-react";

export default async function WorkoutStartPage() {
  const user = await getCurrentUser();
  const routines = await prisma.routine.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Entrenar" subtitle="Elegí cómo empezar" />
      <div className="px-5 py-5 space-y-2.5">
        <form
          action={async () => {
            "use server";
            await startWorkout(null, "Entrenamiento libre");
          }}
        >
          <button
            type="submit"
            className="relative flex min-h-[64px] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-accent font-semibold text-accent-foreground shadow-[0_8px_30px_-8px] shadow-accent/50 transition-transform active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
            <Zap size={20} className="relative fill-current" />
            <span className="relative">Entrenamiento libre</span>
          </button>
        </form>

        <p className="pt-3 pb-1 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
          O elegí una rutina
        </p>

        {routines.map((r) => (
          <form
            key={r.id}
            action={async () => {
              "use server";
              await startWorkout(r.id, r.name);
            }}
          >
            <button
              type="submit"
              className="flex min-h-[68px] w-full items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 text-left transition-transform active:scale-[0.98] active:bg-surface-2"
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
            </button>
          </form>
        ))}

        {routines.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-8 text-center">
            <p className="text-sm text-muted">
              No tenés rutinas todavía. Podés empezar un entrenamiento libre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
