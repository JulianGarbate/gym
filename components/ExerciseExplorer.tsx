"use client";

import { useState } from "react";
import type { Exercise } from "@prisma/client";
import { Search, X } from "lucide-react";

export default function ExerciseExplorer({
  exercises,
}: {
  exercises: Exercise[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Exercise | null>(null);

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="px-5 py-5">
      <div className="relative mb-5">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          size={19}
        />
        <input
          type="text"
          inputMode="search"
          placeholder="Buscar ejercicio..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[48px] w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-4 text-base text-foreground outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setSelected(ex)}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface text-left transition-transform active:scale-[0.97]"
          >
            <div className="relative aspect-square w-full bg-surface-2">
              {ex.videoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ex.videoUrl}
                  alt={ex.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="p-2.5">
              <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                {ex.name}
              </p>
              <p className="mt-0.5 text-xs text-muted">{ex.category}</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 rounded-2xl border border-dashed border-border py-10 text-center">
            <p className="text-sm text-muted">No se encontraron ejercicios.</p>
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="animate-fade-in max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-surface sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-semibold tracking-tight">
                {selected.name}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted active:bg-border"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
            {selected.videoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.videoUrl}
                alt={selected.name}
                className="w-full bg-surface-2 object-contain"
              />
            )}
            <div className="space-y-2.5 p-4">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
                {selected.category}
                {selected.equipment ? ` · ${selected.equipment}` : ""}
              </p>
              {selected.instructions && (
                <p className="text-sm leading-relaxed text-foreground/90">
                  {selected.instructions}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
