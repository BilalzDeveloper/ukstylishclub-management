// Telegram webhook: receives updates, turns photo submissions into review drafts.
// Set the webhook to POST here with a secret header matching TELEGRAM_WEBHOOK_SECRET.
// Album grouping across separate messages (media_group_id) is a known simplification
// — each message becomes one submission for now.
import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { ingestSubmission } from "@/modules/onboarding/pipeline";
import { fileUrl } from "@/lib/telegram/bot";
import type { Submission, SubmissionPhoto } from "@/modules/onboarding/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "telegram/webhook" });
}

export async function POST(req: Request) {
  if (env.TELEGRAM_WEBHOOK_SECRET) {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    if (secret !== env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  const update = (await req.json().catch(() => null)) as any;
  const msg = update?.message ?? update?.channel_post;
  const photos = msg?.photo as any[] | undefined;

  if (!msg || !photos?.length) {
    return NextResponse.json({ ok: true, skipped: "no photo" });
  }

  // Largest rendition is last in Telegram's photo size array.
  const largest = photos[photos.length - 1];
  const resolved = await fileUrl(largest.file_id).catch(() => null);
  const photo: SubmissionPhoto = {
    fileId: largest.file_id,
    url: resolved ?? undefined,
    name: `${largest.file_unique_id ?? "photo"}.jpg`,
  };

  const submission: Submission = {
    groupId: String(msg.media_group_id ?? msg.message_id),
    chatId: msg.chat?.id,
    senderId: msg.from?.id,
    senderHandle: msg.from?.username,
    caption: msg.caption ?? "",
    photos: [photo],
    receivedAt: new Date((msg.date ?? Date.now() / 1000) * 1000).toISOString(),
  };

  const draft = await ingestSubmission(submission);
  return NextResponse.json({ ok: true, draftId: draft.id, status: draft.status });
}
