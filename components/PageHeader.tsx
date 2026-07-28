export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-start justify-between gap-3 border-b border-border/70 bg-background/85 px-5 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] backdrop-blur-xl">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
