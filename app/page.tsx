import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import PageHeader from "@/components/PageHeader";
import { Dumbbell, ListChecks, Play } from "lucide-react";

export default async function Home() {
  const user = await getCurrentUser();

  const recentWorkouts = await prisma.workout.findMany({
    where: { userId: user.id, endTime: { not: null } },
    orderBy: { startTime: "desc" },
    take: 5,
    include: { sets: true },
  });

  return (
    <div>
      <PageHeader title="Gym Tracker" subtitle={`Hola, ${user.name ?? "atleta"}`} />
      <div className="px-4 py-4 space-y-4">
        <Link
          href="/workout"
          className="flex min-h-[64px] items-center justify-center gap-2 rounded-xl bg-cyan-500 text-lg font-bold text-gray-950 active:bg-cyan-400"
        >
          <Play size={24} />
          Empezar entrenamiento
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/routines"
            className="flex min-h-[80px] flex-col items-center justify-center gap-1 rounded-xl border border-gray-800 bg-gray-900 active:bg-gray-800"
          >
            <ListChecks className="text-cyan-400" size={22} />
            <span className="text-sm font-medium">Rutinas</span>
          </Link>
          <Link
            href="/exercises"
            className="flex min-h-[80px] flex-col items-center justify-center gap-1 rounded-xl border border-gray-800 bg-gray-900 active:bg-gray-800"
          >
            <Dumbbell className="text-cyan-400" size={22} />
            <span className="text-sm font-medium">Ejercicios</span>
          </Link>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-gray-400">
            Entrenamientos recientes
          </h2>
          <div className="space-y-2">
            {recentWorkouts.map((w) => (
              <div
                key={w.id}
                className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-3"
              >
                <p className="font-medium">{w.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(w.startTime).toLocaleDateString("es-AR")} ·{" "}
                  {w.sets.length} series
                </p>
              </div>
            ))}
            {recentWorkouts.length === 0 && (
              <p className="py-4 text-center text-gray-500">
                Todavía no completaste ningún entrenamiento.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
