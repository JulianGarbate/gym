import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import PageHeader from "@/components/PageHeader";
import { ArrowRight, Dumbbell, ListChecks, Play } from "lucide-react";

export default async function Home() {
  const user = await getCurrentUser();

  const recentWorkouts = await prisma.workout.findMany({
    where: { userId: user.id, endTime: { not: null } },
    orderBy: { startTime: "desc" },
    take: 5,
    include: { sets: true },
  });

  return (
    <div>
      <PageHeader title="Gym Tracker" />
      <div className="px-5 py-5 space-y-5">
        <Link
          href="/workout"
          className="group relative flex min-h-[76px] items-center justify-center gap-2.5 overflow-hidden rounded-3xl bg-accent text-lg font-semibold text-accent-foreground shadow-[0_8px_30px_-8px] shadow-accent/50 transition-transform active:scale-[0.98]"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
          <Play size={22} className="relative fill-current" />
          <span className="relative">Empezar entrenamiento</span>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/routines"
            className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface transition-transform active:scale-[0.97] active:bg-surface-2"
          >
            <ListChecks className="text-accent" size={22} strokeWidth={1.8} />
            <span className="text-sm font-medium">Rutinas</span>
          </Link>
          <Link
            href="/exercises"
            className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-surface transition-transform active:scale-[0.97] active:bg-surface-2"
          >
            <Dumbbell className="text-accent" size={22} strokeWidth={1.8} />
            <span className="text-sm font-medium">Ejercicios</span>
          </Link>
        </div>

        <div>
          <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
            Entrenamientos recientes
          </h2>
          <div className="space-y-2.5">
            {recentWorkouts.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3.5"
              >
                <div>
                  <p className="font-medium text-foreground">{w.name}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    {new Date(w.startTime).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    · {w.sets.length} series
                  </p>
                </div>
                <ArrowRight size={16} className="text-muted" />
              </div>
            ))}
            {recentWorkouts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center">
                <p className="text-sm text-muted">
                  Todavía no completaste ningún entrenamiento.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
