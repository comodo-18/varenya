"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createProduct, deleteProduct, updateProduct, type ProductInput } from "@/lib/api";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface ProductManagerProps {
  products: Product[];
  onMutate: () => void;
}

const emptyForm: ProductInput = { name: "", category: "", basePrice: 0, stock: 0 };

const inputClass =
  "rounded-lg border border-hairline bg-porcelain px-3 py-2 font-mono text-sm text-ink outline-none transition-colors focus:border-moss";

export default function ProductManager({ products, onMutate }: ProductManagerProps) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
    setFeedback(null);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      basePrice: product.basePrice,
      stock: product.stock,
    });
    setShowForm(true);
    setFeedback(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (editing) {
        await updateProduct(editing.id, form);
        setFeedback(`Updated "${form.name}".`);
      } else {
        await createProduct(form);
        setFeedback(`Created "${form.name}".`);
      }
      setShowForm(false);
      setEditing(null);
      onMutate();
    } catch {
      setFeedback("Something went wrong — try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    setBusy(true);
    try {
      await deleteProduct(product.id);
      setFeedback(`Deleted "${product.name}".`);
      onMutate();
    } catch {
      setFeedback("Couldn't delete — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-hairline bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-semibold text-ink">Product management</h2>
        <button
          type="button"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditing(null);
            } else {
              openAdd();
            }
          }}
          className="rounded-full bg-moss px-4 py-2 font-mono text-xs font-medium text-porcelain transition-colors hover:bg-moss-dark"
        >
          {showForm ? "Cancel" : "+ Add product"}
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
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
              <input
                required
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={inputClass}
              />
              <input
                required
                type="number"
                min={0}
                placeholder="Base price"
                value={form.basePrice}
                onChange={(e) => setForm((f) => ({ ...f, basePrice: Number(e.target.value) }))}
                className={inputClass}
              />
              <input
                required
                type="number"
                min={0}
                placeholder="Stock"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="mt-3 rounded-full bg-ink px-5 py-2 font-mono text-xs font-medium text-porcelain transition-colors hover:bg-ink/80 disabled:opacity-50"
            >
              {editing ? "Save changes" : "Create product"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {feedback && <p className="mt-3 font-mono text-xs text-ink-soft">{feedback}</p>}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left font-mono text-sm">
          <thead>
            <tr className="border-b border-hairline text-xs uppercase tracking-wider text-ink-soft">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-hairline/60 last:border-0">
                <td className="py-2 pr-4 text-ink">{product.name}</td>
                <td className="py-2 pr-4 text-ink-soft">{product.category}</td>
                <td className="py-2 pr-4 text-ink">{formatPrice(product.basePrice)}</td>
                <td className="py-2 pr-4 text-ink-soft">{product.stock}</td>
                <td className="py-2 text-right">
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    aria-label={`Edit ${product.name}`}
                    className="rounded-md px-2 py-1 text-ink-soft transition-colors hover:text-ink"
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    aria-label={`Delete ${product.name}`}
                    className="rounded-md px-2 py-1 text-ink-soft transition-colors hover:text-red-500"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-ink-soft">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
