export default function ExploreLoading() {
  return (
    <div className="space-y-6 py-6 animate-pulse">
      <div className="h-8 w-48 rounded-xl bg-[var(--border-card)]"></div>
      <div className="h-4 w-96 rounded-lg bg-[var(--border-card)]"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="h-64 rounded-2xl bg-[var(--tile-bg)] border border-[var(--border-card)]"></div>
        <div className="h-64 rounded-2xl bg-[var(--tile-bg)] border border-[var(--border-card)] col-span-2"></div>
      </div>
    </div>
  );
}
