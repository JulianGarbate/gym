"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { estimateCardioCalories } from "@/lib/calories";
import {
  deleteWorkoutFromDailyCal,
  syncWorkoutToDailyCal,
} from "@/app/actions/dailyCal";
import { revalidatePath } from "next/cache";

export interface LogCardioState {
  ok: boolean;
  error?: string;
}

export async function logCardio(
  _prevState: LogCardioState,
  formData: FormData
): Promise<LogCardioState> {
  const user = await getCurrentUser();

  const activityType = String(formData.get("activityType") || "");
  const durationMin = parseInt(String(formData.get("durationMin") || ""), 10);

  if (!activityType || !Number.isFinite(durationMin) || durationMin <= 0) {
    return { ok: false, error: "Completá la actividad y la duración." };
  }

  if (!user.weightKg) {
    return {
      ok: false,
      error: "Cargá tu peso en tu perfil para poder estimar las calorías.",
    };
  }

  try {
    const caloriesBurned = estimateCardioCalories(
      activityType,
      user.weightKg,
      durationMin
    );

    const session = await prisma.cardioSession.create({
      data: { userId: user.id, activityType, durationMin, caloriesBurned },
    });

    try {
      await syncWorkoutToDailyCal(
        session.id,
        caloriesBurned,
        session.date.toISOString()
      );
    } catch (err) {
      console.error("Daily Cal sync failed for cardio session", err);
    }

    revalidatePath("/cardio");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.error("Failed to log cardio session", err);
    return { ok: false, error: "No se pudo guardar la actividad." };
  }
}

export async function deleteCardioSession(id: string) {
  await prisma.cardioSession.delete({ where: { id } });

  try {
    await deleteWorkoutFromDailyCal(id);
  } catch (err) {
    console.error("Daily Cal delete failed for cardio session", err);
  }

  revalidatePath("/cardio");
  revalidatePath("/");
}
