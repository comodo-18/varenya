"use client";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {["All", ...categories].map((category) => {
        const active = category === selected;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full border px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-wide transition-colors duration-200 ${
              active
                ? "border-ink bg-ink text-porcelain"
                : "border-hairline bg-white text-ink-soft hover:border-ink/40 hover:text-ink"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
