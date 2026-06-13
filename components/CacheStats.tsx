"use client";

import { useEffect, useRef } from "react";
import useSWR from "swr";
import { animate } from "framer-motion";
import { cacheStatsUrl, fetcher } from "@/lib/api";
import type { CacheStats as CacheStatsType, Product } from "@/lib/types";

interface CacheStatsProps {
  products: Product[];
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(prev.current, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (latest) => {
        node.textContent = `${Math.round(latest).toLocaleString()}${suffix}`;
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, suffix]);

  return <span ref={ref} className="tabular-nums">0{suffix}</span>;
}

export default function CacheStats({ products }: CacheStatsProps) {
  const { data, error } = useSWR<CacheStatsType>(cacheStatsUrl(), fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
  });

  const hitRateMatch = data?.hitRate?.match(/[\d.]+/);
  const hitRateValue = hitRateMatch ? parseFloat(hitRateMatch[0]) : null;
  const hitRateSuffix = data?.hitRate ? data.hitRate.replace(/^[\d.]+/, "") || "%" : "%";

  const stats = [
    {
      label: "Hit rate",
      content: hitRateValue != null ? <CountUp value={hitRateValue} suffix={hitRateSuffix} /> : "—",
    },
    {
      label: "Requests",
      content: data ? <CountUp value={data.totalRequests} /> : "—",
    },
    {
      label: "Products",
      content: <CountUp value={products.length} />,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-hairline bg-white p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">{stat.label}</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-ink">{stat.content}</p>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-2 font-mono text-xs text-red-500">
          Couldn&apos;t reach cache stats — the catalog service may be cold-starting.
        </p>
      )}
    </div>
  );
}
