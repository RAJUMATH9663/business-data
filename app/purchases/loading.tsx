export default function PurchasesLoading() {
  return (
    <div className="space-y-6 py-6 animate-pulse">
      <div className="h-8 w-48 rounded-xl bg-[var(--border-card)]"></div>
      <div className="h-4 w-80 rounded-lg bg-[var(--border-card)]"></div>
      <div className="space-y-4 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-[var(--tile-bg)] border border-[var(--border-card)]"></div>
        ))}
      </div>
    </div>
  );
}
