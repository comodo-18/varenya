import type {
  CacheStats,
  InventoryItem,
  Product,
  ProductVariant,
} from "./types";

const CATALOG_URL = process.env.NEXT_PUBLIC_CATALOG_URL;
const INVENTORY_URL = process.env.NEXT_PUBLIC_INVENTORY_URL;
const VARIANT_URL = process.env.NEXT_PUBLIC_VARIANT_URL;

export interface Sourced<T> {
  data: T;
  source: string | null;
  latencyMs: number;
}

// ---------------------------------------------------------------------------
// Server-side reads (ISR) — CatalogCache / VariantGraph
// ---------------------------------------------------------------------------

export async function getProducts(): Promise<Sourced<Product[]>> {
  const start = Date.now();
  const res = await fetch(`${CATALOG_URL}/api/products`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return {
    data,
    source: res.headers.get("x-response-source"),
    latencyMs: Date.now() - start,
  };
}

export async function getProductById(id: number): Promise<Sourced<Product>> {
  const start = Date.now();
  const res = await fetch(`${CATALOG_URL}/api/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Product not found");
  const data = await res.json();
  return {
    data,
    source: res.headers.get("x-response-source"),
    latencyMs: Date.now() - start,
  };
}

export async function getVariants(productId: number): Promise<ProductVariant[]> {
  const res = await fetch(`${VARIANT_URL}/api/variants/${productId}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

// ---------------------------------------------------------------------------
// Client-side reads (SWR) — stock must always be live
// ---------------------------------------------------------------------------

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

export function inventoryUrl(productId: number): string {
  return `${INVENTORY_URL}/api/inventory/${productId}`;
}

export function cacheStatsUrl(): string {
  return `${CATALOG_URL}/api/cache/stats`;
}

export function productsUrl(): string {
  return `${CATALOG_URL}/api/products`;
}

export async function getInventory(productId: number): Promise<InventoryItem> {
  const res = await fetch(inventoryUrl(productId));
  if (!res.ok) throw new Error("Inventory not found");
  return res.json();
}

export async function getCacheStats(): Promise<CacheStats> {
  const res = await fetch(cacheStatsUrl());
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

// ---------------------------------------------------------------------------
// Mutations — InventorySync
// ---------------------------------------------------------------------------

export interface ReserveResult {
  ok: boolean;
  status: number;
  latencyMs: number;
  body?: { id?: number; productId?: number; stock?: number; status?: string };
}

export async function reserveStock(
  productId: number,
  quantity: number
): Promise<ReserveResult> {
  const start = Date.now();
  const res = await fetch(
    `${INVENTORY_URL}/api/inventory/reserve?productId=${productId}&quantity=${quantity}`,
    { method: "POST" }
  );
  const latencyMs = Date.now() - start;
  let body: ReserveResult["body"];
  try {
    body = await res.json();
  } catch {
    body = undefined;
  }
  return { ok: res.ok, status: res.status, latencyMs, body };
}

export async function seedStock(productId: number, stock: number): Promise<Response> {
  return fetch(
    `${INVENTORY_URL}/api/inventory/seed?productId=${productId}&stock=${stock}`,
    { method: "POST" }
  );
}

// ---------------------------------------------------------------------------
// Mutations — CatalogCache admin CRUD
// ---------------------------------------------------------------------------

export type ProductInput = Omit<Product, "id">;

export async function createProduct(product: ProductInput): Promise<Product> {
  const res = await fetch(productsUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(
  id: number,
  product: ProductInput
): Promise<Product> {
  const res = await fetch(`${CATALOG_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${CATALOG_URL}/api/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
}

// ---------------------------------------------------------------------------
// Admin: create a variant — VariantGraph
// ---------------------------------------------------------------------------

export type VariantInput = Omit<ProductVariant, "id">;

export async function createVariant(variant: VariantInput): Promise<ProductVariant> {
  const res = await fetch(`${VARIANT_URL}/api/variants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(variant),
  });
  if (!res.ok) throw new Error("Failed to create variant");
  return res.json();
}
