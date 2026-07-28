// MET (Metabolic Equivalent of Task) for resistance/strength training,
// vigorous effort — a reasonable fixed estimate since we don't track heart rate.
const STRENGTH_TRAINING_MET = 5;

export function estimateCaloriesBurned(
  weightKg: number,
  durationMinutes: number
): number {
  const hours = durationMinutes / 60;
  return Math.round(STRENGTH_TRAINING_MET * weightKg * hours);
}

// MET values for common cardio activities / sports (Compendium of Physical
// Activities, moderate-vigorous effort estimates).
export const CARDIO_ACTIVITIES = [
  { id: "futbol", label: "Fútbol", met: 7.0 },
  { id: "running", label: "Running", met: 8.3 },
  { id: "ciclismo", label: "Ciclismo", met: 7.5 },
  { id: "natacion", label: "Natación", met: 6.0 },
  { id: "basquet", label: "Básquet", met: 6.5 },
  { id: "tenis", label: "Tenis", met: 7.3 },
  { id: "padel", label: "Pádel", met: 6.0 },
  { id: "caminata", label: "Caminata rápida", met: 4.3 },
  { id: "elíptico", label: "Elíptico", met: 5.0 },
  { id: "otro", label: "Otro", met: 6.0 },
] as const;

export type CardioActivityId = (typeof CARDIO_ACTIVITIES)[number]["id"];

export function getCardioActivity(id: string) {
  return CARDIO_ACTIVITIES.find((a) => a.id === id) ?? CARDIO_ACTIVITIES[CARDIO_ACTIVITIES.length - 1];
}

export function estimateCardioCalories(
  activityId: string,
  weightKg: number,
  durationMinutes: number
): number {
  const { met } = getCardioActivity(activityId);
  const hours = durationMinutes / 60;
  return Math.round(met * weightKg * hours);
}
