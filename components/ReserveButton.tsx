"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { fetcher, inventoryUrl } from "@/lib/api";
import { useAuth, placeOrder } from "@/lib/auth";
import AuthModal from "./AuthModal";
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
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [state, setState] = useState<ReserveState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const outOfStock = stock <= 0;

  async function handleReserve() {
    if (outOfStock || state === "loading") return;

    if (!user) {
      setAuthOpen(true);
      return;
    }

    setState("loading");
    setMessage(null);
    setOrderId(null);

    try {
      const result = await placeOrder(productId, quantity);

      if (result.ok) {
        const newStock = Math.max(stock - quantity, 0);
        const id = result.body?.id ?? result.body?.orderId;
        setState("success");
        setOrderId(id != null ? String(id) : null);
        setMessage(
          `ORDER_PLACED → stock ${stock}→${newStock} → ${result.latencyMs}ms`
        );
        mutate({
          id: data?.id ?? 0,
          productId,
          stock: newStock,
          status: data?.status ?? "",
          lastUpdated: new Date().toISOString(),
        });
        onReserve?.({
          method: "POST",
          path: "/api/orders",
          status: "ORDERED",
          source: "order-service",
          latencyMs: result.latencyMs,
          detail: `order placed, stock: ${newStock} left`,
          timestamp: Date.now(),
        });
      } else {
        setState("error");
        const reason =
          typeof result.body?.message === "string"
            ? result.body.message
            : "Order failed";
        setMessage(reason);
        onReserve?.({
          method: "POST",
          path: "/api/orders",
          status: "REJECTED",
          latencyMs: result.latencyMs,
          detail: reason,
          timestamp: Date.now(),
        });
      }
    } catch {
      setState("error");
      setMessage("Network error");
    }

    setTimeout(() => {
      setState("idle");
      setMessage(null);
      setOrderId(null);
    }, 3000);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">
        {user ? "Place order" : "Reserve"}
      </p>
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
              Placing order…
            </span>
          )}
          {state === "success" && "Order placed!"}
          {state === "error" && "Order failed"}
          {state === "idle" &&
            (outOfStock
              ? "Out of stock"
              : user
                ? "Place order"
                : "Sign in to order")}
        </motion.button>
      </div>

      {orderId && state === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-mint/40 bg-mint/10 px-3 py-2"
        >
          <p className="font-mono text-xs text-moss-dark">
            Order confirmed — #{orderId}
          </p>
        </motion.div>
      )}

      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs text-ink-soft"
        >
          {message}
        </motion.p>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
