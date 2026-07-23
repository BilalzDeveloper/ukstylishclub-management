"use server";

import { revalidatePath } from "next/cache";
import { broadcastToday } from "@/modules/catalog/broadcast";

export async function broadcastAction(): Promise<void> {
  await broadcastToday();
  revalidatePath("/catalog");
}
