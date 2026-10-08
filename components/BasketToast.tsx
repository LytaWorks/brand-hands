"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Confirms an add without pulling the shopper out of the menu.
export default function BasketToast() {
  const { notice, dismissNotice, setIsCartOpen, isCartOpen } = useCart();

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(dismissNotice, 4000);
    return () => clearTimeout(id);
  }, [notice, dismissNotice]);

  const visible = notice && !isCartOpen;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
    >
      {visible && (
        <div
          key={notice.id}
          className="pointer-events-auto flex max-w-full animate-rise items-center gap-3 rounded-full bg-cocoa-deep py-2 pl-4 pr-2 text-flour shadow-lift [animation-duration:0.3s]"
        >
          <Check className="size-4 shrink-0 text-butter" aria-hidden />
          <p className="min-w-0 truncate text-sm">
            <span className="font-semibold">
              {notice.quantity} × {notice.product.name}
            </span>{" "}
            added
          </p>
          <button
            type="button"
            onClick={() => {
              dismissNotice();
              setIsCartOpen(true);
            }}
            className="min-h-9 shrink-0 rounded-full bg-butter px-4 text-sm font-semibold text-cocoa-deep transition-transform duration-200 ease-soft active:scale-95 focus-visible:outline-butter"
          >
            View basket
          </button>
        </div>
      )}
    </div>
  );
}
