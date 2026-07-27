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
    setRemaining(seconds);
    setOpen(false);
  }

  function stop() {
    setRemaining(null);
  }

  const mm = remaining !== null ? Math.floor(remaining / 60) : 0;
  const ss = remaining !== null ? remaining % 60 : 0;

  return (
    <div className="fixed bottom-24 right-4 z-40">
      {remaining !== null ? (
        <button
          onClick={stop}
          className="flex h-16 min-w-[64px] items-center justify-center gap-1 rounded-full bg-cyan-500 px-4 font-mono text-lg font-bold text-gray-950 shadow-lg active:bg-cyan-400"
        >
          {mm}:{ss.toString().padStart(2, "0")}
        </button>
      ) : (
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-cyan-400 shadow-lg active:bg-gray-700"
          aria-label="Timer de descanso"
        >
          <Timer size={24} />
        </button>
      )}

      {open && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2 rounded-xl border border-gray-800 bg-gray-900 p-3 shadow-xl">
          <div className="flex items-center justify-between gap-4 pb-1">
            <span className="text-sm font-medium text-gray-300">
              Descanso
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </div>
          {PRESETS.map((s) => (
            <button
              key={s}
              onClick={() => start(s)}
              className="min-h-[44px] rounded-lg bg-gray-800 px-6 font-medium active:bg-gray-700"
            >
              {s}s
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
