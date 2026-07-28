"use client";

import { useState, useTransition } from "react";
import type { Exercise } from "@prisma/client";
import { ChevronLeft, Plus, Search, X } from "lucide-react";
import { addRoutineItem } from "@/app/actions/routines";

export default function AddExerciseToRoutine({
  routineId,
  exercises,
}: {
  routineId: string;
  exercises: Exercise[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<Exercise | null>(null);
  const [sets, setSets] = useState("3");
  const [repsMin, setRepsMin] = useState("8");
  const [repsMax, setRepsMax] = useState("10");
  const [pending, startTransition] = useTransition();

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  function reset() {
    setOpen(false);
    setQuery("");
    setChosen(null);
    setSets("3");
    setRepsMin("8");
    setRepsMax("10");
  }

  function handleConfirm() {
    if (!chosen) return;
    startTransition(async () => {
      await addRoutineItem(
        routineId,
        chosen.id,
        parseInt(sets, 10) || 3,
        repsMin ? parseInt(repsMin, 10) : null,
        repsMax ? parseInt(repsMax, 10) : null
      );
      reset();
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border font-medium text-muted transition-colors active:bg-surface"
      >
        <Plus size={19} />
        Agregar ejercicio
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          onClick={reset}
        >
          <div
            className="animate-fade-in flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-border bg-surface sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                {chosen && (
                  <button
                    onClick={() => setChosen(null)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-muted"
                    aria-label="Volver"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}
                {chosen ? chosen.name : "Elegir ejercicio"}
              </h2>
              <button
                onClick={reset}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted active:bg-border"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            {!chosen ? (
              <>
                <div className="relative p-4 pb-2">
                  <Search
                    className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-muted"
                    size={18}
                  />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar..."
                    className="min-h-[48px] w-full rounded-2xl border border-border bg-surface-2 py-3 pl-9 pr-4 text-base text-foreground outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  {filtered.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => setChosen(ex)}
                      className="flex min-h-[56px] w-full items-center justify-between border-b border-border/60 py-3 text-left transition-opacity"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {ex.name}
                        </p>
                        <p className="text-sm text-muted">{ex.category}</p>
                      </div>
                      <Plus size={18} className="shrink-0 text-accent" />
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted">
                      Sin resultados.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 space-y-5 overflow-y-auto p-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Series
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    className="min-h-[48px] w-full rounded-2xl border border-border bg-surface-2 px-4 text-center text-lg font-semibold text-foreground outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Rango de repeticiones (opcional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="Mín"
                      value={repsMin}
                      onChange={(e) => setRepsMin(e.target.value)}
                      className="min-h-[48px] w-full rounded-2xl border border-border bg-surface-2 px-4 text-center text-lg font-semibold text-foreground outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
                    />
                    <span className="text-muted">–</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="Máx"
                      value={repsMax}
                      onChange={(e) => setRepsMax(e.target.value)}
                      className="min-h-[48px] w-full rounded-2xl border border-border bg-surface-2 px-4 text-center text-lg font-semibold text-foreground outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>
                <button
                  onClick={handleConfirm}
                  disabled={pending}
                  className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-accent font-semibold text-accent-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
                >
                  <Plus size={19} />
                  Agregar a la rutina
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
