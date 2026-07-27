"use client";

import { useMemo, useState } from "react";
import type { Exercise } from "@prisma/client";
import { Search, X } from "lucide-react";

export default function ExerciseExplorer({
  exercises,
}: {
  exercises: Exercise[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [equipment, setEquipment] = useState("Todos");
  const [selected, setSelected] = useState<Exercise | null>(null);

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(exercises.map((e) => e.category)))],
    [exercises]
  );
  const equipments = useMemo(
    () => [
      "Todos",
      ...Array.from(
        new Set(exercises.map((e) => e.equipment).filter(Boolean) as string[])
      ),
    ],
    [exercises]
  );

  const filtered = exercises.filter((e) => {
    const matchesQuery = e.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "Todos" || e.category === category;
    const matchesEquipment =
      equipment === "Todos" || e.equipment === equipment;
    return matchesQuery && matchesCategory && matchesEquipment;
  });

  return (
    <div className="px-4 py-4">
      <div className="relative mb-3">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={20}
        />
        <input
          type="text"
          inputMode="search"
          placeholder="Buscar ejercicio..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[48px] w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-base outline-none focus:border-cyan-500"
        />
      </div>

      <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`min-h-[40px] shrink-0 rounded-full px-4 text-sm font-medium transition-colors ${
              category === c
                ? "bg-cyan-500 text-gray-950"
                : "bg-gray-900 text-gray-300 border border-gray-800"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {equipments.map((eq) => (
          <button
            key={eq}
            onClick={() => setEquipment(eq)}
            className={`min-h-[40px] shrink-0 rounded-full px-4 text-sm font-medium transition-colors ${
              equipment === eq
                ? "bg-gray-100 text-gray-950"
                : "bg-gray-900 text-gray-400 border border-gray-800"
            }`}
          >
            {eq}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setSelected(ex)}
            className="flex min-h-[48px] flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900 text-left active:scale-[0.98] transition-transform"
          >
            <div className="relative aspect-square w-full bg-gray-800">
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
            <div className="p-2">
              <p className="line-clamp-2 text-sm font-semibold">{ex.name}</p>
              <p className="text-xs text-gray-500">{ex.category}</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-8 text-center text-gray-500">
            No se encontraron ejercicios.
          </p>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-gray-950 border border-gray-800 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-800 p-4">
              <h2 className="text-lg font-bold">{selected.name}</h2>
              <button
                onClick={() => setSelected(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            {selected.videoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.videoUrl}
                alt={selected.name}
                className="w-full bg-gray-900 object-contain"
              />
            )}
            <div className="space-y-2 p-4">
              <p className="text-sm text-gray-400">
                {selected.category}
                {selected.equipment ? ` · ${selected.equipment}` : ""}
              </p>
              {selected.instructions && (
                <p className="text-sm leading-relaxed text-gray-200">
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
