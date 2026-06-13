import { classifySource } from "@/lib/utils";

interface SourceBadgeProps {
  source?: string | null;
  latencyMs?: number;
  className?: string;
}

export default function SourceBadge({ source, latencyMs, className = "" }: SourceBadgeProps) {
  const kind = classifySource(source);

  if (kind === "unknown" && latencyMs == null) return null;

  const styles =
    kind === "redis"
      ? "bg-mint/20 text-moss-dark"
      : kind === "postgres"
        ? "bg-amber/25 text-ink"
        : "bg-hairline text-ink-soft";

  const label = kind === "redis" ? "REDIS" : kind === "postgres" ? "POSTGRES" : "API";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide ${styles} ${className}`}
    >
      {label}
      {latencyMs != null && <> · {latencyMs}ms</>}
    </span>
  );
}
