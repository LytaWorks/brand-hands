"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product, useCart } from "@/context/CartContext";
import { X, Plus, Minus, ArrowLeft } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    if (product) {
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <>
      {/* 1. MOBILE VIEW: Edge-to-Edge Full-Screen (No Card/Modal Styling) */}
      <div className="fixed inset-0 z-50 bg-white sm:hidden flex flex-col justify-between overflow-y-auto">
        <div className="flex-1">
          {/* Mobile Top Navigation Bar */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-900 text-xs font-semibold uppercase tracking-wider active:opacity-60 transition-opacity"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900" />
              <span>Back</span>
            </button>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded">
              {product.category}
            </span>
          </div>

          {/* Full-Bleed Image */}
          <div className="relative aspect-square w-full bg-gray-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Minimal Content */}
          <div className="p-5 space-y-5">
            <div>
              <h1 className="text-base font-medium tracking-wider uppercase text-gray-900 leading-snug">
                {product.name}
              </h1>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                GHS {product.price.toFixed(2)}
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed pt-4 border-t border-gray-100">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-wider uppercase text-gray-500">
                Quantity
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-800 active:scale-95 transition-transform"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-semibold text-gray-900 w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-800 active:scale-95 transition-transform"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Sticky Bottom CTA */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
          <button
            onClick={handleAddToCart}
            className="w-full bg-black hover:bg-gray-900 active:scale-[0.99] text-white font-medium py-3.5 text-xs uppercase tracking-widest transition-colors"
          >
            Add To Cart • GHS {(product.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>

      {/* 2. DESKTOP VIEW: Centered Card Modal */}
      <div
        className="hidden sm:fixed sm:inset-0 sm:z-50 sm:bg-black/60 sm:backdrop-blur-xs sm:flex sm:items-center sm:justify-center sm:p-4"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-60 bg-amber-50 shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="400px"
              className="object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md backdrop-blur-md transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-md mb-1.5">
                {product.category}
              </span>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h2>
              <p className="text-lg font-black text-amber-600 mt-1">
                GHS {product.price.toFixed(2)}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Quantity
              </span>
              <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-full border border-gray-200">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-xs hover:bg-gray-50 active:scale-95 transition-transform"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-gray-900 w-5 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-7 h-7 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-xs hover:bg-gray-50 active:scale-95 transition-transform"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-white shrink-0">
            <button
              onClick={handleAddToCart}
              className="w-full bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              Add {quantity} to Cart • GHS{" "}
              {(product.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
