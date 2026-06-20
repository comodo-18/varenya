export interface Product {
  id: number;
  name: string;
  category: string;
  basePrice: number;
  stock: number;
}

export interface ProductVariant {
  id: number;
  colour: string;
  size: string;
  price: number;
  baseProductId: number;
}

export interface InventoryItem {
  id: number;
  productId: number;
  stock: number;
  status: string;
  lastUpdated: string;
}

export interface CacheStats {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: string;
}

export interface Order {
  id: number;
  productId: number;
  quantity: number;
  status: string;
  createdAt: string;
}

export type ResponseSource = "REDIS" | "POSTGRES" | "UNKNOWN";

export interface TelemetryEvent {
  method: string;
  path: string;
  status: string;
  source?: string;
  latencyMs?: number;
  detail?: string;
  timestamp?: number;
}
