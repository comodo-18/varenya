"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { fetcher, inventoryUrl } from "@/lib/api";
import type { InventoryItem } from "@/lib/types";

interface StockBadgeProps {
  productId: number;
  initialStock: number;
}

export default function StockBadge({ productId, initialStock }: StockBadgeProps) {
  const { data } = useSWR<InventoryItem>(inventoryUrl(productId), fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
    fallbackData: {
      id: 0,
      productId,
      stock: initialStock,
      status: "",
      lastUpdated: "",
    },
  });

  const stock = data?.stock ?? initialStock;

  let dotColor: string;
  let label: string;
  if (stock <= 0) {
    dotColor = "bg-red-500";
    label = "Out of stock";
  } else if (stock <= 5) {
    dotColor = "bg-amber";
    label = "Low stock";
  } else {
    dotColor = "bg-mint";
    label = "In stock";
  }

  return (
    <div className="flex items-center gap-2 font-mono text-sm text-ink-soft">
      <span className="relative flex h-2.5 w-2.5">
        {stock > 0 && stock <= 5 && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dotColor} opacity-75`} />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotColor}`} />
      </span>
      <span>
        {label}
        {stock > 0 && (
          <>
            {" — "}
            <motion.span
              key={stock}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="inline-block font-semibold tabular-nums text-ink"
            >
              {stock}
            </motion.span>{" "}
            {stock === 1 ? "unit" : "units"}
          </>
        )}
      </span>
    </div>
  );
}
