"use client";

import { useState, useTransition } from "react";
import type { Exercise, WorkoutSet } from "@prisma/client";
import { CheckCircle2, ChevronDown, Flag, Plus, Trash2 } from "lucide-react";
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
    <div className="px-5 py-5 space-y-4">
      {exercises.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {exercises.map((ex) => {
            const done = loggedSets.some((s) => s.exerciseId === ex.id);
            return (
              <button
                key={ex.id}
                onClick={() => setActiveExerciseId(ex.id)}
                className={`relative min-h-[42px] shrink-0 rounded-full px-4 text-sm font-medium transition-all ${
                  ex.id === activeExerciseId
                    ? "bg-accent text-accent-foreground"
                    : "border border-border bg-surface text-muted"
                }`}
              >
                {ex.name}
                {done && ex.id !== activeExerciseId && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setShowPicker(true)}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-sm font-medium text-muted transition-colors active:bg-surface"
      >
        <Plus size={17} />
        Agregar ejercicio a esta sesión
      </button>

      {activeExercise && (
        <div className="animate-fade-in space-y-4 rounded-3xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold tracking-tight text-foreground">
              {activeExercise.name}
            </h3>
            {setsForActive.length > 0 && (
              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                {setsForActive.length} serie{setsForActive.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {lastSet && (
            <p className="text-sm text-muted">
              Última vez:{" "}
              <span className="font-medium text-foreground">
                {lastSet.weight}kg × {lastSet.reps}
              </span>
            </p>
          )}

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="mb-1.5 block text-center text-xs font-medium text-muted">
                Peso (kg)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={lastSet ? String(lastSet.weight) : "0"}
                className="min-h-[52px] w-full rounded-2xl border border-border bg-surface-2 px-2 text-center text-lg font-semibold text-foreground outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-center text-xs font-medium text-muted">
                Reps
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder={lastSet ? String(lastSet.reps) : "0"}
                className="min-h-[52px] w-full rounded-2xl border border-border bg-surface-2 px-2 text-center text-lg font-semibold text-foreground outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-center text-xs font-medium text-muted">
                RPE
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                placeholder="-"
                className="min-h-[52px] w-full rounded-2xl border border-border bg-surface-2 px-2 text-center text-lg font-semibold text-foreground outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <button
            onClick={handleLogSet}
            disabled={pending || !weight || !reps}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-accent font-semibold text-accent-foreground transition-transform active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
          >
            <CheckCircle2 size={20} />
            Registrar serie
          </button>

          {setsForActive.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {setsForActive.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl bg-surface-2 px-3.5 py-2.5 text-sm"
                >
                  <span className="text-foreground">
                    <span className="text-muted">Serie {i + 1}</span>{" "}
                    <span className="font-medium">
                      {s.weight}kg × {s.reps}
                    </span>
                    {s.rpe ? (
                      <span className="text-muted"> · RPE {s.rpe}</span>
                    ) : null}
                  </span>
                  <form action={deleteSet.bind(null, workoutId, s.id)}>
                    <button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted active:bg-border"
                      aria-label="Eliminar serie"
                    >
                      <Trash2 size={15} />
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
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-border font-semibold text-foreground transition-colors active:bg-surface"
          >
            <Flag size={17} />
            Finalizar entrenamiento
          </button>
        </form>
      )}

      <RestTimer />

      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          onClick={() => setShowPicker(false)}
        >
          <div
            className="animate-fade-in flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-border bg-surface sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-semibold tracking-tight">
                Elegir ejercicio
              </h2>
              <button
                onClick={() => setShowPicker(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted active:bg-border"
              >
                <ChevronDown size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {allExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => addExerciseToSession(ex)}
                  className="flex min-h-[56px] w-full items-center justify-between border-b border-border/60 py-3 text-left"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{ex.name}</p>
                    <p className="text-sm text-muted">{ex.category}</p>
                  </div>
                  <Plus size={18} className="shrink-0 text-accent" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
