import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05] tracking-tight">
        This page is not on the menu
      </h1>
      <p className="mt-3 max-w-sm text-mocha">
        The link may be old or mistyped. The bakes are all still here.
      </p>
      <Link href="/#menu" className="btn btn-primary mt-6">
        See the menu
      </Link>
    </main>
  );
}
