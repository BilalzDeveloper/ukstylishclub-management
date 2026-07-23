// Pure, tolerant caption parser. Captions are free-form (see docs/telegram-intake.md),
// e.g. "Siim / £24.99 / Sizes S-XXL / Qty 12" or "Rag £45 UK 7-11 x6 black".
// Anything it can't read is left null for the review sheet — it never guesses a price.
import { VENDORS, CLOTHING_SIZES } from "@/config/catalog";
import type { CaptionData } from "@/modules/onboarding/types";

export function parseCaption(caption: string): CaptionData {
  const text = caption ?? "";
  return {
    vendor: parseVendor(text),
    costPrice: parsePrice(text),
    sizes: parseSizes(text),
    quantity: parseQuantity(text),
  };
}

function parseVendor(text: string): string | null {
  // Match a known vendor code as a whole word, longest first to avoid "Al" eating "Alll".
  const byLength = [...VENDORS].sort((a, b) => b.length - a.length);
  for (const v of byLength) {
    const re = new RegExp(`(?:^|[^a-z])${escapeRe(v)}(?:[^a-z]|$)`, "i");
    if (re.test(text)) return v;
  }
  return null;
}

function parsePrice(text: string): number | null {
  // Prefer a £-prefixed amount; fall back to a "price" label; never a bare number.
  const pound = text.match(/£\s?(\d+(?:\.\d{1,2})?)/);
  if (pound) return Number(pound[1]);
  const labelled = text.match(/\bprice\b[^\d]{0,6}(\d+(?:\.\d{1,2})?)/i);
  if (labelled) return Number(labelled[1]);
  return null;
}

function parseQuantity(text: string): number | null {
  const qty = text.match(/\b(?:qty|quantity)\b[^\d]{0,4}(\d{1,4})/i);
  if (qty) return Number(qty[1]);
  const x = text.match(/(?:^|\s)x\s?(\d{1,4})\b/i);
  if (x) return Number(x[1]);
  return null;
}

export function parseSizes(text: string): string[] {
  // Footwear range: "UK 6-12"
  const uk = text.match(/UK\s?(\d{1,2})\s?-\s?(\d{1,2})/i);
  if (uk) {
    const [a, b] = [Number(uk[1]), Number(uk[2])].sort((x, y) => x - y);
    return range(a, b).map((n) => `UK ${n}`);
  }
  // Clothing range: "S-XXL"
  const cl = text.match(/\b(XS|S|M|L|XL|XXL|XXXL)\s?-\s?(XS|S|M|L|XL|XXL|XXXL)\b/i);
  if (cl) {
    const lo = CLOTHING_SIZES.indexOf(cl[1].toUpperCase());
    const hi = CLOTHING_SIZES.indexOf(cl[2].toUpperCase());
    if (lo >= 0 && hi >= 0) return CLOTHING_SIZES.slice(Math.min(lo, hi), Math.max(lo, hi) + 1);
  }
  // Explicit list: "M, L, XL"
  const listed = (text.match(/\b(XS|S|M|L|XL|XXL|XXXL)\b/gi) ?? []).map((s) => s.toUpperCase());
  if (listed.length) return dedupe(listed);
  return [];
}

function range(a: number, b: number): number[] {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}
function dedupe<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
