export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 h-4 w-64 animate-pulse rounded bg-hairline" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-hairline" />

        <div className="flex flex-col gap-4">
          <div className="h-3 w-20 animate-pulse rounded bg-hairline" />
          <div className="h-8 w-64 animate-pulse rounded bg-hairline" />
          <div className="h-6 w-28 animate-pulse rounded bg-hairline" />
          <div className="h-4 w-40 animate-pulse rounded bg-hairline" />
          <div className="h-16 w-full max-w-md animate-pulse rounded bg-hairline" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 w-24 animate-pulse rounded-lg bg-hairline" />
            ))}
          </div>
          <div className="mt-2 border-t border-hairline pt-5">
            <div className="h-10 w-full max-w-xs animate-pulse rounded-full bg-hairline" />
          </div>
        </div>
      </div>

      <div className="mt-10 h-10 animate-pulse rounded-xl bg-hairline" />
    </div>
  );
}
