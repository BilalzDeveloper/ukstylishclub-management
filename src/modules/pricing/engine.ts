// MarginRule engine (M2). Resolves the most-specific active rule for a product
// context and computes the sell price from vendor cost. Replaces the flat ×1.55
// placeholder in the onboarding pipeline. See docs/business-model.md.

export type MarginMethod = "percent" | "fixed";

export interface RuleScope {
  vendor?: string;
  productType?: string;
  collection?: string;
}

export interface MarginRule {
  id: string;
  name: string;
  scope: RuleScope; // empty scope = global default
  method: MarginMethod;
  value: number; // percent (e.g. 55) or fixed GBP uplift
  floor?: number; // minimum sell price
  priority: number; // higher wins ties
  active: boolean;
}

export interface PriceContext {
  vendor?: string | null;
  productType?: string | null;
  collection?: string | null;
}

export interface PriceResult {
  sellPrice: number | null;
  rule: MarginRule | null;
  note: string;
}

// Default ruleset. Editable/persisted later; a config constant for now.
export const DEFAULT_RULES: MarginRule[] = [
  { id: "global", name: "Global default", scope: {}, method: "percent", value: 55, floor: 6.99, priority: 1, active: true },
  { id: "footwear", name: "Footwear uplift", scope: { collection: "Trainers & Footwear" }, method: "percent", value: 75, floor: 19.99, priority: 5, active: true },
  { id: "fragrance", name: "Fragrance fixed", scope: { collection: "Perfumes For Her" }, method: "fixed", value: 12, floor: 14.99, priority: 5, active: true },
];

function scopeMatches(scope: RuleScope, ctx: PriceContext): boolean {
  if (scope.vendor && scope.vendor !== ctx.vendor) return false;
  if (scope.productType && scope.productType !== ctx.productType) return false;
  if (scope.collection && scope.collection !== ctx.collection) return false;
  return true;
}

function specificity(scope: RuleScope): number {
  return (scope.vendor ? 1 : 0) + (scope.productType ? 1 : 0) + (scope.collection ? 1 : 0);
}

export function resolveRule(
  ctx: PriceContext,
  rules: MarginRule[] = DEFAULT_RULES,
): MarginRule | null {
  const matches = rules.filter((r) => r.active && scopeMatches(r.scope, ctx));
  if (!matches.length) return null;
  matches.sort(
    (a, b) => specificity(b.scope) - specificity(a.scope) || b.priority - a.priority,
  );
  return matches[0];
}

/** Round up to a psychological .99 price point. */
function toCharm(n: number): number {
  return Math.max(0, Math.floor(n)) + 0.99;
}

export function computeSellPrice(
  cost: number | null,
  ctx: PriceContext,
  rules: MarginRule[] = DEFAULT_RULES,
): PriceResult {
  if (cost == null) return { sellPrice: null, rule: null, note: "no cost — set price manually" };
  const rule = resolveRule(ctx, rules);
  if (!rule) return { sellPrice: toCharm(cost * 1.5), rule: null, note: "no rule matched — fallback +50%" };

  let raw = rule.method === "percent" ? cost * (1 + rule.value / 100) : cost + rule.value;
  if (rule.floor != null) raw = Math.max(raw, rule.floor);
  const sellPrice = toCharm(raw);
  const desc = rule.method === "percent" ? `+${rule.value}%` : `+£${rule.value}`;
  return { sellPrice, rule, note: `${rule.name} (${desc})` };
}
