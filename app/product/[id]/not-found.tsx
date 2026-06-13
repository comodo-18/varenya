import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
      <span className="text-5xl" aria-hidden>
        🪑
      </span>
      <p className="font-heading text-3xl text-ink">This product doesn&apos;t exist</p>
      <p className="max-w-md font-mono text-sm text-ink-soft">
        It may have been removed, sold out of the catalog, or the link is incorrect.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-moss px-6 py-2 font-mono text-sm font-medium text-porcelain transition-colors hover:bg-moss-dark"
      >
        ← Back to shop
      </Link>
    </div>
  );
}
