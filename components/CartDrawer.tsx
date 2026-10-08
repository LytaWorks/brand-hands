"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBasket, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/lib/products";
import Sheet from "@/components/Sheet";
import QuantityStepper from "@/components/QuantityStepper";
import BakeDate from "@/components/BakeDate";

export default function CartDrawer() {
  const {
    cart,
    itemCount,
    total,
    setQuantity,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const close = () => setIsCartOpen(false);

  return (
    <Sheet open={isCartOpen} onClose={close} label="Your basket" variant="drawer">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-crust px-4 py-3 sm:px-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Your basket
            {itemCount > 0 && (
              <span className="ml-2 font-sans text-base font-medium text-mocha tabular-nums">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close basket"
            className="flex size-10 items-center justify-center rounded-full text-cocoa transition-[background-color,transform] duration-200 ease-soft hover:bg-oat active:scale-95"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
            <ShoppingBasket className="size-10 text-mocha" aria-hidden />
            <p className="mt-2 font-display text-xl font-semibold">
              Nothing in your basket yet
            </p>
            <p className="max-w-xs text-mocha">
              Pick something from the menu and it will be baked for you on{" "}
              <BakeDate />.
            </p>
            <Link
              href="/#menu"
              onClick={close}
              className="btn btn-primary mt-4"
            >
              See the menu
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-crust overflow-y-auto px-4 sm:px-6">
              {cart.map((item) => (
                <li key={item.product.id} className="flex gap-4 py-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-field bg-oat">
                    <Image
                      src={item.product.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold leading-snug">
                        {item.product.name}
                      </p>
                      <p className="shrink-0 font-semibold tabular-nums">
                        {formatGHS(item.product.price * item.quantity)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <QuantityStepper
                        size="sm"
                        value={item.quantity}
                        onChange={(value) =>
                          setQuantity(item.product.id, value)
                        }
                        label={item.product.name}
                      />
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label={`Remove ${item.product.name}`}
                        className="flex size-10 items-center justify-center rounded-full text-mocha transition-[background-color,color,transform] duration-200 ease-soft hover:bg-jam-soft hover:text-jam active:scale-95"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-crust px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-mocha">Subtotal</span>
                <span className="font-display text-2xl font-semibold tabular-nums">
                  {formatGHS(total)}
                </span>
              </div>
              <p className="text-sm text-mocha">
                Order now and it is baked on <BakeDate />.
              </p>
              <Link
                href="/checkout"
                onClick={close}
                className="btn btn-primary w-full"
              >
                Checkout
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
