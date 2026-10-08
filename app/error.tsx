"use client";

export default function Error({ retry }: { error: Error; retry: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05] tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-sm text-mocha">
        The page did not load properly. Your basket is saved, so nothing is
        lost.
      </p>
      <button type="button" onClick={() => retry()} className="btn btn-primary mt-6">
        Try again
      </button>
    </main>
  );
}
