import type { Metadata } from "next";
import { Suspense } from "react";
import TrackingView from "@/components/TrackingView";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Track your order",
  description:
    "Check when your Nades Hands order is being baked and delivered.",
};

export default function OrderTracking() {
  return (
    <>
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6 sm:py-16">
        <Suspense fallback={<div aria-busy="true" className="min-h-64" />}>
          <TrackingView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
