export default function AdminLoading() {
  return (
    <div className="space-y-6 py-6 animate-pulse">
      <div className="h-8 w-40 rounded-xl bg-[var(--border-card)]"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-[var(--tile-bg)] border border-[var(--border-card)]"></div>
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-[var(--tile-bg)] border border-[var(--border-card)]"></div>
    </div>
  );
}
