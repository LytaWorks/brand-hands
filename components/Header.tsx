"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, ArrowDown, Pin } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const pathname = usePathname();
  const { cart = [], setIsCartOpen } = useCart();

  // Hide the storefront header and hero completely when on any admin route
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#F7F3EE] text-[#3D2822] font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-[#3D2822] text-[#F7F3EE] text-xs sm:text-sm py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span>🧁</span>
        <span>
          Warm artisanal loaves and custom pastries baked on Friday morning.
          Delivered Friday afternoon &amp; Weekends only.
        </span>
      </div>

      {/* Brand Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#F7F3EE]/90 backdrop-blur-md border-b border-[#E8DFC8]/40 px-4 sm:px-12 py-4 flex justify-between items-center">
        <Link href="/" className="flex flex-col">
          <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#3D2822] leading-none">
            Nades Hands
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.25em] font-bold text-[#8B6B5D] uppercase mt-1">
            Boutique Bakery
          </span>
        </Link>

        {/* My Basket Button */}
        <button
          onClick={() => setIsCartOpen?.(true)}
          className="relative bg-[#EFE9E2] hover:bg-[#E5DDD4] text-[#3D2822] px-4.5 py-2.5 rounded-full flex items-center gap-3 font-bold text-xs sm:text-sm transition-colors shadow-xs"
          aria-label="Open Cart"
        >
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#3D2822]" />
          <span>My Basket</span>
          {itemCount > 0 && (
            <span className="bg-[#3D2822] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </header>

      {/* Hero Section (Hidden on mobile/small screens) */}
      <section className="hidden lg:grid max-w-7xl mx-auto px-4 sm:px-12 py-12 lg:py-20 grid-cols-12 gap-8 items-center">
        {/* Left Column */}
        <div className="col-span-7 space-y-6 sm:space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#3D2822] leading-[1.15] tracking-tight">
            Artisanal{" "}
            <span className="italic font-normal text-[#8B6B5D]">
              loaf cakes
            </span>{" "}
            &amp; <br />
            decadent{" "}
            <span className="italic font-normal text-[#8B6B5D]">cupcakes</span>
          </h1>

          <p className="text-sm sm:text-base text-[#6E554F] leading-relaxed max-w-xl font-medium">
            Each dessert is carefully prepared by hand, baked in micro-batches
            in our luxury kitchen every Friday morning, and delivered safely to
            you that afternoon or weekend. Taste the difference of genuine craft
            bakery passion.
          </p>

          {/* Order Cutoff Callout */}
          <div className="bg-[#FFFDFB] border-l-4 border-[#8B6B5D] p-4 sm:p-5 rounded-r-2xl shadow-xs max-w-xl flex items-start gap-3">
            <Pin className="w-5 h-5 text-[#8B6B5D] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#523E38] leading-relaxed">
              <strong className="font-bold text-[#3D2822]">
                Thursday 5:00 PM Order Cutoff:
              </strong>{" "}
              Complete checkout beforehand to secure your spot for the next
              Friday baking roster.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={scrollToProducts}
              className="bg-[#3D2822] hover:bg-[#2A1B17] text-[#F7F3EE] font-bold px-7 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm sm:text-base flex items-center justify-center gap-2 group"
            >
              Order Fresh Bakes
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Unsplash Cake Image */}
        <div className="col-span-5 flex justify-center relative">
          <div className="relative w-[420px] h-[420px]">
            <div className="absolute inset-0 rounded-full border border-[#E8DFC8] scale-105"></div>
            <div className="absolute inset-0 rounded-full border border-[#E8DFC8]/60 scale-125"></div>

            <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-white shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80"
                alt="Artisanal Layer Cake"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="420px"
              />
            </div>

            <div className="absolute -top-2 left-0 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-[#3D2822] shadow-md flex items-center gap-1.5 -rotate-6 border border-gray-100">
              <span>🍩</span>
              <span>Zero Preservatives</span>
            </div>

            <div className="absolute -bottom-2 right-0 bg-[#8B6B5D] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 rotate-6">
              <span>🔥</span>
              <span>Pure Butter Goodness</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
