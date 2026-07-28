"use client";

import { useMemo, useState } from "react";
import type { Exercise } from "@prisma/client";
import { ListFilter, Search, X } from "lucide-react";
import ExerciseDetailModal from "@/components/ExerciseDetailModal";

export default function ExerciseExplorer({
  exercises,
}: {
  exercises: Exercise[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [equipment, setEquipment] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(exercises.map((e) => e.category))).sort()],
    [exercises]
  );
  const equipments = useMemo(
    () => [
      "Todos",
      ...Array.from(
        new Set(exercises.map((e) => e.equipment).filter(Boolean) as string[])
      ).sort(),
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

  const activeFilterCount =
    (category !== "Todos" ? 1 : 0) + (equipment !== "Todos" ? 1 : 0);

  function clearFilters() {
    setCategory("Todos");
    setEquipment("Todos");
  }

  return (
    <div className="px-5 py-5">
      <div className="mb-5 flex gap-2">
        <div className="relative flex-1">
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
        <button
          onClick={() => setShowFilters(true)}
          className={`relative flex min-h-[48px] w-[48px] shrink-0 items-center justify-center rounded-2xl border transition-colors ${
            activeFilterCount > 0
              ? "border-accent/50 bg-accent/10 text-accent"
              : "border-border bg-surface text-muted"
          }`}
          aria-label="Filtros"
        >
          <ListFilter size={19} />
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((ex) => (
          <ExerciseDetailModal
            key={ex.id}
            exercise={ex}
            triggerClassName="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface text-left transition-transform active:scale-[0.97]"
            trigger={
              <>
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
              </>
            }
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 rounded-2xl border border-dashed border-border py-10 text-center">
            <p className="text-sm text-muted">No se encontraron ejercicios.</p>
          </div>
        )}
      </div>

      {showFilters && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="animate-fade-in flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-border bg-surface sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-semibold tracking-tight">Filtros</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted active:bg-border"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
                  Categoría
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`min-h-[38px] rounded-full px-4 text-sm font-medium transition-all ${
                        category === c
                          ? "bg-accent text-accent-foreground"
                          : "border border-border bg-surface-2 text-muted active:bg-border"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
                  Equipo
                </h3>
                <div className="flex flex-wrap gap-2">
                  {equipments.map((eq) => (
                    <button
                      key={eq}
                      onClick={() => setEquipment(eq)}
                      className={`min-h-[38px] rounded-full px-4 text-sm font-medium transition-all ${
                        equipment === eq
                          ? "bg-accent text-accent-foreground"
                          : "border border-border bg-surface-2 text-muted active:bg-border"
                      }`}
                    >
                      {eq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 border-t border-border p-4">
              <button
                onClick={clearFilters}
                disabled={activeFilterCount === 0}
                className="min-h-[48px] flex-1 rounded-2xl border border-border font-semibold text-foreground transition-colors active:bg-surface-2 disabled:opacity-40"
              >
                Limpiar
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="min-h-[48px] flex-1 rounded-2xl bg-accent font-semibold text-accent-foreground transition-transform active:scale-[0.98]"
              >
                Ver {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
