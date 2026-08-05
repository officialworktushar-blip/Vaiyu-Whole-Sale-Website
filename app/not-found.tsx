import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <SearchX className="h-14 w-14 text-brand-orange" />
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-orange">
        404
      </p>
      <h1 className="text-3xl font-bold text-brand-navy">
        Page not found
      </h1>
      <p className="max-w-md text-brand-gray">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-brand-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Back to Home
      </Link>
    </div>
  );
}
