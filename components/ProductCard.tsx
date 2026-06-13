"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { categoryEmoji, categoryGradient, formatPrice } from "@/lib/utils";
import SourceBadge from "./SourceBadge";

interface ProductCardProps {
  product: Product;
  index?: number;
  source?: string | null;
  latencyMs?: number;
}

export default function ProductCard({ product, index = 0, source, latencyMs }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/product/${product.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
      >
        <div
          className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${categoryGradient(
            product.category
          )} text-5xl transition-transform duration-500 group-hover:scale-105 sm:text-6xl`}
        >
          <span aria-hidden>{categoryEmoji(product.category)}</span>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
            {product.category}
          </p>
          <h3 className="font-heading text-lg font-medium leading-tight text-ink">
            {product.name}
          </h3>
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <span className="font-mono text-base font-semibold text-ink">
              {formatPrice(product.basePrice)}
            </span>
            <SourceBadge source={source} latencyMs={latencyMs} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
