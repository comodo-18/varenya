export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-porcelain">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4 py-8 text-center sm:px-6">
        <p className="font-heading text-base text-ink">
          Varenya <span className="text-ink-soft">— distributed catalog</span>
        </p>
        <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">
          Next.js · Spring Boot × 3
        </p>
      </div>
    </footer>
  );
}
