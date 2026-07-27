export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/95 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur">
      <h1 className="text-xl font-bold">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-gray-400">{subtitle}</p>}
    </header>
  );
}
