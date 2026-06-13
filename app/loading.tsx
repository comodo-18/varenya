export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 max-w-2xl space-y-3">
        <div className="h-10 w-72 animate-pulse rounded-lg bg-hairline sm:w-96" />
        <div className="h-4 w-48 animate-pulse rounded bg-hairline" />
      </div>

      <div className="mb-6 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-hairline" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-hairline bg-white">
            <div className="aspect-[4/3] animate-pulse bg-hairline" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-hairline" />
              <div className="h-5 w-32 animate-pulse rounded bg-hairline" />
              <div className="h-5 w-20 animate-pulse rounded bg-hairline" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 h-10 animate-pulse rounded-xl bg-hairline" />
    </div>
  );
}
