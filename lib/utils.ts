import type { Product } from "./types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export type SourceKind = "redis" | "postgres" | "unknown";

export function classifySource(source: string | null | undefined): SourceKind {
  if (!source) return "unknown";
  const normalized = source.toLowerCase();
  if (normalized.includes("redis")) return "redis";
  if (normalized.includes("postgres") || normalized.includes("pg")) return "postgres";
  return "unknown";
}

export function categoryGradient(category: string): string {
  const map: Record<string, string> = {
    sofas: "from-moss/25 via-mint/15 to-porcelain",
    sofa: "from-moss/25 via-mint/15 to-porcelain",
    tables: "from-amber/30 via-amber/10 to-porcelain",
    table: "from-amber/30 via-amber/10 to-porcelain",
    lighting: "from-amber/35 via-mint/10 to-porcelain",
    lamp: "from-amber/35 via-mint/10 to-porcelain",
    chairs: "from-moss/20 via-amber/10 to-porcelain",
    chair: "from-moss/20 via-amber/10 to-porcelain",
    storage: "from-ink/10 via-moss/10 to-porcelain",
    decor: "from-mint/30 via-amber/10 to-porcelain",
    beds: "from-moss/20 via-mint/20 to-porcelain",
    bed: "from-moss/20 via-mint/20 to-porcelain",
  };
  return map[category.toLowerCase()] ?? "from-hairline via-porcelain to-hairline";
}

export function sourceStatusLabel(source: string | null | undefined): string {
  const kind = classifySource(source);
  if (kind === "redis") return "CACHE_HIT";
  if (kind === "postgres") return "CACHE_MISS";
  return "OK";
}

export function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    sofas: "\u{1F6CB}️",
    sofa: "\u{1F6CB}️",
    tables: "\u{1FA91}",
    table: "\u{1FA91}",
    lighting: "\u{1F4A1}",
    lamp: "\u{1F4A1}",
    chairs: "\u{1FA91}",
    chair: "\u{1FA91}",
    storage: "\u{1F5C4}️",
    decor: "\u{1F3FA}",
    beds: "\u{1F6CF}️",
    bed: "\u{1F6CF}️",
  };
  return map[category.toLowerCase()] ?? "\u{1FA84}";
}

export function productBlurb(product: Product): string {
  const category = product.category.toLowerCase();
  const map: Record<string, string> = {
    sofas: `The ${product.name} brings considered comfort to any living room — a frame built for years of evenings in.`,
    sofa: `The ${product.name} brings considered comfort to any living room — a frame built for years of evenings in.`,
    tables: `${product.name} pairs honest materials with a silhouette that holds its own at the centre of a room.`,
    table: `${product.name} pairs honest materials with a silhouette that holds its own at the centre of a room.`,
    lighting: `${product.name} casts a warm, even glow — designed to disappear into the room until you need it.`,
    lamp: `${product.name} casts a warm, even glow — designed to disappear into the room until you need it.`,
    chairs: `${product.name} is shaped for long sits and easy mornings, upholstered to age well.`,
    chair: `${product.name} is shaped for long sits and easy mornings, upholstered to age well.`,
    storage: `${product.name} keeps things put away without making a fuss — quiet hardware, solid joinery.`,
    decor: `${product.name} is the kind of small detail that makes a room feel finished.`,
    beds: `${product.name} is built around a good night's sleep — sturdy, supportive, and made to last.`,
    bed: `${product.name} is built around a good night's sleep — sturdy, supportive, and made to last.`,
  };
  return (
    map[category] ??
    `${product.name} is a considered addition to the ${category} collection — built for everyday use, finished for the long run.`
  );
}
