// Fulfilment provider — a swappable edge (docs/vision.md). A courier/dispatch
// integration implements this; MessageDispatch is the first adapter.
import type { Order, OrderLine } from "@/modules/orders/store";

export interface Pickup {
  vendor: string;
  locationId: string | null; // Shopify Location GID (ADR-0002) when linked
  lines: OrderLine[];
  subtotal: number;
}

export interface DispatchResult {
  ok: boolean;
  note: string;
}

export interface FulfillmentProvider {
  name: string;
  configured(): boolean;
  requestPickup(order: Order, pickup: Pickup): Promise<DispatchResult>;
}
