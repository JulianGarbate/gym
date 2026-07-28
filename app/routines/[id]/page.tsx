import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { removeRoutineItem } from "@/app/actions/routines";
import AddExerciseToRoutine from "@/components/AddExerciseToRoutine";
import StartWorkoutButton from "@/components/StartWorkoutButton";
import { Trash2 } from "lucide-react";

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
      <PageHeader title={routine.name} subtitle={routine.description ?? undefined} />
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
                {item.targetSets} series objetivo
              </p>
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
