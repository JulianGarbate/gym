import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import PageHeader from "@/components/PageHeader";
import CardioForm from "@/components/CardioForm";
import DeleteCardioButton from "@/components/DeleteCardioButton";
import { getCardioActivity } from "@/lib/calories";
import { Flame } from "lucide-react";

export default async function CardioPage() {
  const user = await getCurrentUser();

  const sessions = await prisma.cardioSession.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 20,
  });

  return (
    <div className="px-5 pb-24 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
      <PageHeader
        title="Cardio y deportes"
        subtitle="Registrá minutos jugados y estimamos las calorías"
      />

      <div className="mt-5">
        <CardioForm />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
          Actividades recientes
        </h2>
        <div className="space-y-2.5">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Flame size={17} />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {getCardioActivity(s.activityType).label}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {new Date(s.date).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    · {s.durationMin} min · ~{s.caloriesBurned} kcal
                  </p>
                </div>
              </div>
              <DeleteCardioButton id={s.id} />
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center">
              <p className="text-sm text-muted">
                Todavía no registraste ninguna actividad.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
