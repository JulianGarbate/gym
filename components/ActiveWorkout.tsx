"use client";

import { useState, useTransition } from "react";
import type { Exercise, WorkoutSet } from "@prisma/client";
import { CheckCircle2, ChevronDown, Plus, Trash2 } from "lucide-react";
import { deleteSet, finishWorkout, logSet } from "@/app/actions/workouts";
import RestTimer from "@/components/RestTimer";

type LoggedSet = WorkoutSet & { exercise: Exercise };

export default function ActiveWorkout({
  workoutId,
  exercisesInWorkout,
  allExercises,
  loggedSets,
  lastSetByExercise,
  isFinished,
}: {
  workoutId: string;
  exercisesInWorkout: Exercise[];
  allExercises: Exercise[];
  loggedSets: LoggedSet[];
  lastSetByExercise: Record<string, { weight: number; reps: number }>;
  isFinished: boolean;
}) {
  const [exercises, setExercises] = useState(exercisesInWorkout);
  const [activeExerciseId, setActiveExerciseId] = useState(
    exercisesInWorkout[0]?.id ?? ""
  );
  const [showPicker, setShowPicker] = useState(false);
  const [pending, startTransition] = useTransition();

  const activeExercise = exercises.find((e) => e.id === activeExerciseId);
  const setsForActive = loggedSets.filter(
    (s) => s.exerciseId === activeExerciseId
  );
  const lastSet = lastSetByExercise[activeExerciseId];

  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("");

  function handleLogSet() {
    if (!activeExerciseId || !weight || !reps) return;
    startTransition(async () => {
      await logSet(
        workoutId,
        activeExerciseId,
        parseFloat(weight),
        parseInt(reps, 10),
        rpe ? parseFloat(rpe) : null
      );
      setWeight("");
      setReps("");
      setRpe("");
    });
  }

  function addExerciseToSession(ex: Exercise) {
    setExercises((prev) =>
      prev.some((e) => e.id === ex.id) ? prev : [...prev, ex]
    );
    setActiveExerciseId(ex.id);
    setShowPicker(false);
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {exercises.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setActiveExerciseId(ex.id)}
              className={`min-h-[44px] shrink-0 rounded-full px-4 text-sm font-medium ${
                ex.id === activeExerciseId
                  ? "bg-cyan-500 text-gray-950"
                  : "bg-gray-900 border border-gray-800 text-gray-300"
              }`}
            >
              {ex.name}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowPicker(true)}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-700 text-sm font-medium text-gray-300 active:bg-gray-900"
      >
        <Plus size={18} />
        Agregar ejercicio a esta sesión
      </button>

      {activeExercise && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 space-y-3">
          <h3 className="font-semibold">{activeExercise.name}</h3>

          {lastSet && (
            <p className="text-sm text-gray-400">
              Última vez: {lastSet.weight}kg × {lastSet.reps} reps
            </p>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Peso (kg)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={lastSet ? String(lastSet.weight) : "0"}
                className="min-h-[48px] w-full rounded-xl border border-gray-800 bg-gray-950 px-3 text-center text-lg outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Reps</label>
              <input
                type="number"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder={lastSet ? String(lastSet.reps) : "0"}
                className="min-h-[48px] w-full rounded-xl border border-gray-800 bg-gray-950 px-3 text-center text-lg outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">RPE</label>
              <input
                type="number"
                inputMode="decimal"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                placeholder="-"
                className="min-h-[48px] w-full rounded-xl border border-gray-800 bg-gray-950 px-3 text-center text-lg outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            onClick={handleLogSet}
            disabled={pending || !weight || !reps}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 font-semibold text-gray-950 active:bg-cyan-400 disabled:opacity-50"
          >
            <CheckCircle2 size={20} />
            Registrar serie
          </button>

          {setsForActive.length > 0 && (
            <div className="space-y-1 pt-2">
              {setsForActive.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg bg-gray-950 px-3 py-2 text-sm"
                >
                  <span>
                    Serie {i + 1}: {s.weight}kg × {s.reps}
                    {s.rpe ? ` · RPE ${s.rpe}` : ""}
                  </span>
                  <form action={deleteSet.bind(null, workoutId, s.id)}>
                    <button
                      type="submit"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 active:bg-gray-800"
                      aria-label="Eliminar serie"
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isFinished && (
        <form action={finishWorkout.bind(null, workoutId)}>
          <button
            type="submit"
            className="min-h-[48px] w-full rounded-xl border border-gray-700 font-semibold text-gray-200 active:bg-gray-900"
          >
            Finalizar entrenamiento
          </button>
        </form>
      )}

      <RestTimer />

      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center"
          onClick={() => setShowPicker(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-gray-800 bg-gray-950 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-800 p-4">
              <h2 className="text-lg font-bold">Elegir ejercicio</h2>
              <button
                onClick={() => setShowPicker(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900"
              >
                <ChevronDown size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {allExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => addExerciseToSession(ex)}
                  className="flex min-h-[56px] w-full items-center justify-between border-b border-gray-900 py-3 text-left"
                >
                  <div>
                    <p className="font-medium">{ex.name}</p>
                    <p className="text-sm text-gray-500">{ex.category}</p>
                  </div>
                  <Plus size={18} className="text-cyan-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
