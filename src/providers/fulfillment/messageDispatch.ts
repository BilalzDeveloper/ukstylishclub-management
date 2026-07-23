// MessageDispatch: the simplest fulfilment provider — messages the vendor to
// arrange a pickup (Telegram). A real courier API would implement the same shape.
import { sendMessage, telegramConfigured } from "@/lib/telegram/bot";
import type { FulfillmentProvider, Pickup, DispatchResult } from "./types";
import type { Order } from "@/modules/orders/store";

export const messageDispatch: FulfillmentProvider = {
  name: "MessageDispatch (Telegram)",
  configured(): boolean {
    return telegramConfigured();
  },
  async requestPickup(order: Order, pickup: Pickup): Promise<DispatchResult> {
    const text =
      `📦 Pickup for order ${order.name}\n` +
      pickup.lines.map((l) => `• ${l.qty}× ${l.title}`).join("\n") +
      `\nSubtotal £${pickup.subtotal.toFixed(2)}`;

    if (!this.configured()) {
      return { ok: false, note: `dev — would message ${pickup.vendor}` };
    }
    // In production, route to the vendor's chat id; here we post to the bot owner.
    await sendMessage(pickup.vendor, text);
    return { ok: true, note: `pickup requested from ${pickup.vendor}` };
  },
};
