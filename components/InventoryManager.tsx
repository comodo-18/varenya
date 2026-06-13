"use client";

import { useState, type FormEvent } from "react";
import useSWR from "swr";
import { AnimatePresence, motion } from "framer-motion";
import { fetcher, inventoryUrl, seedStock } from "@/lib/api";
import type { InventoryItem, Product } from "@/lib/types";

interface InventoryManagerProps {
  products: Product[];
}

const inputClass =
  "rounded-lg border border-hairline bg-porcelain px-3 py-2 font-mono text-sm text-ink outline-none transition-colors focus:border-moss";

export default function InventoryManager({ products }: InventoryManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [productId, setProductId] = useState<number | "">(products[0]?.id ?? "");
  const [stock, setStock] = useState(0);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (productId === "") return;
    setBusy(true);
    try {
      await seedStock(Number(productId), stock);
      const product = products.find((p) => p.id === productId);
      setFeedback(`Seeded ${stock} units for "${product?.name ?? `#${productId}`}".`);
    } catch {
      setFeedback("Couldn't seed stock — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-hairline bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-semibold text-ink">Inventory management</h2>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          disabled={products.length === 0}
          className="rounded-full bg-moss px-4 py-2 font-mono text-xs font-medium text-porcelain transition-colors hover:bg-moss-dark disabled:opacity-50"
        >
          {showForm ? "Cancel" : "+ Seed stock"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-wrap gap-3">
              <select
                value={productId}
                onChange={(e) => setProductId(Number(e.target.value))}
                className={inputClass}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                required
                type="number"
                min={0}
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className={`${inputClass} w-28`}
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-ink px-5 py-2 font-mono text-xs font-medium text-porcelain transition-colors hover:bg-ink/80 disabled:opacity-50"
              >
                Seed
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {feedback && <p className="mt-3 font-mono text-xs text-ink-soft">{feedback}</p>}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left font-mono text-sm">
          <thead>
            <tr className="border-b border-hairline text-xs uppercase tracking-wider text-ink-soft">
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <InventoryRow key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-ink-soft">
                  No inventory records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InventoryRow({ product }: { product: Product }) {
  const { data } = useSWR<InventoryItem>(inventoryUrl(product.id), fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
  });

  const stock = data?.stock ?? product.stock;
  const status = data?.status || (stock > 0 ? "AVAILABLE" : "OUT_OF_STOCK");
  const isAvailable = status === "AVAILABLE";

  return (
    <tr className="border-b border-hairline/60 last:border-0">
      <td className="py-2 pr-4 text-ink">{product.name}</td>
      <td className="py-2 pr-4 text-ink-soft">{stock}</td>
      <td className="py-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            isAvailable ? "bg-mint/40 text-moss-dark" : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
