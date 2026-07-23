"use server";

import { revalidatePath } from "next/cache";
import { updateVendor } from "@/modules/vendors/store";

export async function toggleStatusAction(formData: FormData): Promise<void> {
  const code = String(formData.get("code"));
  const to = String(formData.get("to"));
  updateVendor(code, { status: to === "active" ? "active" : "pending" });
  revalidatePath("/vendors");
}

export async function linkLocationAction(formData: FormData): Promise<void> {
  const code = String(formData.get("code"));
  // Live Shopify Location creation is env-gated (needs a store token + address);
  // here we record a dev linkage so the split-fulfillment model (ADR-0002) is wired.
  updateVendor(code, { shopifyLocationId: `dev-loc-${code.toLowerCase()}` });
  revalidatePath("/vendors");
}
