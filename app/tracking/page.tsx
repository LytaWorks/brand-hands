"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, Truck, Package, Cake } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function TrackingContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "NH-89210";

  const steps = [
    { title: "Order Placed", status: "completed", icon: CheckCircle2 },
    { title: "Owner Confirmed", status: "current", icon: Clock },
    { title: "Baking in Progress", status: "pending", icon: Cake },
    { title: "Out for Delivery", status: "pending", icon: Truck },
    { title: "Delivered", status: "pending", icon: Package },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-3">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h1 className="text-xl font-bold text-gray-900">Payment Successful!</h1>
      <p className="text-xs text-gray-500 mt-1">
        Reference Code:{" "}
        <span className="font-mono font-bold text-gray-800">{ref}</span>
      </p>

      {/* Status Tracker */}
      <div className="mt-8 space-y-6 text-left">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";

          return (
            <div key={index} className="flex items-center gap-4 relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                  isCompleted
                    ? "bg-green-600 text-white"
                    : isCurrent
                      ? "bg-amber-500 text-white animate-pulse"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <h4
                  className={`text-sm font-bold ${
                    isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-[11px] text-gray-500">
                  {isCompleted
                    ? "Completed"
                    : isCurrent
                      ? "Awaiting owner confirmation"
                      : "Pending"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t">
        <Link
          href="/"
          className="block w-full bg-amber-600 text-white font-bold py-3 rounded-xl text-sm text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function OrderTracking() {
  return (
    <main className="max-w-md mx-auto p-4 py-8">
      <Suspense
        fallback={<div className="text-center p-4">Loading tracker...</div>}
      >
        <TrackingContent />
      </Suspense>
    </main>
  );
}
