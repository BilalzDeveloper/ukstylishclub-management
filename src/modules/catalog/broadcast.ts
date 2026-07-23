// Broadcast orchestration: build the drop, send via each channel, log the run.
import { randomUUID } from "crypto";
import { buildCatalog } from "./build";
import { addRun } from "./store";
import { telegramChannel } from "@/providers/channels/telegram";
import type { BroadcastChannel } from "@/providers/channels/types";
import type { BroadcastRun } from "./types";

// Registered channels. Add WhatsApp/Instagram/ShopifyCollection adapters here.
const CHANNELS: BroadcastChannel[] = [telegramChannel];

export async function broadcastToday(): Promise<BroadcastRun[]> {
  const catalog = buildCatalog();
  const results: BroadcastRun[] = [];

  for (const channel of CHANNELS) {
    let status: BroadcastRun["status"];
    let note: string;

    if (!channel.configured()) {
      status = "dev";
      note = `not configured — would post ${catalog.items.length} items (${channel.name})`;
    } else {
      try {
        const r = await channel.send(catalog);
        status = r.ok ? "sent" : "failed";
        note = r.note;
      } catch (e) {
        status = "failed";
        note = (e as Error).message;
      }
    }

    const run: BroadcastRun = {
      id: randomUUID(),
      at: new Date().toISOString(),
      channel: channel.name,
      itemCount: catalog.items.length,
      status,
      note,
    };
    addRun(run);
    results.push(run);
  }
  return results;
}
