"use client";

import useSWR from "swr";
import { fetcher, productsUrl } from "@/lib/api";
import type { Product } from "@/lib/types";
import CacheStats from "@/components/CacheStats";
import ProductManager from "@/components/ProductManager";
import InventoryManager from "@/components/InventoryManager";

export default function AdminPage() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(productsUrl(), fetcher, {
    revalidateOnFocus: false,
  });

  const products = data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Admin dashboard
        </h1>
        <p className="mt-3 font-mono text-sm text-ink-soft">
          Client-side rendered — always fresh, no cache.
        </p>
      </div>

      <div className="mb-8">
        <CacheStats products={products} />
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-dashed border-hairline bg-white/60 px-6 py-10 text-center">
          <p className="font-heading text-xl text-ink">Couldn&apos;t reach the catalog service</p>
          <p className="mt-2 font-mono text-sm text-ink-soft">
            It may be cold-starting on Render — try again in a moment.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-8">
          <div className="h-48 animate-pulse rounded-2xl bg-hairline" />
          <div className="h-48 animate-pulse rounded-2xl bg-hairline" />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <ProductManager products={products} onMutate={() => mutate()} />
          <InventoryManager products={products} />
        </div>
      )}
    </div>
  );
}
