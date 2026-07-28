"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function startWorkout(routineId: string | null, name: string) {
  const user = await getCurrentUser();

  const workout = await prisma.workout.create({
    data: {
      userId: user.id,
      routineId: routineId || null,
      name,
    },
  });

  redirect(`/workout/${workout.id}`);
}

export async function logSet(
  workoutId: string,
  exerciseId: string,
  weight: number,
  reps: number,
  rpe: number | null
) {
  await prisma.workoutSet.create({
    data: {
      workoutId,
      exerciseId,
      weight,
      reps,
      rpe: rpe ?? null,
    },
  });
  revalidatePath(`/workout/${workoutId}`);
}

export async function updateSet(
  workoutId: string,
  setId: string,
  weight: number,
  reps: number,
  rpe: number | null,
  notes: string | null
) {
  await prisma.workoutSet.update({
    where: { id: setId },
    data: { weight, reps, rpe: rpe ?? null, notes: notes || null },
  });
  revalidatePath(`/workout/${workoutId}`);
}

export async function deleteSet(workoutId: string, setId: string) {
  await prisma.workoutSet.delete({ where: { id: setId } });
  revalidatePath(`/workout/${workoutId}`);
}

export async function updateWorkoutNotes(workoutId: string, notes: string) {
  await prisma.workout.update({
    where: { id: workoutId },
    data: { notes: notes || null },
  });
  revalidatePath(`/workout/${workoutId}`);
}

export async function finishWorkout(workoutId: string) {
  await prisma.workout.update({
    where: { id: workoutId },
    data: { endTime: new Date() },
  });
  revalidatePath(`/workout/${workoutId}`);
  redirect(`/workout/${workoutId}/summary`);
}

export async function getLastSetForExercise(exerciseId: string) {
  const user = await getCurrentUser();
  return prisma.workoutSet.findFirst({
    where: { exerciseId, workout: { userId: user.id } },
    orderBy: { createdAt: "desc" },
  });
}
