// Shopify Admin GraphQL client. Ported from legacy/onboarder/index.html (shopifyGql),
// now reading credentials from the validated env instead of a config screen.
import { env } from "@/config/env";

export function shopifyConfigured(): boolean {
  return Boolean(env.SHOPIFY_ADMIN_ACCESS_TOKEN);
}

export async function shopifyGql<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    throw new Error("SHOPIFY_ADMIN_ACCESS_TOKEN is not set");
  }
  const url = `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/${env.SHOPIFY_API_VERSION}/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Shopify HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}
