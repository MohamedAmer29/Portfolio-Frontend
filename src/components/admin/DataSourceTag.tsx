type DataSourceTagProps = {
  hasServerData: boolean;
  className?: string;
};

export function DataSourceTag({ hasServerData, className = "" }: DataSourceTagProps) {
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.15em] ${
        hasServerData ? "text-accent/70" : "text-ink-muted/60"
      } ${className}`}
    >
      {hasServerData ? "synced from server" : "local data"}
    </span>
  );
}
