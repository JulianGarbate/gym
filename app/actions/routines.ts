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

export async function addRoutineItem(
  routineId: string,
  exerciseId: string,
  targetSets: number
) {
  const count = await prisma.routineItem.count({ where: { routineId } });
  await prisma.routineItem.create({
    data: {
      routineId,
      exerciseId,
      targetSets: targetSets || 3,
      order: count,
    },
  });
  revalidatePath(`/routines/${routineId}`);
}

export async function removeRoutineItem(routineId: string, itemId: string) {
  await prisma.routineItem.delete({ where: { id: itemId } });
  revalidatePath(`/routines/${routineId}`);
}
