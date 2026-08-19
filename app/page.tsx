"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, useCart } from "@/context/CartContext";
import ProductModal from "@/components/ProductModal";
import Footer from "@/components/Footer";
import { Plus, ShoppingBag, ChevronDown } from "lucide-react";

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Signature Chocolate Loaf",
    description:
      "Rich, moist cocoa loaf cake topped with dark chocolate glaze. Baked fresh every Friday.",
    price: 120,
    category: "Loaf Cake",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "2",
    name: "Lemon Blueberry Loaf",
    description:
      "Tangy zest lemon pound loaf packed with wild blueberries and sweet icing drizzle.",
    price: 110,
    category: "Loaf Cake",
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FrZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "3",
    name: "Red Velvet Cupcakes (Box of 6)",
    description:
      "Classic red velvet base paired with silky cream cheese frosting.",
    price: 85,
    category: "Cupcakes",
    image:
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "4",
    name: "Vanilla Bean Fudge Cupcakes (Box of 6)",
    description:
      "Fluffy vanilla cupcakes filled with chocolate fudge swirl and sprinkles.",
    price: 80,
    category: "Cupcakes",
    image:
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "5",
    name: "Dark Cocoa Slice Cake",
    description:
      "Triple-layered chocolate slice cake topped with gourmet cocoa flakes.",
    price: 95,
    category: "Specialty Cake",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "6",
    name: "Classic Carrot Cream Loaf",
    description:
      "Spiced carrot loaf infused with crushed walnuts and smooth cream cheese frosting.",
    price: 115,
    category: "Loaf Cake",
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "7",
    name: "Classic Carrot Cream Loaf",
    description:
      "Spiced carrot loaf infused with crushed walnuts and smooth cream cheese frosting.",
    price: 115,
    category: "Loaf Cake",
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FrZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "8",
    name: "Classic Carrot Cream Loaf",
    description:
      "Spiced carrot loaf infused with crushed walnuts and smooth cream cheese frosting.",
    price: 105,
    category: "Loaf Cake",
    image:
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "9",
    name: "Classic Carrot Cream Loaf",
    description:
      "Spiced carrot loaf infused with crushed walnuts and smooth cream cheese frosting.",
    price: 99,
    category: "Loaf Cake",
    image:
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "10",
    name: "Classic Carrot Cream Loaf",
    description:
      "Spiced carrot loaf infused with crushed walnuts and smooth cream cheese frosting.",
    price: 115,
    category: "Loaf Cake",
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FrZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "11",
    name: "Classic Carrot Cream Loaf",
    description:
      "Spiced carrot loaf infused with crushed walnuts and smooth cream cheese frosting.",
    price: 78,
    category: "Loaf Cake",
    image:
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "12",
    name: "Classic Carrot Cream Loaf",
    description:
      "Spiced carrot loaf infused with crushed walnuts and smooth cream cheese frosting.",
    price: 115,
    category: "Loaf Cake",
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=600",
  },
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  // Show 6 products initially, or all products when showAll is active
  const visibleProducts = showAll ? PRODUCTS : PRODUCTS.slice(0, 6);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Storefront Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-amber-950 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            Order, freshly baked
          </h2>
        </div>

        {/* 1. MOBILE VIEW (sm:hidden): Minimalist 2-Column Layout */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:hidden">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="flex flex-col items-center text-center cursor-pointer group"
            >
              <div className="relative aspect-square w-full rounded-md overflow-hidden bg-gray-100 mb-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h3 className="text-[11px] font-medium tracking-wider uppercase text-gray-900 leading-snug px-1 line-clamp-2">
                {product.name}
              </h3>

              <p className="text-xs text-gray-700 font-normal mt-1">
                GHS {product.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* 2. DESKTOP VIEW (hidden sm:grid): 3-Column Evenly Spaced Grid */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-8">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => setSelectedProduct(product)}
            >
              <div>
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-amber-50 mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 33vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-400 font-medium my-1">
                  {product.category}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-50">
                <span className="text-base font-black text-amber-600">
                  GHS {product.price}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, 1);
                    setIsCartOpen(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white p-2.5 rounded-full shadow-md transition-all flex items-center justify-center"
                  aria-label="Add to cart"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 3. VIEW ALL BUTTON */}
        {!showAll && PRODUCTS.length > 6 && (
          <div className="flex justify-center mt-10 sm:mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 bg-amber-950 hover:bg-amber-900 active:scale-98 text-amber-50 font-bold px-8 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all text-xs sm:text-sm group"
            >
              <span>View All Products ({PRODUCTS.length})</span>
              <ChevronDown className="w-4 h-4 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
