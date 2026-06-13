"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import CategoryFilter from "./CategoryFilter";
import ProductGrid from "./ProductGrid";

interface ProductExplorerProps {
  products: Product[];
  source?: string | null;
  latencyMs?: number;
}

export default function ProductExplorer({ products, source, latencyMs }: ProductExplorerProps) {
  const [selected, setSelected] = useState("All");

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const filtered = useMemo(
    () => (selected === "All" ? products : products.filter((p) => p.category === selected)),
    [products, selected]
  );

  return (
    <div className="flex flex-col gap-6">
      <CategoryFilter categories={categories} selected={selected} onChange={setSelected} />
      <ProductGrid products={filtered} source={source} latencyMs={latencyMs} />
    </div>
  );
}
