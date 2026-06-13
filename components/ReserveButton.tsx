"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { fetcher, inventoryUrl, reserveStock } from "@/lib/api";
import type { InventoryItem, TelemetryEvent } from "@/lib/types";

type ReserveState = "idle" | "loading" | "success" | "error";

interface ReserveButtonProps {
  productId: number;
  initialStock: number;
  onReserve?: (event: TelemetryEvent) => void;
}

export default function ReserveButton({ productId, initialStock, onReserve }: ReserveButtonProps) {
  const { data, mutate } = useSWR<InventoryItem>(inventoryUrl(productId), fetcher, {
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

  const [quantity, setQuantity] = useState(1);
  const [state, setState] = useState<ReserveState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const outOfStock = stock <= 0;

  async function handleReserve() {
    if (outOfStock || state === "loading") return;
    setState("loading");
    setMessage(null);

    const result = await reserveStock(productId, quantity);

    if (result.ok) {
      const newStock = result.body?.stock ?? Math.max(stock - quantity, 0);
      setState("success");
      setMessage(`LOCK_ACQUIRED → stock ${stock}→${newStock} → LOCK_RELEASED ${result.latencyMs}ms`);
      mutate({
        id: data?.id ?? 0,
        productId,
        stock: newStock,
        status: data?.status ?? "",
        lastUpdated: new Date().toISOString(),
      });
      onReserve?.({
        method: "POST",
        path: "/reserve",
        status: "RESERVED",
        source: "redisson",
        latencyMs: result.latencyMs,
        detail: `stock: ${newStock} left`,
        timestamp: Date.now(),
      });
    } else {
      setState("error");
      setMessage("Insufficient stock");
      onReserve?.({
        method: "POST",
        path: "/reserve",
        status: "REJECTED",
        latencyMs: result.latencyMs,
        detail: "insufficient stock",
        timestamp: Date.now(),
      });
    }

    setTimeout(() => {
      setState("idle");
      setMessage(null);
    }, 2200);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">Reserve</p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-hairline bg-white">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={state === "loading"}
            className="flex h-10 w-10 items-center justify-center text-lg text-ink-soft transition-colors hover:text-ink disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center font-mono text-sm text-ink">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(Math.max(stock, 1), q + 1))}
            disabled={state === "loading" || quantity >= stock}
            className="flex h-10 w-10 items-center justify-center text-lg text-ink-soft transition-colors hover:text-ink disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <motion.button
          type="button"
          onClick={handleReserve}
          disabled={outOfStock || state === "loading"}
          animate={state === "error" ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className={`flex-1 rounded-full px-6 py-2.5 text-center font-mono text-sm font-medium transition-colors duration-300 sm:flex-none ${
            state === "success"
              ? "bg-mint text-moss-dark"
              : state === "error"
                ? "bg-red-100 text-red-600"
                : outOfStock
                  ? "cursor-not-allowed bg-hairline text-ink-soft"
                  : "bg-moss text-porcelain hover:bg-moss-dark"
          }`}
        >
          {state === "loading" && (
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-porcelain" />
              Acquiring lock…
            </span>
          )}
          {state === "success" && "Reserved!"}
          {state === "error" && "Insufficient stock"}
          {state === "idle" && (outOfStock ? "Out of stock" : "Reserve stock")}
        </motion.button>
      </div>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs text-ink-soft"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
