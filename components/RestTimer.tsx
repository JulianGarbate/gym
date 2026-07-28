"use client";

import { useEffect, useRef, useState } from "react";
import { Timer, X } from "lucide-react";

const PRESETS = [60, 90, 120];

function beep() {
  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    osc.onended = () => ctx.close();
  } catch {
    // audio not available, ignore
  }
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
}

export default function RestTimer() {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(90);
  const [remaining, setRemaining] = useState<number | null>(null);
  const running = remaining !== null;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r === null) return null;
        if (r <= 1) {
          beep();
          return null;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function start(seconds: number) {
    setDuration(seconds);
    setRemaining(seconds);
    setOpen(false);
  }

  function stop() {
    setRemaining(null);
  }

  const mm = remaining !== null ? Math.floor(remaining / 60) : 0;
  const ss = remaining !== null ? remaining % 60 : 0;
  const progress = remaining !== null ? 1 - remaining / duration : 0;

  return (
    <div className="fixed bottom-24 right-5 z-40">
      {remaining !== null ? (
        <button
          onClick={stop}
          className="relative flex h-16 w-16 items-center justify-center rounded-full text-accent-foreground shadow-[0_8px_24px_-6px] shadow-accent/50 transition-transform active:scale-95"
          style={{
            background: `conic-gradient(var(--accent) ${progress * 360}deg, color-mix(in srgb, var(--accent) 25%, var(--surface)) 0deg)`,
          }}
        >
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-background font-mono text-base font-bold text-foreground">
            {mm}:{ss.toString().padStart(2, "0")}
          </span>
        </button>
      ) : (
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-accent shadow-lg transition-transform active:scale-95"
          aria-label="Timer de descanso"
        >
          <Timer size={22} strokeWidth={1.8} />
        </button>
      )}

      {open && (
        <div className="animate-fade-in absolute bottom-16 right-0 flex flex-col gap-1.5 rounded-2xl border border-border bg-surface p-2.5 shadow-2xl">
          <div className="flex items-center justify-between gap-6 px-1.5 pb-0.5 pt-0.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              Descanso
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-muted"
              aria-label="Cerrar"
            >
              <X size={15} />
            </button>
          </div>
          {PRESETS.map((s) => (
            <button
              key={s}
              onClick={() => start(s)}
              className="min-h-[44px] rounded-xl bg-surface-2 px-6 font-medium text-foreground transition-colors active:bg-border"
            >
              {s}s
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
