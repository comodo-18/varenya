import Link from "next/link";
import type { ProductVariant } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface VariantSwatchesProps {
  variants: ProductVariant[];
  currentProductId: number;
}

export default function VariantSwatches({ variants, currentProductId }: VariantSwatchesProps) {
  if (variants.length === 0) return null;

  return (
    <div>
      <p className="mb-2 font-mono text-xs uppercase tracking-wider text-ink-soft">Variants</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const selected = variant.id === currentProductId;
          return (
            <Link
              key={variant.id}
              href={`/product/${variant.id}`}
              className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors sm:text-sm ${
                selected
                  ? "border-ink bg-ink text-porcelain"
                  : "border-hairline bg-white text-ink hover:border-ink/40"
              }`}
            >
              {variant.colour} · {variant.size}
              <span className={selected ? "text-porcelain/60" : "text-ink-soft"}>
                {" "}
                {formatPrice(variant.price)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
