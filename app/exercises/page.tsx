import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import ExerciseExplorer from "@/components/ExerciseExplorer";

export default async function ExercisesPage() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Ejercicios"
        subtitle={`${exercises.length} ejercicios disponibles`}
      />
      <ExerciseExplorer exercises={exercises} />
    </div>
  );
}
