"use client";

import { useEffect, useState } from "react";
import type { Exercise } from "@prisma/client";
import { TrendingUp, X } from "lucide-react";
import { getExerciseProgress, type ProgressPoint } from "@/app/actions/progress";
import ProgressChart from "@/components/ProgressChart";

export default function ExerciseDetailModal({
  exercise,
  trigger,
  triggerClassName,
  triggerLabel,
}: {
  exercise: Exercise;
  trigger: React.ReactNode;
  triggerClassName?: string;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"info" | "progress">("info");
  const [progress, setProgress] = useState<ProgressPoint[] | null>(null);

  useEffect(() => {
    if (!open || tab !== "progress") return;
    let cancelled = false;
    getExerciseProgress(exercise.id).then((data) => {
      if (!cancelled) setProgress(data);
    });
    return () => {
      cancelled = true;
    };
  }, [open, tab, exercise.id]);

  function handleOpen() {
    setTab("info");
    setProgress(null);
    setOpen(true);
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className={triggerClassName}
        aria-label={triggerLabel}
      >
        {trigger}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-fade-in max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-surface sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-semibold tracking-tight">
                {exercise.name}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted active:bg-border"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex border-b border-border">
              <button
                onClick={() => setTab("info")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  tab === "info"
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted"
                }`}
              >
                Info
              </button>
              <button
                onClick={() => setTab("progress")}
                className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-colors ${
                  tab === "progress"
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted"
                }`}
              >
                <TrendingUp size={15} />
                Progreso
              </button>
            </div>

            {tab === "info" ? (
              <>
                {exercise.videoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={exercise.videoUrl}
                    alt={exercise.name}
                    className="w-full bg-surface-2 object-contain"
                  />
                )}
                <div className="space-y-2.5 p-4">
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
                    {exercise.category}
                    {exercise.equipment ? ` · ${exercise.equipment}` : ""}
                  </p>
                  {exercise.instructions && (
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {exercise.instructions}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="p-4">
                {progress === null ? (
                  <p className="py-6 text-center text-sm text-muted">
                    Cargando...
                  </p>
                ) : (
                  <ProgressChart data={progress} />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
