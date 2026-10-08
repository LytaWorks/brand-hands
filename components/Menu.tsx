"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatGHS, Product, PRODUCTS } from "@/lib/products";
import ProductModal from "@/components/ProductModal";

const CATEGORIES = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

export default function Menu() {
  const [category, setCategory] = useState("All");
  // The product stays set while the sheet animates out; `viewing` drives it.
  const [product, setProduct] = useState<Product | null>(null);
  const [viewing, setViewing] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const { addToCart } = useCart();

  const visible =
    category === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === category);

  const view = (next: Product) => {
    setProduct(next);
    setOpenCount((count) => count + 1);
    setViewing(true);
  };

  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="mx-auto max-w-6xl px-4 py-[clamp(3.5rem,8vw,6rem)] sm:px-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id="menu-heading"
          className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-tight"
        >
          This week&apos;s menu
        </h2>

        <div
          role="group"
          aria-label="Filter the menu"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
        >
          {CATEGORIES.map((name) => {
            const selected = name === category;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(name)}
                className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors duration-200 ease-soft ${
                  selected
                    ? "bg-cocoa text-flour"
                    : "bg-oat text-cocoa hover:bg-crust"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12">
        {visible.map((item) => (
          <li key={item.id} className="group flex flex-col">
            <button
              type="button"
              onClick={() => view(item)}
              aria-haspopup="dialog"
              className="flex flex-1 flex-col rounded-card text-left"
            >
              <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-card bg-oat">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1152px) 360px, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.03]"
                />
              </span>
              <span className="mt-3 block font-semibold leading-snug sm:text-lg">
                {item.name}
              </span>
              <span className="mt-0.5 block text-sm text-mocha">
                {item.category}
              </span>
            </button>

            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="font-semibold tabular-nums">
                {formatGHS(item.price)}
              </span>
              <button
                type="button"
                onClick={() => addToCart(item, 1)}
                aria-label={`Add ${item.name} to basket`}
                className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-cocoa text-flour transition-[background-color,transform] duration-200 ease-soft after:absolute after:-inset-1 hover:bg-cocoa-deep active:scale-95"
              >
                <Plus className="size-5" aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ProductModal
        key={openCount}
        product={product}
        open={viewing}
        onClose={() => setViewing(false)}
      />
    </section>
  );
}
