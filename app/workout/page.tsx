import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { startWorkout } from "@/app/actions/workouts";
import { ChevronRight, Zap } from "lucide-react";

export default async function WorkoutStartPage() {
  const user = await getCurrentUser();
  const routines = await prisma.routine.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Entrenar" subtitle="Elegí cómo empezar" />
      <div className="px-4 py-4 space-y-3">
        <form
          action={async () => {
            "use server";
            await startWorkout(null, "Entrenamiento libre");
          }}
        >
          <button
            type="submit"
            className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 font-semibold text-gray-950 active:bg-cyan-400"
          >
            <Zap size={20} />
            Entrenamiento libre
          </button>
        </form>

        <p className="pt-2 text-sm font-medium text-gray-400">
          O elegí una rutina
        </p>

        {routines.map((r) => (
          <form
            key={r.id}
            action={async () => {
              "use server";
              await startWorkout(r.id, r.name);
            }}
          >
            <button
              type="submit"
              className="flex min-h-[64px] w-full items-center justify-between rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-left active:bg-gray-800"
            >
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-gray-500">
                  {r.items.length} ejercicio{r.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <ChevronRight className="text-gray-600" size={20} />
            </button>
          </form>
        ))}

        {routines.length === 0 && (
          <p className="py-4 text-center text-gray-500">
            No tenés rutinas todavía. Podés empezar un entrenamiento libre.
          </p>
        )}
      </div>
    </div>
  );
}
