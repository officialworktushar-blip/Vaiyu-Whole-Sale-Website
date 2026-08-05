"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <AlertTriangle className="h-14 w-14 text-brand-orange" />
      <h1 className="text-3xl font-bold text-brand-navy">
        Something went wrong
      </h1>
      <p className="max-w-md text-brand-gray">
        An unexpected error occurred while loading this page. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-md bg-brand-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Try Again
      </button>
    </div>
  );
}
