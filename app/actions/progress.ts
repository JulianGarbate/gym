"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export interface ProgressPoint {
  date: string;
  maxWeight: number;
  volume: number;
}

export async function getExerciseProgress(
  exerciseId: string
): Promise<ProgressPoint[]> {
  const user = await getCurrentUser();

  const sets = await prisma.workoutSet.findMany({
    where: { exerciseId, workout: { userId: user.id } },
    include: { workout: { select: { startTime: true } } },
    orderBy: { createdAt: "asc" },
  });

  const byWorkoutDate = new Map<string, ProgressPoint>();
  for (const s of sets) {
    const key = s.workout.startTime.toISOString().slice(0, 10);
    const point = byWorkoutDate.get(key) ?? {
      date: key,
      maxWeight: 0,
      volume: 0,
    };
    point.maxWeight = Math.max(point.maxWeight, s.weight);
    point.volume += s.weight * s.reps;
    byWorkoutDate.set(key, point);
  }

  return Array.from(byWorkoutDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}
