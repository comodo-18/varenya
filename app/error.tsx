"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber/40" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-amber" />
      </div>
      <h2 className="font-heading text-2xl text-ink">Waking the server…</h2>
      <p className="max-w-md font-mono text-sm text-ink-soft">
        The backend services run on Render&apos;s free tier and may take up to a minute
        to cold-start. Hang tight and try again.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-2 rounded-full bg-moss px-6 py-2 font-mono text-sm font-medium text-porcelain transition-colors hover:bg-moss-dark"
      >
        Try again
      </button>
    </div>
  );
}
