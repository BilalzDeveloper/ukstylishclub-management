// Thin Telegram Bot API helpers (fetch-based). grammY is a dependency for the
// richer bot runtime later; the webhook path only needs getFile + sendMessage.
import { env } from "@/config/env";

export function telegramConfigured(): boolean {
  return Boolean(env.TELEGRAM_BOT_TOKEN);
}

function api(method: string): string {
  return `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`;
}

/** Resolve a photo file_id to a public download URL (contains the bot token). */
export async function fileUrl(fileId: string): Promise<string | null> {
  if (!env.TELEGRAM_BOT_TOKEN) return null;
  const res = await fetch(`${api("getFile")}?file_id=${encodeURIComponent(fileId)}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { ok: boolean; result?: { file_path?: string } };
  const path = data.result?.file_path;
  return path
    ? `https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${path}`
    : null;
}

export async function sendMessage(chatId: number | string, text: string): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN) return;
  await fetch(api("sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}
