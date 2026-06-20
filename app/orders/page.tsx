import type { Metadata } from "next";
import OrderHistory from "@/components/OrderHistory";

export const metadata: Metadata = {
  title: "My Orders — Varenya",
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          My orders
        </h1>
        <p className="mt-3 font-mono text-sm text-ink-soft">
          Your placed orders, newest first.
        </p>
      </div>

      <OrderHistory />
    </div>
  );
}
