"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";

export default function SendToDailyCalButton({
  calories,
}: {
  calories: number;
}) {
  const [sent, setSent] = useState(false);

  return (
    <button
      onClick={() => setSent(true)}
      disabled={sent}
      title={`Envío a Daily Cal todavía no está conectado (${calories} kcal)`}
      className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors ${
        sent
          ? "bg-surface-2 text-muted"
          : "bg-accent text-accent-foreground active:scale-[0.97]"
      }`}
    >
      {sent ? <Check size={16} /> : <Send size={16} />}
      {sent ? "Listo" : "Daily Cal"}
    </button>
  );
}
