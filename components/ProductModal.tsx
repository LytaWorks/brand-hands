"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatGHS, Product } from "@/lib/products";
import Sheet from "@/components/Sheet";
import QuantityStepper from "@/components/QuantityStepper";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductModal({
  product,
  open,
  onClose,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} label={product.name} variant="product">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-paper/90 text-cocoa backdrop-blur-sm transition-[background-color,transform] duration-200 ease-soft hover:bg-paper active:scale-95"
      >
        <X className="size-5" aria-hidden />
      </button>
      <div className="flex max-h-[92dvh] flex-col sm:max-h-[min(90dvh,36rem)] sm:flex-row">
        <div className="relative aspect-[3/2] w-full shrink-0 bg-oat sm:aspect-auto sm:min-h-[26rem] sm:w-1/2">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 416px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
            <p className="text-sm text-mocha">{product.category}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              {product.name}
            </h2>
            <p className="mt-2 text-lg font-semibold tabular-nums">
              {formatGHS(product.price)}
            </p>
            <p className="mt-4 leading-relaxed text-mocha">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-crust p-4 sm:px-8 sm:py-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-mocha">
                Quantity
              </span>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                label={product.name}
              />
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary tabular-nums"
            >
              Add to basket · {formatGHS(product.price * quantity)}
            </button>
          </div>
        </div>
      </div>

    </Sheet>
  );
}
