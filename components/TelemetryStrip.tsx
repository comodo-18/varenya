"use client";

import useSWR from "swr";
import type { CacheStats, TelemetryEvent } from "@/lib/types";
import { cacheStatsUrl, fetcher } from "@/lib/api";

interface TelemetryStripProps {
  event: TelemetryEvent;
  showHitRate?: boolean;
}

export default function TelemetryStrip({ event, showHitRate = true }: TelemetryStripProps) {
  const { data } = useSWR<CacheStats>(showHitRate ? cacheStatsUrl() : null, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
  });

  return (
    <div className="overflow-x-auto rounded-xl bg-terminal px-4 py-3 font-mono text-xs text-white sm:text-sm">
      <div className="flex flex-nowrap items-center gap-x-3 gap-y-1 whitespace-nowrap">
        <span className="flex items-center gap-1.5 font-medium text-mint">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
          </span>
          LIVE
        </span>
        <span className="text-white/30">|</span>
        <span>
          <span className="text-amber">{event.method}</span>{" "}
          <span className="text-white/80">{event.path}</span>{" "}
          <span className="text-white/40">→</span>{" "}
          <span className="text-mint">{event.status}</span>
          {event.source && (
            <>
              {" "}
              <span className="text-amber">{event.source.toLowerCase()}</span>
            </>
          )}
          {event.latencyMs != null && <span className="text-white/80"> {event.latencyMs}ms</span>}
          {event.detail && <span className="text-white/60"> {event.detail}</span>}
        </span>
        {data && (
          <>
            <span className="hidden text-white/30 sm:inline">|</span>
            <span className="hidden text-white/50 sm:inline">hit rate: {data.hitRate}</span>
          </>
        )}
      </div>
    </div>
  );
}
