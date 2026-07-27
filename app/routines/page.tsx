import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import PageHeader from "@/components/PageHeader";
import { Plus, ChevronRight } from "lucide-react";

export default async function RoutinesPage() {
  const user = await getCurrentUser();
  const routines = await prisma.routine.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Rutinas" subtitle="Tus planes de entrenamiento" />
      <div className="px-4 py-4 space-y-3">
        <Link
          href="/routines/new"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-dashed border-gray-700 text-gray-300 font-medium active:bg-gray-900"
        >
          <Plus size={20} />
          Nueva rutina
        </Link>

        {routines.map((r) => (
          <Link
            key={r.id}
            href={`/routines/${r.id}`}
            className="flex min-h-[64px] items-center justify-between rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 active:bg-gray-800"
          >
            <div>
              <p className="font-semibold">{r.name}</p>
              <p className="text-sm text-gray-500">
                {r.items.length} ejercicio{r.items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <ChevronRight className="text-gray-600" size={20} />
          </Link>
        ))}

        {routines.length === 0 && (
          <p className="py-8 text-center text-gray-500">
            Todavía no creaste ninguna rutina.
          </p>
        )}
      </div>
    </div>
  );
}
