"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Check, Loader2, Send } from "lucide-react";
import { syncWorkoutToDailyCal } from "@/app/actions/dailyCal";

export default function SendToDailyCalButton({
  workoutId,
  calories,
}: {
  workoutId: string;
  calories: number;
}) {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await syncWorkoutToDailyCal(workoutId, calories);
      if (result.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
        setError(result.error ?? "Error desconocido");
      }
    });
  }

  if (status === "sent") {
    return (
      <span className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-surface-2 px-3.5 text-sm font-semibold text-muted">
        <Check size={16} />
        Sincronizado
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      title={
        status === "error"
          ? (error ?? "Error al enviar")
          : `Sincronizar ${calories} kcal con Daily Cal`
      }
      className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
        status === "error"
          ? "bg-red-500/15 text-red-400 active:scale-[0.97]"
          : "bg-accent text-accent-foreground active:scale-[0.97]"
      }`}
    >
      {pending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : status === "error" ? (
        <AlertTriangle size={16} />
      ) : (
        <Send size={16} />
      )}
      {pending ? "Enviando..." : status === "error" ? "Reintentar" : "Daily Cal"}
    </button>
  );
}
