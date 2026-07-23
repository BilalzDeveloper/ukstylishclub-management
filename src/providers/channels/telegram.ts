// Telegram broadcast channel — posts the catalog text to the configured channel.
import { env } from "@/config/env";
import { sendMessage } from "@/lib/telegram/bot";
import { renderCatalogText } from "@/modules/catalog/build";
import type { Catalog } from "@/modules/catalog/types";
import type { BroadcastChannel, SendResult } from "./types";

export const telegramChannel: BroadcastChannel = {
  name: "Telegram channel",
  configured(): boolean {
    return Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CATALOG_CHANNEL_ID);
  },
  async send(catalog: Catalog): Promise<SendResult> {
    if (!this.configured()) {
      return { ok: false, note: "TELEGRAM_BOT_TOKEN / TELEGRAM_CATALOG_CHANNEL_ID not set" };
    }
    await sendMessage(env.TELEGRAM_CATALOG_CHANNEL_ID as string, renderCatalogText(catalog));
    return { ok: true, note: `posted ${catalog.items.length} items` };
  },
};
