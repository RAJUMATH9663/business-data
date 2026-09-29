export default function Loading() {
  return (
    <div className="grid place-items-center py-24" role="status" aria-label="Loading">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-mist border-t-brand" />
    </div>
  );
}
