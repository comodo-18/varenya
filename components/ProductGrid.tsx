import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  source?: string | null;
  latencyMs?: number;
}

export default function ProductGrid({ products, source, latencyMs }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline bg-white/60 px-6 py-16 text-center">
        <p className="font-heading text-xl text-ink">No products match this filter.</p>
        <p className="mt-1 font-mono text-sm text-ink-soft">Try a different category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          source={source}
          latencyMs={latencyMs}
        />
      ))}
    </div>
  );
}
