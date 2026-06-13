"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Product, ProductVariant, TelemetryEvent } from "@/lib/types";
import { categoryEmoji, categoryGradient, formatPrice, productBlurb, sourceStatusLabel } from "@/lib/utils";
import StockBadge from "./StockBadge";
import ReserveButton from "./ReserveButton";
import VariantSwatches from "./VariantSwatches";
import TelemetryStrip from "./TelemetryStrip";

interface ProductDetailProps {
  product: Product;
  variants: ProductVariant[];
  source: string | null;
  latencyMs: number;
}

export default function ProductDetail({ product, variants, source, latencyMs }: ProductDetailProps) {
  const [event, setEvent] = useState<TelemetryEvent>({
    method: "GET",
    path: `/products/${product.id}`,
    status: sourceStatusLabel(source),
    source: source ?? undefined,
    latencyMs,
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleReserve(next: TelemetryEvent) {
    setEvent(next);
    if (next.status === "RESERVED") {
      setToast(`Reserved · lock held ${next.latencyMs}ms`);
    } else if (next.status === "REJECTED") {
      setToast(`Reservation failed · ${next.detail ?? "insufficient stock"}`);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="mb-6 font-mono text-xs uppercase tracking-wider text-ink-soft">
        <Link href="/" className="transition-colors hover:text-ink">
          Shop
        </Link>
        <span className="px-1.5">/</span>
        <span>{product.category}</span>
        <span className="px-1.5">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`flex aspect-square items-center justify-center rounded-2xl border border-hairline bg-gradient-to-br text-8xl sm:text-9xl ${categoryGradient(product.category)}`}
        >
          <span aria-hidden>{categoryEmoji(product.category)}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">{product.category}</p>
            <h1 className="mt-1 font-heading text-3xl font-semibold text-ink sm:text-4xl">{product.name}</h1>
            <p className="mt-2 font-mono text-2xl font-semibold text-ink">{formatPrice(product.basePrice)}</p>
          </div>

          <StockBadge productId={product.id} initialStock={product.stock} />

          <p className="max-w-md text-sm leading-relaxed text-ink-soft">{productBlurb(product)}</p>

          <VariantSwatches variants={variants} currentProductId={product.id} />

          <div className="mt-2 border-t border-hairline pt-5">
            <ReserveButton productId={product.id} initialStock={product.stock} onReserve={handleReserve} />
          </div>
        </motion.div>
      </div>

      <div className="mt-10">
        <TelemetryStrip event={event} showHitRate={false} />
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-5 py-2.5 font-mono text-sm text-porcelain shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
