export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 px-5 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] backdrop-blur-xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      )}
    </header>
  );
}
