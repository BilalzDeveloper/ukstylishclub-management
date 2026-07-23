"use server";

import { revalidatePath } from "next/cache";
import { publishDraft, rejectDraft } from "@/modules/onboarding/pipeline";

export async function approveAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await publishDraft(id);
  revalidatePath("/products");
}

export async function rejectAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  rejectDraft(id);
  revalidatePath("/products");
}
