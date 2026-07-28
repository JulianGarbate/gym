import { getCurrentUser } from "@/lib/session";
import PageHeader from "@/components/PageHeader";
import { updateProfile } from "@/app/actions/profile";
import { Save } from "lucide-react";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div>
      <PageHeader title="Mi perfil" subtitle="Tus datos personales" />
      <form action={updateProfile} className="px-5 py-5 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">
            Nombre
          </label>
          <input
            name="name"
            defaultValue={user.name ?? ""}
            placeholder="Tu nombre"
            className="min-h-[48px] w-full rounded-2xl border border-border bg-surface px-4 text-base text-foreground outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">
              Peso (kg)
            </label>
            <input
              name="weightKg"
              type="number"
              inputMode="decimal"
              step="0.1"
              defaultValue={user.weightKg ?? ""}
              placeholder="75"
              className="min-h-[48px] w-full rounded-2xl border border-border bg-surface px-4 text-base text-foreground outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">
              Altura (cm)
            </label>
            <input
              name="heightCm"
              type="number"
              inputMode="decimal"
              step="0.1"
              defaultValue={user.heightCm ?? ""}
              placeholder="175"
              className="min-h-[48px] w-full rounded-2xl border border-border bg-surface px-4 text-base text-foreground outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">
              Edad
            </label>
            <input
              name="age"
              type="number"
              inputMode="numeric"
              defaultValue={user.age ?? ""}
              placeholder="28"
              className="min-h-[48px] w-full rounded-2xl border border-border bg-surface px-4 text-base text-foreground outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">
              Sexo
            </label>
            <select
              name="sex"
              defaultValue={user.sex ?? ""}
              className="min-h-[48px] w-full rounded-2xl border border-border bg-surface px-4 text-base text-foreground outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
            >
              <option value="">Preferís no decir</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted">
          Usamos tu peso para estimar las calorías gastadas en cada
          entrenamiento. Podés editar estos datos cuando quieras.
        </p>

        <button
          type="submit"
          className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-accent font-semibold text-accent-foreground transition-transform active:scale-[0.98]"
        >
          <Save size={18} />
          Guardar
        </button>
      </form>
    </div>
  );
}
