import PageHeader from "@/components/PageHeader";
import { createRoutine } from "@/app/actions/routines";
import SubmitButton from "@/components/SubmitButton";
import { Loader2, Plus } from "lucide-react";

export default function NewRoutinePage() {
  return (
    <div>
      <PageHeader title="Nueva rutina" />
      <form action={createRoutine} className="px-5 py-5 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">
            Nombre
          </label>
          <input
            name="name"
            required
            placeholder="Ej: Push / Pull / Legs - Día Push"
            className="min-h-[48px] w-full rounded-2xl border border-border bg-surface px-4 text-base text-foreground outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">
            Descripción (opcional)
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Notas sobre esta rutina..."
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <SubmitButton
          className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-accent font-semibold text-accent-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
          pendingChildren={
            <>
              <Loader2 size={18} className="animate-spin" />
              Creando...
            </>
          }
        >
          <Plus size={18} />
          Crear rutina
        </SubmitButton>
      </form>
    </div>
  );
}
