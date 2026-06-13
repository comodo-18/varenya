import Link from "next/link";
import { getProducts } from "@/lib/api";
import ProductExplorer from "@/components/ProductExplorer";
import TelemetryStrip from "@/components/TelemetryStrip";
import { sourceStatusLabel } from "@/lib/utils";

export default async function HomePage() {
  const result = await getProducts().catch(() => null);
  const products = result?.data ?? [];
  const source = result?.source ?? null;
  const latencyMs = result?.latencyMs ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Furniture, served fast.
        </h1>
        <p className="mt-3 font-mono text-sm text-ink-soft">
          {products.length} {products.length === 1 ? "product" : "products"} · cursor
          pagination
        </p>
      </div>

      {!result ? (
        <div className="rounded-2xl border border-dashed border-hairline bg-white/60 px-6 py-20 text-center">
          <div className="relative mx-auto mb-4 flex h-10 w-10 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber/40" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber" />
          </div>
          <p className="font-heading text-2xl text-ink">Waking the server…</p>
          <p className="mx-auto mt-2 max-w-md font-mono text-sm text-ink-soft">
            The catalog service runs on Render&apos;s free tier and may take up to a
            minute to cold-start. Refresh in a moment.
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline bg-white/60 px-6 py-20 text-center">
          <p className="font-heading text-2xl text-ink">No products yet</p>
          <p className="mt-2 font-mono text-sm text-ink-soft">
            Seed some in{" "}
            <Link href="/admin" className="text-moss underline underline-offset-2">
              /admin
            </Link>
          </p>
        </div>
      ) : (
        <ProductExplorer products={products} source={source} latencyMs={latencyMs} />
      )}

      <div className="mt-10">
        <TelemetryStrip
          event={{
            method: "GET",
            path: "/products",
            status: result ? sourceStatusLabel(source) : "ERROR",
            source: source ?? undefined,
            latencyMs,
            detail: result ? undefined : "service unavailable",
          }}
        />
      </div>
    </div>
  );
}
