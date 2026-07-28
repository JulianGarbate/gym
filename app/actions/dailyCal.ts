"use server";

const DAILY_CAL_URL = "https://daily-cal-three.vercel.app/api/exercise-log";

export interface DailyCalResult {
  ok: boolean;
  error?: string;
}

/**
 * Creates or updates a Daily Cal exercise-log entry. Passing the same
 * externalId (the workout's own id) on a later call updates that entry
 * instead of creating a duplicate.
 */
export async function syncWorkoutToDailyCal(
  workoutId: string,
  caloriesBurned: number,
  date?: string
): Promise<DailyCalResult> {
  const token = process.env.EXERCISE_API_TOKEN;
  if (!token) {
    return { ok: false, error: "EXERCISE_API_TOKEN no está configurado." };
  }

  try {
    const res = await fetch(DAILY_CAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caloriesBurned,
        source: "Gym Tracker",
        externalId: workoutId,
        ...(date ? { date } : {}),
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `Daily Cal respondió ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("Failed to sync workout to Daily Cal", err);
    return { ok: false, error: "No se pudo conectar con Daily Cal." };
  }
}

/**
 * Removes a workout's exercise-log entry from Daily Cal. Best-effort: a
 * failure here should never block deleting the workout in this app.
 */
export async function deleteWorkoutFromDailyCal(
  workoutId: string
): Promise<DailyCalResult> {
  const token = process.env.EXERCISE_API_TOKEN;
  if (!token) return { ok: false, error: "EXERCISE_API_TOKEN no está configurado." };

  try {
    const res = await fetch(
      `${DAILY_CAL_URL}?externalId=${encodeURIComponent(workoutId)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok && res.status !== 404) {
      return { ok: false, error: `Daily Cal respondió ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("Failed to delete workout from Daily Cal", err);
    return { ok: false, error: "No se pudo conectar con Daily Cal." };
  }
}
