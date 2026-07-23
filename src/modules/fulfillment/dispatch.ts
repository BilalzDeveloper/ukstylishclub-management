// Request pickups for an order via the active FulfillmentProvider.
import { getOrder, setFulfillment } from "@/modules/orders/store";
import { splitByVendor } from "./split";
import { messageDispatch } from "@/providers/fulfillment/messageDispatch";
import type { DispatchResult } from "@/providers/fulfillment/types";

const provider = messageDispatch; // swap for a courier adapter later

export interface DispatchOutcome {
  vendor: string;
  result: DispatchResult;
}

export async function requestPickups(orderId: string): Promise<DispatchOutcome[]> {
  const order = getOrder(orderId);
  if (!order) return [];

  const pickups = splitByVendor(order);
  const outcomes: DispatchOutcome[] = [];
  for (const pickup of pickups) {
    const result = await provider.requestPickup(order, pickup);
    outcomes.push({ vendor: pickup.vendor, result });
  }
  setFulfillment(orderId, "in_pickup");
  return outcomes;
}

export function activeProviderName(): string {
  return provider.name;
}

export function providerConfigured(): boolean {
  return provider.configured();
}
