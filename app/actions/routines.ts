"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createRoutine(formData: FormData) {
  const user = await getCurrentUser();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) return;

  const routine = await prisma.routine.create({
    data: {
      userId: user.id,
      name,
      description: description || null,
    },
  });

  revalidatePath("/routines");
  redirect(`/routines/${routine.id}`);
}

export async function deleteRoutine(routineId: string) {
  await prisma.routine.delete({ where: { id: routineId } });
  revalidatePath("/routines");
  redirect("/routines");
}

export async function duplicateRoutine(routineId: string) {
  const user = await getCurrentUser();
  const original = await prisma.routine.findUnique({
    where: { id: routineId },
    include: { items: { orderBy: { order: "asc" } } },
  });
  if (!original) return;

  const copy = await prisma.routine.create({
    data: {
      userId: user.id,
      name: `Copia de ${original.name}`,
      description: original.description,
      items: {
        create: original.items.map((item) => ({
          exerciseId: item.exerciseId,
          targetSets: item.targetSets,
          targetRepsMin: item.targetRepsMin,
          targetRepsMax: item.targetRepsMax,
          order: item.order,
        })),
      },
    },
  });

  revalidatePath("/routines");
  redirect(`/routines/${copy.id}`);
}

export async function addRoutineItem(
  routineId: string,
  exerciseId: string,
  targetSets: number,
  targetRepsMin?: number | null,
  targetRepsMax?: number | null
) {
  const count = await prisma.routineItem.count({ where: { routineId } });
  await prisma.routineItem.create({
    data: {
      routineId,
      exerciseId,
      targetSets: targetSets || 3,
      targetRepsMin: targetRepsMin ?? null,
      targetRepsMax: targetRepsMax ?? null,
      order: count,
    },
  });
  revalidatePath(`/routines/${routineId}`);
}

export async function removeRoutineItem(routineId: string, itemId: string) {
  await prisma.routineItem.delete({ where: { id: itemId } });
  revalidatePath(`/routines/${routineId}`);
}

export async function moveRoutineItem(
  routineId: string,
  itemId: string,
  direction: "up" | "down"
) {
  const items = await prisma.routineItem.findMany({
    where: { routineId },
    orderBy: { order: "asc" },
  });

  const index = items.findIndex((i) => i.id === itemId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= items.length) return;

  const a = items[index];
  const b = items[swapWith];

  await prisma.$transaction([
    prisma.routineItem.update({
      where: { id: a.id },
      data: { order: b.order },
    }),
    prisma.routineItem.update({
      where: { id: b.id },
      data: { order: a.order },
    }),
  ]);

  revalidatePath(`/routines/${routineId}`);
}
