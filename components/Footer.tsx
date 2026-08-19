import { Heart, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2A1B17] text-amber-100/90 border-t border-amber-900/50 mt-auto">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left items-start">
          {/* 1. Brand & Brief Tagline */}
          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-black font-serif text-amber-50 tracking-tight">
              Nades Hands
            </h3>
            <p className="text-sm md:text-base text-amber-200/80 leading-relaxed max-w-sm mx-auto md:mx-0">
              Handcrafted cakes & artisanal bakes, made fresh for your sweetest
              weekend moments.
            </p>
          </div>

          {/* 2. Contact Information & Email */}
          <div className="space-y-3">
            <h4 className="text-xs md:text-sm font-bold text-amber-400 uppercase tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-sm md:text-base text-amber-100/90 flex flex-col items-center md:items-start">
              <li>
                <a
                  href="tel:+233000000000"
                  className="inline-flex items-center gap-2.5 hover:text-amber-300 transition-colors"
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-amber-400 shrink-0" />
                  <span>+233 (0) 50 000 0000</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@nadeshands.com"
                  className="inline-flex items-center gap-2.5 hover:text-amber-300 transition-colors"
                >
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-amber-400 shrink-0" />
                  <span>hello@nadeshands.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Quick Links & Crafted Note */}
          <div className="space-y-3 md:text-right">
            <h4 className="text-xs md:text-sm font-bold text-amber-400 uppercase tracking-wider">
              Order Fresh
            </h4>
            <div className="flex flex-col md:items-end gap-2 text-sm md:text-base font-medium">
              <a
                href="#products-section"
                className="hover:text-amber-300 transition-colors"
              >
                Browse Our Bakes
              </a>
              <span className="inline-flex items-center justify-center md:justify-end gap-1.5 text-amber-200/80 pt-1">
                Baked with{" "}
                <Heart className="w-4 h-4 text-amber-500 fill-amber-500 inline" />{" "}
                every week
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 md:mt-12 pt-6 border-t border-amber-900/40 text-center text-xs md:text-sm text-amber-300/60">
          © {new Date().getFullYear()} Nades Hands. All rights reserved.
        </div>
      </div>

      {/* Sub-Footer Announcement Nav (Black background with white text) */}
      <div className="bg-black text-white py-3.5 px-4 text-center text-xs md:text-sm font-medium tracking-wide border-t border-neutral-900">
        <span>Powered by </span>
        <a
          href="https://lytaworks.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-white hover:text-amber-400 underline underline-offset-4 transition-colors"
        >
          lytaworks.com
        </a>
      </div>
    </footer>
  );
}
