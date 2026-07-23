"use server";

import { revalidatePath } from "next/cache";
import { requestPickups } from "@/modules/fulfillment/dispatch";

export async function requestPickupsAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await requestPickups(id);
  revalidatePath("/orders");
}
