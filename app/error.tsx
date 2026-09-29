"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card mx-auto max-w-md p-8 text-center">
      <div className="text-4xl">⚠️</div>
      <h1 className="mt-3 text-xl">Something went wrong</h1>
      <p className="mt-2 text-sm">We could not load this page. Please check your connection and try again.</p>
      <button onClick={reset} className="btn btn-primary mt-5">Try again</button>
    </div>
  );
}
