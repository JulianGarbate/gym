"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export interface UpdateProfileState {
  ok: boolean;
  error?: string;
}

export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  try {
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
    return { ok: true };
  } catch (err) {
    console.error("updateProfile failed", err);
    return {
      ok: false,
      error:
        "No se pudo guardar. Si acabamos de actualizar la app, refrescá la página e intentá de nuevo.",
    };
  }
}
