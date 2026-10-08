"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();

  // Admin and checkout carry their own, quieter top bars.
  if (pathname?.startsWith("/admin") || pathname === "/checkout") {
    return null;
  }

  return (
    <>
      <p className="bg-cocoa px-4 py-2 text-center text-sm text-flour">
        Baked every Friday morning. Order by Thursday 5pm.
      </p>

      <header className="sticky top-0 z-40 border-b border-crust bg-flour/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="whitespace-nowrap font-display text-xl font-semibold leading-none tracking-tight sm:text-[1.75rem]"
          >
            Nades Hands
          </Link>

          <nav aria-label="Main" className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/tracking"
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-mocha transition-colors duration-200 hover:text-cocoa"
            >
              Track<span className="max-sm:sr-only"> order</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="btn btn-quiet btn-sm"
              aria-label={
                itemCount > 0
                  ? `Open basket, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
                  : "Open basket"
              }
            >
              <ShoppingBasket className="size-5" aria-hidden />
              <span className="hidden sm:inline">Basket</span>
              {itemCount > 0 && (
                <span
                  key={itemCount}
                  className="flex h-5 min-w-5 animate-rise items-center justify-center rounded-full bg-butter px-1.5 text-xs font-bold tabular-nums text-cocoa-deep"
                >
                  {itemCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}
