// Daily catalog domain (M3). The day's published products are gathered into a
// Catalog and broadcast across channels; each send is logged as a BroadcastRun.
export interface CatalogItem {
  id: string;
  title: string;
  price: number | null;
  collection: string | null;
  vendor: string | null;
  photoName?: string;
  shopifyProductId?: string;
}

export interface Catalog {
  builtAt: string; // ISO
  items: CatalogItem[];
}

export type BroadcastStatus = "sent" | "dev" | "failed";

export interface BroadcastRun {
  id: string;
  at: string; // ISO
  channel: string;
  itemCount: number;
  status: BroadcastStatus;
  note: string;
}
