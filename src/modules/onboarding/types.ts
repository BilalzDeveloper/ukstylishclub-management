// Onboarding domain types. A Telegram submission becomes a ProductDraft, which a
// human approves before it is published to Shopify.

export interface SubmissionPhoto {
  /** Telegram file_id (fetched lazily) or a direct URL. */
  fileId?: string;
  url?: string;
  name: string;
}

export interface Submission {
  /** media_group_id for albums, or the message id for singles. */
  groupId: string;
  chatId: number;
  senderId?: number;
  senderHandle?: string;
  caption: string;
  photos: SubmissionPhoto[];
  receivedAt: string; // ISO
}

/** Parsed from the free-form caption. Anything unknown stays null for review. */
export interface CaptionData {
  vendor: string | null;
  costPrice: number | null; // vendor cost in GBP
  sizes: string[];
  quantity: number | null;
}

export type DraftStatus = "draft" | "published" | "rejected";

export interface ProductDraft {
  id: string;
  status: DraftStatus;
  receivedAt: string;

  // parsed + classified
  vendor: string | null;
  costPrice: number | null;
  sellPrice: number | null;
  sizes: string[];
  colours: string[];
  productType: string | null;
  suggestedTitle: string;
  collection: string | null;
  photos: SubmissionPhoto[];
  captionRaw: string;

  confidence: number; // 0..1
  flags: string[]; // e.g. "missing price", "unknown vendor"
  pricingNote?: string; // which margin rule set the sell price

  shopifyProductId?: string;
  source: "telegram";
}
