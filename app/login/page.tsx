"use client";

import { useActionState } from "react";
import { AlertCircle, Lock } from "lucide-react";
import { login, type LoginState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";

export default function LoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {
    ok: true,
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Lock size={24} />
      </div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">
        Gym Tracker
      </h1>
      <p className="mb-6 text-sm text-muted">Ingresá la contraseña para continuar</p>

      <form action={formAction} className="w-full max-w-xs space-y-3">
        {!state.ok && state.error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <input
          type="password"
          name="password"
          autoFocus
          required
          placeholder="Contraseña"
          className="h-12 w-full rounded-xl border border-border bg-background px-3 text-foreground"
        />

        <SubmitButton
          pendingChildren="Ingresando..."
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-accent font-semibold text-accent-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          Ingresar
        </SubmitButton>
      </form>
    </div>
  );
}
