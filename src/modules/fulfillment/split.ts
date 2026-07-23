// Split an order into one pickup per vendor. This is what "vendor = Location"
// (ADR-0002) buys us: a multi-vendor order natively becomes several pickups, each
// tied to that vendor's Shopify Location, so a courier collects from each.
import { getVendor } from "@/modules/vendors/store";
import type { Order } from "@/modules/orders/store";
import type { Pickup } from "@/providers/fulfillment/types";

export function splitByVendor(order: Order): Pickup[] {
  const byVendor = new Map<string, Pickup>();

  for (const line of order.lines) {
    const key = line.vendor ?? "unassigned";
    let pickup = byVendor.get(key);
    if (!pickup) {
      pickup = {
        vendor: key,
        locationId: line.vendor ? getVendor(line.vendor)?.shopifyLocationId ?? null : null,
        lines: [],
        subtotal: 0,
      };
      byVendor.set(key, pickup);
    }
    pickup.lines.push(line);
    pickup.subtotal += line.price * line.qty;
  }

  return [...byVendor.values()];
}
