"use client";

import { useTransition } from "react";
import { Play } from "lucide-react";
import { startWorkout } from "@/app/actions/workouts";

export default function StartWorkoutButton({
  routineId,
  routineName,
}: {
  routineId: string;
  routineName: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(() => startWorkout(routineId, routineName))
      }
      className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-accent font-semibold text-accent-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
    >
      <Play size={19} className="fill-current" />
      {pending ? "Iniciando..." : "Empezar entrenamiento"}
    </button>
  );
}
