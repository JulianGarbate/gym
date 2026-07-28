import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  duplicateRoutine,
  moveRoutineItem,
  removeRoutineItem,
} from "@/app/actions/routines";
import AddExerciseToRoutine from "@/components/AddExerciseToRoutine";
import StartWorkoutButton from "@/components/StartWorkoutButton";
import ExerciseDetailModal from "@/components/ExerciseDetailModal";
import { ChevronDown, ChevronUp, Copy, Info, Trash2 } from "lucide-react";

export default async function RoutineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const routine = await prisma.routine.findUnique({
    where: { id },
    include: {
      items: {
        include: { exercise: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!routine) notFound();

  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-start justify-between gap-3 px-5 pb-0 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
            {routine.name}
          </h1>
          {routine.description && (
            <p className="mt-1 text-sm text-muted">{routine.description}</p>
          )}
        </div>
        <form action={duplicateRoutine.bind(null, routine.id)}>
          <button
            type="submit"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted active:bg-surface-2"
            aria-label="Duplicar rutina"
            title="Duplicar rutina"
          >
            <Copy size={16} />
          </button>
        </form>
      </div>
      <div className="h-4" />

      <div className="px-5 py-5 space-y-2.5">
        <StartWorkoutButton routineId={routine.id} routineName={routine.name} />

        {routine.items.map((item, i) => (
          <div
            key={item.id}
            className="flex min-h-[60px] items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-muted">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">
                {item.exercise.name}
              </p>
              <p className="text-sm text-muted">
                {item.targetSets} series
                {item.targetRepsMin && item.targetRepsMax
                  ? ` · ${item.targetRepsMin}-${item.targetRepsMax} reps`
                  : ""}
              </p>
            </div>
            <ExerciseDetailModal
              exercise={item.exercise}
              triggerClassName="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors active:bg-surface-2 active:text-foreground"
              triggerLabel="Ver información del ejercicio"
              trigger={<Info size={17} />}
            />
            <div className="flex shrink-0 flex-col">
              <form action={moveRoutineItem.bind(null, routine.id, item.id, "up")}>
                <button
                  type="submit"
                  disabled={i === 0}
                  className="flex h-6 w-8 items-center justify-center text-muted disabled:opacity-20"
                  aria-label="Subir"
                >
                  <ChevronUp size={16} />
                </button>
              </form>
              <form
                action={moveRoutineItem.bind(null, routine.id, item.id, "down")}
              >
                <button
                  type="submit"
                  disabled={i === routine.items.length - 1}
                  className="flex h-6 w-8 items-center justify-center text-muted disabled:opacity-20"
                  aria-label="Bajar"
                >
                  <ChevronDown size={16} />
                </button>
              </form>
            </div>
            <form action={removeRoutineItem.bind(null, routine.id, item.id)}>
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors active:bg-surface-2 active:text-foreground"
                aria-label="Quitar ejercicio"
              >
                <Trash2 size={17} />
              </button>
            </form>
          </div>
        ))}

        {routine.items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-8 text-center">
            <p className="text-sm text-muted">
              Agregá ejercicios a esta rutina.
            </p>
          </div>
        )}

        <AddExerciseToRoutine routineId={routine.id} exercises={exercises} />
      </div>
    </div>
  );
}
