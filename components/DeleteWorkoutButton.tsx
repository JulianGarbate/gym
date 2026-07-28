"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2, X } from "lucide-react";
import { deleteWorkout } from "@/app/actions/workouts";

export default function DeleteWorkoutButton({
  workoutId,
}: {
  workoutId: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 py-1 pl-3 pr-1.5">
        <span className="text-xs font-medium text-red-400">¿Borrar?</span>
        <button
          disabled={pending}
          onClick={() => startTransition(() => deleteWorkout(workoutId))}
          className="flex h-7 items-center gap-1 rounded-full bg-red-500 px-2.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          {pending ? <Loader2 size={13} className="animate-spin" /> : "Sí"}
        </button>
        <button
          disabled={pending}
          onClick={() => setConfirming(false)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted"
          aria-label="Cancelar"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors active:bg-surface-2"
      aria-label="Eliminar entrenamiento"
      title="Eliminar entrenamiento"
    >
      <Trash2 size={16} />
    </button>
  );
}
