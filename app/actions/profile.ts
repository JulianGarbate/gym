"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();

  const name = String(formData.get("name") ?? "").trim();
  const weightKg = formData.get("weightKg");
  const heightCm = formData.get("heightCm");
  const age = formData.get("age");
  const sex = String(formData.get("sex") ?? "").trim();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: name || null,
      weightKg: weightKg ? parseFloat(String(weightKg)) : null,
      heightCm: heightCm ? parseFloat(String(heightCm)) : null,
      age: age ? parseInt(String(age), 10) : null,
      sex: sex || null,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/");
}
