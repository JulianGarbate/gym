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
      <div className="px-4 py-4 space-y-3">
        <StartWorkoutButton routineId={routine.id} routineName={routine.name} />

        {routine.items.map((item) => (
          <div
            key={item.id}
            className="flex min-h-[56px] items-center justify-between rounded-xl border border-gray-800 bg-gray-900 px-4 py-3"
          >
            <div>
              <p className="font-semibold">{item.exercise.name}</p>
              <p className="text-sm text-gray-500">
                {item.targetSets} series objetivo
              </p>
            </div>
            <form
              action={removeRoutineItem.bind(null, routine.id, item.id)}
            >
              <button
                type="submit"
                className="flex h-11 w-11 items-center justify-center rounded-full text-gray-500 active:bg-gray-800"
                aria-label="Quitar ejercicio"
              >
                <Trash2 size={18} />
              </button>
            </form>
          </div>
        ))}

        {routine.items.length === 0 && (
          <p className="py-4 text-center text-gray-500">
            Agregá ejercicios a esta rutina.
          </p>
        )}

        <AddExerciseToRoutine routineId={routine.id} exercises={exercises} />
      </div>
    </div>
  );
}
