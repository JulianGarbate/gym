"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { logCardio, type LogCardioState } from "@/app/actions/cardio";
import { CARDIO_ACTIVITIES } from "@/lib/calories";
import SubmitButton from "@/components/SubmitButton";

export default function CardioForm() {
  const [state, formAction] = useActionState<LogCardioState, FormData>(
    logCardio,
    { ok: true }
  );

  return (
    <form
      action={formAction}
      key={state.ok ? "ok" : "error"}
      className="space-y-3 rounded-2xl border border-border bg-surface p-4"
    >
      {!state.ok && state.error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">
          Actividad
        </label>
        <select
          name="activityType"
          required
          defaultValue=""
          className="h-12 w-full rounded-xl border border-border bg-background px-3 text-foreground"
        >
          <option value="" disabled>
            Elegí una actividad
          </option>
          {CARDIO_ACTIVITIES.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">
          Minutos jugados/entrenados
        </label>
        <input
          type="number"
          name="durationMin"
          inputMode="numeric"
          min={1}
          step={1}
          required
          placeholder="60"
          className="h-12 w-full rounded-xl border border-border bg-background px-3 text-foreground"
        />
      </div>

      <SubmitButton
        showDoneFlash={state.ok}
        pendingChildren="Guardando..."
        doneChildren="¡Guardado!"
        className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-accent font-semibold text-accent-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        Registrar actividad
      </SubmitButton>
    </form>
  );
}
