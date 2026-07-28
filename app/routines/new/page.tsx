import PageHeader from "@/components/PageHeader";
import { createRoutine } from "@/app/actions/routines";

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
        <button
          type="submit"
          className="min-h-[50px] w-full rounded-2xl bg-accent font-semibold text-accent-foreground transition-transform active:scale-[0.98]"
        >
          Crear rutina
        </button>
      </form>
    </div>
  );
}
