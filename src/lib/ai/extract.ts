// Product classification. When ANTHROPIC_API_KEY is set it asks Claude to read the
// caption (multimodal image reading is a later refinement); otherwise it falls back
// to a transparent keyword heuristic so the pipeline still runs in dev/offline.
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/config/env";
import { PRODUCT_TYPES } from "@/config/catalog";
import type { Submission } from "@/modules/onboarding/types";

export interface Classification {
  productType: string | null;
  colours: string[];
  styleName: string | null;
  suggestedTitle: string;
  confidence: number;
  notes: string;
}

const TYPE_SYNONYMS: Record<string, string> = {
  tee: "T-shirt", tshirt: "T-shirt", "t-shirt": "T-shirt", polo: "Polo", top: "Top",
  short: "Shorts", shorts: "Shorts", boxer: "Boxers", boxers: "Boxers",
  tracksuit: "Tracksuit", jogger: "Joggers", joggers: "Joggers", sweatpant: "Sweatpants",
  hoodie: "Hoodie", jacket: "Jacket", coat: "Coat", trainer: "Trainers", trainers: "Trainers",
  sneaker: "Sneakers", sneakers: "Sneakers", shoe: "Shoes", shoes: "Shoes",
  jean: "Jeans", jeans: "Jeans", trouser: "Trousers", trousers: "Trousers",
  bag: "Bag", backpack: "Backpack", sock: "Socks", socks: "Socks", wallet: "Wallet",
  perfume: "Perfume", fragrance: "Fragrance",
};

const COLOURS = [
  "black", "white", "grey", "gray", "navy", "blue", "red", "green", "beige",
  "brown", "cream", "pink", "purple", "orange", "yellow", "khaki", "burgundy", "tan",
];

export async function classify(
  submission: Submission,
  vendor: string | null,
): Promise<Classification> {
  if (env.ANTHROPIC_API_KEY) {
    try {
      return await classifyWithClaude(submission, vendor);
    } catch {
      // fall through to heuristic
    }
  }
  return heuristic(submission, vendor);
}

async function classifyWithClaude(
  submission: Submission,
  vendor: string | null,
): Promise<Classification> {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: env.AI_MODEL_SMART,
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content:
          "You classify menswear products for a UK store. From this vendor caption, " +
          'return ONLY JSON: {"productType","colours","styleName","confidence","notes"}. ' +
          `Valid productType values: ${PRODUCT_TYPES.join(", ")}.\nCaption: ${submission.caption}`,
      },
    ],
  });
  const text = msg.content.find((b) => b.type === "text");
  const parsed = JSON.parse((text && "text" in text ? text.text : "{}").trim());
  const productType: string | null = parsed.productType ?? null;
  return {
    productType,
    colours: Array.isArray(parsed.colours) ? parsed.colours : [],
    styleName: parsed.styleName ?? null,
    suggestedTitle: buildTitle(vendor, productType, parsed.styleName ?? null),
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
    notes: parsed.notes ?? "classified by Claude",
  };
}

function heuristic(submission: Submission, vendor: string | null): Classification {
  const hay = `${submission.caption} ${submission.photos.map((p) => p.name).join(" ")}`.toLowerCase();

  let productType: string | null = null;
  for (const [kw, type] of Object.entries(TYPE_SYNONYMS)) {
    if (new RegExp(`\\b${kw}\\b`).test(hay)) {
      productType = type;
      break;
    }
  }
  const colours = COLOURS.filter((c) => new RegExp(`\\b${c}\\b`).test(hay)).map(title);

  return {
    productType,
    colours,
    styleName: null,
    suggestedTitle: buildTitle(vendor, productType, null),
    confidence: productType ? 0.5 : 0.25,
    notes: "keyword heuristic (no ANTHROPIC_API_KEY) — review before publishing",
  };
}

function buildTitle(vendor: string | null, type: string | null, style: string | null): string {
  const parts = [vendor, type, style].filter(Boolean) as string[];
  return parts.length ? parts.join(" ") : "New arrival";
}

function title(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
