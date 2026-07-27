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
      className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 font-semibold text-gray-950 active:bg-cyan-400 disabled:opacity-60"
    >
      <Play size={20} />
      {pending ? "Iniciando..." : "Empezar entrenamiento"}
    </button>
  );
}
