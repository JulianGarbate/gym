"use client";

import type { ProgressPoint } from "@/app/actions/progress";

export default function ProgressChart({ data }: { data: ProgressPoint[] }) {
  if (data.length < 2) {
    return (
      <p className="py-6 text-center text-sm text-muted">
        {data.length === 0
          ? "Todavía no registraste series de este ejercicio."
          : "Registrá al menos 2 entrenamientos para ver la evolución."}
      </p>
    );
  }

  const width = 320;
  const height = 140;
  const padX = 8;
  const padY = 16;

  const weights = data.map((d) => d.maxWeight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * (width - padX * 2);
    const y =
      height -
      padY -
      ((d.maxWeight - min) / range) * (height - padY * 2);
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const last = data[data.length - 1];
  const first = data[0];
  const change = last.maxWeight - first.maxWeight;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-2xl font-bold text-foreground">
          {last.maxWeight}kg
        </p>
        <p
          className={`text-sm font-semibold ${
            change > 0
              ? "text-accent"
              : change < 0
                ? "text-red-400"
                : "text-muted"
          }`}
        >
          {change > 0 ? "+" : ""}
          {change}kg desde el inicio
        </p>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#progressFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 4 : 2.5}
            fill="var(--accent)"
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>
          {new Date(first.date).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "short",
          })}
        </span>
        <span>
          {new Date(last.date).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </div>
  );
}
