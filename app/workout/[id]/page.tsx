import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ActiveWorkout from "@/components/ActiveWorkout";

export default async function WorkoutSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
      routine: { include: { items: { include: { exercise: true }, orderBy: { order: "asc" } } } },
      sets: { include: { exercise: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!workout) notFound();

  const allExercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
  });

  const exerciseIds = new Set<string>();
  workout.routine?.items.forEach((i) => exerciseIds.add(i.exerciseId));
  workout.sets.forEach((s) => exerciseIds.add(s.exerciseId));

  const exercisesInWorkout = allExercises.filter((e) => exerciseIds.has(e.id));

  const lastSets = await prisma.workoutSet.findMany({
    where: {
      workoutId: { not: workout.id },
      workout: { userId: workout.userId },
      exerciseId: { in: Array.from(exerciseIds) },
    },
    orderBy: { createdAt: "desc" },
  });

  const lastSetByExercise: Record<
    string,
    { weight: number; reps: number; rpe: number | null }
  > = {};
  for (const s of lastSets) {
    if (!lastSetByExercise[s.exerciseId]) {
      lastSetByExercise[s.exerciseId] = {
        weight: s.weight,
        reps: s.reps,
        rpe: s.rpe,
      };
    }
  }

  return (
    <div>
      <PageHeader
        title={workout.name}
        subtitle={workout.endTime ? "Entrenamiento finalizado" : "Entrenamiento en curso"}
      />
      <ActiveWorkout
        workoutId={workout.id}
        exercisesInWorkout={exercisesInWorkout}
        allExercises={allExercises}
        loggedSets={workout.sets}
        lastSetByExercise={lastSetByExercise}
        isFinished={!!workout.endTime}
        initialNotes={workout.notes}
      />
    </div>
  );
}
