import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md p-8 text-center">
      <div className="text-4xl">🔍</div>
      <h1 className="mt-3 text-xl">Page not found</h1>
      <p className="mt-2 text-sm">The page you are looking for does not exist.</p>
      <Link href="/explore" className="btn btn-primary mt-5">Explore Business Data</Link>
    </div>
  );
}
