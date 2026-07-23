// A broadcast channel is a swappable edge (docs/vision.md — "swappable edges").
// Telegram, WhatsApp, Instagram, and the Shopify collection all implement this.
import type { Catalog } from "@/modules/catalog/types";

export interface SendResult {
  ok: boolean;
  note: string;
}

export interface BroadcastChannel {
  name: string;
  configured(): boolean;
  send(catalog: Catalog): Promise<SendResult>;
}
