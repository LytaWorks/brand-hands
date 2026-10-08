"use client";

import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/lib/products";

// Phones only: once something is in the basket it stays one tap away,
// pinned to the bottom of the menu.
export default function BasketBar() {
  const { itemCount, total, isCartOpen, setIsCartOpen } = useCart();

  if (itemCount === 0 || isCartOpen) return null;

  return (
    <div className="pointer-events-none sticky bottom-0 z-30 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:hidden">
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="pointer-events-auto flex min-h-14 w-full animate-rise items-center gap-2.5 rounded-full bg-cocoa-deep py-2 pl-4 pr-2 text-flour shadow-lift transition-transform duration-200 ease-soft [animation-duration:0.3s] active:scale-[0.98] focus-visible:outline-butter"
      >
        <ShoppingBasket className="size-5 shrink-0 max-[359px]:hidden" aria-hidden />
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-flour/15 px-1.5 text-sm font-bold tabular-nums">
          {itemCount}
          <span className="sr-only">{itemCount === 1 ? " item" : " items"}</span>
        </span>
        <span className="flex-1 whitespace-nowrap text-left font-semibold tabular-nums">
          {formatGHS(total)}
        </span>
        <span className="flex min-h-10 items-center whitespace-nowrap rounded-full bg-butter px-4 text-sm font-semibold text-cocoa-deep">
          View basket
        </span>
      </button>
    </div>
  );
}
