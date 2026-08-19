"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartDrawer() {
  const { cart, total, removeFromCart, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  // Safely compute or fallback to total (defaults to 0 if undefined)
  const subtotal =
    total ??
    cart.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0,
    );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  Your cart is currently empty
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Qty: {item.quantity} × GHS{" "}
                      {(item.product.price || 0).toFixed(2)}
                    </p>
                    <p className="text-xs font-bold text-amber-600 mt-1">
                      GHS{" "}
                      {((item.product.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-white space-y-4">
              <div className="flex justify-between items-center font-bold text-base text-gray-900">
                <span>Subtotal:</span>
                <span className="text-amber-600">
                  GHS {subtotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
