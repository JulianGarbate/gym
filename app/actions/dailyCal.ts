"use server";

const DAILY_CAL_URL = "https://daily-cal-three.vercel.app/api/exercise-log";

export async function sendCaloriesToDailyCal(
  caloriesBurned: number,
  date?: string
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.DAILY_CAL_API_TOKEN;
  if (!token) {
    return { ok: false, error: "DAILY_CAL_API_TOKEN no está configurado." };
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
        ...(date ? { date } : {}),
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `Daily Cal respondió ${res.status}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo conectar con Daily Cal." };
  }
}
