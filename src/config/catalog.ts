// Catalog conventions, ported from the legacy onboarder (legacy/onboarder/index.html)
// and CLAUDE.md. Source of truth for type→collection mapping, sizing, and vendors.
// Verify against the live store before relying on it (titles/collections drift).

export const COLLECTION_MAP: Record<string, string> = {
  "T-shirt": "T-Shirts For Men",
  Top: "T-Shirts For Men",
  Polo: "T-Shirts For Men",
  Shorts: "Boxers and Shorts",
  "Board shorts": "Boxers and Shorts",
  "Swim shorts": "Boxers and Shorts",
  "Sweat shorts": "Boxers and Shorts",
  Boxers: "Boxers and Shorts",
  Underwear: "Boxers and Shorts",
  Tracksuit: "Tracksuits For Men",
  Joggers: "Tracksuits For Men",
  Sweatpants: "Tracksuits For Men",
  Hoodie: "Tracksuits For Men",
  Jacket: "Tracksuits For Men",
  Coat: "Tracksuits For Men",
  Trainers: "Trainers & Footwear",
  Sneakers: "Trainers & Footwear",
  Shoes: "Trainers & Footwear",
  Jeans: "Jeans",
  Trousers: "Jeans",
  Bag: "Unisex Bags",
  Backpack: "Unisex Bags",
  Socks: "Socks For Men",
  Perfume: "Perfumes For Her",
  Fragrance: "Perfumes For Her",
  Wallet: "Men Wallet & Bag",
};

export const PRODUCT_TYPES = Object.keys(COLLECTION_MAP);

export const FOOTWEAR_TYPES = ["Trainers", "Sneakers", "Shoes"];

export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
export const SHOE_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"];

// 27 vendor codes (CLAUDE.md). The code leads product titles and tags today.
export const VENDORS = [
  "Siim", "Sim", "Son", "Ad", "Ahm", "D", "Fr", "Alll", "Al", "Cho",
  "Shii", "Che", "Mon", "Afi", "Sh", "Zero", "Dar", "Nwdr", "Zz", "Mz",
  "Za", "Rag", "Tag", "Uptk", "Daup", "Ham", "Oooo",
];

export function collectionForType(productType: string | null): string | null {
  if (!productType) return null;
  return COLLECTION_MAP[productType] ?? null;
}

export function isFootwear(productType: string | null): boolean {
  return !!productType && FOOTWEAR_TYPES.includes(productType);
}
