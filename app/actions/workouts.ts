"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { estimateCaloriesBurned } from "@/lib/calories";
import {
  deleteWorkoutFromDailyCal,
  syncWorkoutToDailyCal,
} from "@/app/actions/dailyCal";
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

/**
 * Best-effort: if the workout has already been finished, recompute its
 * estimated calories and resend them to Daily Cal so edits made after
 * finishing (adding/editing/deleting a set) stay reflected there.
 * Failures are logged and swallowed — never blocks the caller.
 */
async function resyncDailyCalIfFinished(workoutId: string) {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: { user: true },
    });
    if (!workout || !workout.endTime || !workout.user.weightKg) return;

    const durationMin = Math.max(
      1,
      Math.round(
        (workout.endTime.getTime() - workout.startTime.getTime()) / 60000
      )
    );
    const calories = estimateCaloriesBurned(workout.user.weightKg, durationMin);
    await syncWorkoutToDailyCal(workout.id, calories, workout.startTime.toISOString());
  } catch (err) {
    console.error("Daily Cal resync failed", err);
  }
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
  await resyncDailyCalIfFinished(workoutId);
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
  await resyncDailyCalIfFinished(workoutId);
  revalidatePath(`/workout/${workoutId}`);
}

export async function deleteSet(workoutId: string, setId: string) {
  await prisma.workoutSet.delete({ where: { id: setId } });
  await resyncDailyCalIfFinished(workoutId);
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
  const workout = await prisma.workout.update({
    where: { id: workoutId },
    data: { endTime: new Date() },
    include: { user: true },
  });

  // Best-effort: syncing to Daily Cal should never block finishing the
  // workout in this app, so any failure here is swallowed.
  try {
    if (workout.user.weightKg) {
      const durationMin = Math.max(
        1,
        Math.round(
          (workout.endTime!.getTime() - workout.startTime.getTime()) / 60000
        )
      );
      const calories = estimateCaloriesBurned(workout.user.weightKg, durationMin);
      await syncWorkoutToDailyCal(workout.id, calories, workout.startTime.toISOString());
    }
  } catch (err) {
    console.error("Daily Cal sync failed on finishWorkout", err);
  }

  revalidatePath(`/workout/${workoutId}`);
  redirect(`/workout/${workoutId}/summary`);
}

export async function deleteWorkout(workoutId: string) {
  await prisma.workout.delete({ where: { id: workoutId } });

  // Best-effort: don't let a Daily Cal hiccup block deleting the workout.
  try {
    await deleteWorkoutFromDailyCal(workoutId);
  } catch (err) {
    console.error("Daily Cal delete failed", err);
  }

  revalidatePath("/");
  redirect("/");
}

export async function getLastSetForExercise(exerciseId: string) {
  const user = await getCurrentUser();
  return prisma.workoutSet.findFirst({
    where: { exerciseId, workout: { userId: user.id } },
    orderBy: { createdAt: "desc" },
  });
}
