// Typed, validated environment access.
// Import `env` instead of reading process.env directly, so a missing or malformed
// variable fails loudly at the edge rather than deep inside a request.
// Mirrors the keys in .env.example.
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url().optional(),

  // Shopify
  SHOPIFY_STORE_DOMAIN: z.string().default("uk-stylish.myshopify.com"),
  SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().optional(),
  SHOPIFY_API_VERSION: z.string().default("2024-01"),
  SHOPIFY_WEBHOOK_SECRET: z.string().optional(),

  // Telegram
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_WEBHOOK_SECRET: z.string().optional(),
  TELEGRAM_CATALOG_CHANNEL_ID: z.string().optional(),

  // AI
  ANTHROPIC_API_KEY: z.string().optional(),
  AI_MODEL_FAST: z.string().default("claude-haiku-4-5-20251001"),
  AI_MODEL_SMART: z.string().default("claude-sonnet-5"),

  // App
  APP_BASE_URL: z.string().url().optional(),
  ADMIN_ALLOWLIST: z.string().default(""),
  ORDER_PAYMENT_EXPIRY_MINUTES: z.coerce.number().default(1440),
  PAYMENT_MATCH_TOLERANCE: z.coerce.number().default(0.5),
});

// `partial-safe`: during the M0 scaffolding phase most integrations are unset,
// so we parse leniently and surface problems where a value is actually used.
export const env = schema.parse(process.env);

export type Env = z.infer<typeof schema>;
