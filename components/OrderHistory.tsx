"use client";

import Link from "next/link";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useAuth, getMyOrders } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { Order } from "@/lib/types";

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toUpperCase() ?? "";

  let cls = "border-hairline bg-porcelain text-ink-soft";
  if (["CONFIRMED", "COMPLETED", "PLACED", "RESERVED"].includes(normalized)) {
    cls = "border-mint/50 bg-mint/15 text-moss-dark";
  } else if (["PENDING", "PROCESSING"].includes(normalized)) {
    cls = "border-amber/50 bg-amber/15 text-ink";
  } else if (["CANCELLED", "FAILED", "REJECTED"].includes(normalized)) {
    cls = "border-red-200 bg-red-50 text-red-600";
  }

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${cls}`}
    >
      {status}
    </span>
  );
}

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-hairline bg-white/60 px-6 py-20 text-center">
      {children}
    </div>
  );
}

export default function OrderHistory() {
  const { user, token } = useAuth();

  // Keyed on the token so the list refetches when the user logs in/out.
  // A null key keeps SWR idle while signed out — no spurious loading state.
  const { data, error, isLoading } = useSWR<Order[]>(
    token ? ["my-orders", token] : null,
    getMyOrders,
    { revalidateOnFocus: false }
  );

  if (!user || !token) {
    return (
      <EmptyCard>
        <p className="font-heading text-2xl text-ink">Sign in to view your orders</p>
        <p className="mt-2 font-mono text-sm text-ink-soft">
          Use the{" "}
          <span className="text-moss">Sign in</span> button up top, then your order
          history will appear here.
        </p>
      </EmptyCard>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-hairline bg-white/60 px-6 py-20">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-hairline border-t-moss" />
        <p className="font-mono text-sm text-ink-soft">Loading your orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyCard>
        <p className="font-heading text-2xl text-ink">Couldn&apos;t load your orders</p>
        <p className="mt-2 font-mono text-sm text-ink-soft">
          The order service may be cold-starting on Render — try again in a moment.
        </p>
      </EmptyCard>
    );
  }

  const orders = data ?? [];

  if (orders.length === 0) {
    return (
      <EmptyCard>
        <p className="font-heading text-2xl text-ink">No orders yet</p>
        <p className="mt-2 font-mono text-sm text-ink-soft">
          Browse the{" "}
          <Link href="/" className="text-moss underline underline-offset-2">
            catalog
          </Link>{" "}
          and place your first order.
        </p>
      </EmptyCard>
    );
  }

  const sorted = [...orders].sort((a, b) => {
    const ta = new Date(a.createdAt).getTime();
    const tb = new Date(b.createdAt).getTime();
    if (!Number.isNaN(ta) && !Number.isNaN(tb) && ta !== tb) return tb - ta;
    return b.id - a.id;
  });

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((order, index) => (
        <motion.li
          key={order.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
          className="rounded-2xl border border-hairline bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Order
              </p>
              <p className="font-heading text-lg font-medium text-ink">#{order.id}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-ink-soft">
            <span>
              Product <span className="text-ink">#{order.productId}</span>
            </span>
            <span>
              Qty <span className="text-ink">{order.quantity}</span>
            </span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
