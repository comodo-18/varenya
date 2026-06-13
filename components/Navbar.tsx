import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-porcelain/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight text-ink">
          Varenya<span className="text-moss">.</span>
        </Link>
        <nav className="flex items-center gap-6 font-body text-sm font-medium text-ink-soft">
          <Link href="/" className="transition-colors hover:text-ink">
            Shop
          </Link>
          <Link href="/admin" className="transition-colors hover:text-ink">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
