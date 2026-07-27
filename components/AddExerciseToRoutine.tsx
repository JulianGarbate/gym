"use client";

import { useState, useTransition } from "react";
import type { Exercise } from "@prisma/client";
import { Plus, Search, X } from "lucide-react";
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
  const [pending, startTransition] = useTransition();

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  function handleAdd(exerciseId: string) {
    startTransition(async () => {
      await addRoutineItem(routineId, exerciseId, 3);
      setOpen(false);
      setQuery("");
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-700 font-medium text-gray-300 active:bg-gray-900"
      >
        <Plus size={20} />
        Agregar ejercicio
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-gray-800 bg-gray-950 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-800 p-4">
              <h2 className="text-lg font-bold">Elegir ejercicio</h2>
              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative p-4 pb-2">
              <Search
                className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="min-h-[48px] w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-9 pr-4 text-base outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {filtered.map((ex) => (
                <button
                  key={ex.id}
                  disabled={pending}
                  onClick={() => handleAdd(ex.id)}
                  className="flex min-h-[56px] w-full items-center justify-between border-b border-gray-900 py-3 text-left disabled:opacity-50"
                >
                  <div>
                    <p className="font-medium">{ex.name}</p>
                    <p className="text-sm text-gray-500">{ex.category}</p>
                  </div>
                  <Plus size={18} className="text-cyan-400" />
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-gray-500">
                  Sin resultados.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
