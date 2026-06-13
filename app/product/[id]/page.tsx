import { notFound } from "next/navigation";
import { getProductById, getVariants } from "@/lib/api";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  const [productResult, variants] = await Promise.all([
    Number.isNaN(productId) ? Promise.resolve(null) : getProductById(productId).catch(() => null),
    Number.isNaN(productId) ? Promise.resolve([]) : getVariants(productId),
  ]);

  if (!productResult) notFound();

  const { data: product, source, latencyMs } = productResult;

  return <ProductDetail product={product} variants={variants} source={source} latencyMs={latencyMs} />;
}
