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
