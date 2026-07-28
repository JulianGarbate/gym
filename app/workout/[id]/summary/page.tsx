import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Dumbbell, Flame, Home, Trophy } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { estimateCaloriesBurned } from "@/lib/calories";
import SendToDailyCalButton from "@/components/SendToDailyCalButton";

export default async function WorkoutSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [workout, user] = await Promise.all([
    prisma.workout.findUnique({
      where: { id },
      include: {
        sets: { include: { exercise: true }, orderBy: { createdAt: "asc" } },
      },
    }),
    getCurrentUser(),
  ]);

  if (!workout) notFound();

  const durationMs =
    (workout.endTime ?? workout.startTime).getTime() -
    workout.startTime.getTime();
  const durationMin = Math.max(1, Math.round(durationMs / 60000));

  const totalVolume = workout.sets.reduce(
    (sum, s) => sum + s.weight * s.reps,
    0
  );

  const calories = user.weightKg
    ? estimateCaloriesBurned(user.weightKg, durationMin)
    : null;

  const exerciseIds = Array.from(new Set(workout.sets.map((s) => s.exerciseId)));

  const priorBests = await prisma.workoutSet.findMany({
    where: {
      exerciseId: { in: exerciseIds },
      workout: { userId: workout.userId, id: { not: workout.id } },
    },
    select: { exerciseId: true, weight: true },
  });

  const priorMaxByExercise: Record<string, number> = {};
  for (const s of priorBests) {
    priorMaxByExercise[s.exerciseId] = Math.max(
      priorMaxByExercise[s.exerciseId] ?? 0,
      s.weight
    );
  }

  const byExercise = new Map<
    string,
    { name: string; sets: typeof workout.sets; maxWeight: number }
  >();
  for (const s of workout.sets) {
    const entry = byExercise.get(s.exerciseId) ?? {
      name: s.exercise.name,
      sets: [],
      maxWeight: 0,
    };
    entry.sets.push(s);
    entry.maxWeight = Math.max(entry.maxWeight, s.weight);
    byExercise.set(s.exerciseId, entry);
  }

  const exerciseSummaries = Array.from(byExercise.entries()).map(
    ([exerciseId, data]) => ({
      exerciseId,
      ...data,
      isPr:
        data.maxWeight > 0 &&
        data.maxWeight > (priorMaxByExercise[exerciseId] ?? 0),
    })
  );

  const prCount = exerciseSummaries.filter((e) => e.isPr).length;

  return (
    <div className="px-5 pb-24 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Trophy size={30} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {workout.name}
        </h1>
        <p className="mt-1 text-sm text-muted">Entrenamiento completado</p>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl border border-border bg-surface p-3 text-center">
          <Clock className="mx-auto mb-1 text-accent" size={18} />
          <p className="text-lg font-bold text-foreground">{durationMin}</p>
          <p className="text-xs text-muted">minutos</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-3 text-center">
          <Dumbbell className="mx-auto mb-1 text-accent" size={18} />
          <p className="text-lg font-bold text-foreground">
            {Math.round(totalVolume).toLocaleString("es-AR")}
          </p>
          <p className="text-xs text-muted">kg volumen</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-3 text-center">
          <Trophy className="mx-auto mb-1 text-accent" size={18} />
          <p className="text-lg font-bold text-foreground">{prCount}</p>
          <p className="text-xs text-muted">PRs</p>
        </div>
      </div>

      {calories !== null ? (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Flame size={20} />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-foreground">
              ~{calories} kcal
            </p>
            <p className="text-xs text-muted">
              Se sincroniza con Daily Cal automáticamente
            </p>
          </div>
          <SendToDailyCalButton workoutId={workout.id} calories={calories} />
        </div>
      ) : (
        <Link
          href="/profile"
          className="mb-6 block rounded-2xl border border-dashed border-border p-4 text-center transition-colors active:bg-surface"
        >
          <p className="text-sm text-muted">
            Cargá tu peso en{" "}
            <span className="font-medium text-accent">tu perfil</span> para
            ver las calorías estimadas de este entrenamiento
          </p>
        </Link>
      )}

      <div className="space-y-2.5">
        {exerciseSummaries.map((e) => (
          <div
            key={e.exerciseId}
            className="rounded-2xl border border-border bg-surface px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-foreground">{e.name}</p>
              {e.isPr && (
                <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                  <Trophy size={12} />
                  PR
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">
              {e.sets.length} serie{e.sets.length !== 1 ? "s" : ""} · máx{" "}
              {e.maxWeight}kg
            </p>
          </div>
        ))}
        {exerciseSummaries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-8 text-center">
            <p className="text-sm text-muted">
              No se registraron series en este entrenamiento.
            </p>
          </div>
        )}
      </div>

      <Link
        href="/"
        className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-accent font-semibold text-accent-foreground transition-transform active:scale-[0.98]"
      >
        <Home size={19} />
        Volver al inicio
      </Link>
    </div>
  );
}
