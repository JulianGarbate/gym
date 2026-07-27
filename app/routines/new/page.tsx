import PageHeader from "@/components/PageHeader";
import { createRoutine } from "@/app/actions/routines";

export default function NewRoutinePage() {
  return (
    <div>
      <PageHeader title="Nueva rutina" />
      <form action={createRoutine} className="px-4 py-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            Nombre
          </label>
          <input
            name="name"
            required
            placeholder="Ej: Push / Pull / Legs - Día Push"
            className="min-h-[48px] w-full rounded-xl border border-gray-800 bg-gray-900 px-4 text-base outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            Descripción (opcional)
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Notas sobre esta rutina..."
            className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-base outline-none focus:border-cyan-500"
          />
        </div>
        <button
          type="submit"
          className="min-h-[48px] w-full rounded-xl bg-cyan-500 font-semibold text-gray-950 active:bg-cyan-400"
        >
          Crear rutina
        </button>
      </form>
    </div>
  );
}
