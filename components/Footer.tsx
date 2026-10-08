import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-b border-flour/10 bg-cocoa-deep text-flour">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight">
            Nades Hands
          </p>
          <p className="mt-3 max-w-sm text-flour/70">
            Loaf cakes and cupcakes, made by hand and baked to order every
            Friday.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Get in touch</h2>
          <ul className="mt-3 space-y-1">
            <li>
              <a
                href="tel:+233000000000"
                className="inline-flex items-center gap-2.5 py-1.5 text-flour/70 transition-colors duration-200 hover:text-butter focus-visible:outline-butter"
              >
                <Phone className="size-4 shrink-0" aria-hidden />
                +233 (0) 50 000 0000
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@nadeshands.com"
                className="inline-flex items-center gap-2.5 py-1.5 text-flour/70 transition-colors duration-200 hover:text-butter focus-visible:outline-butter"
              >
                <Mail className="size-4 shrink-0" aria-hidden />
                hello@nadeshands.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">Order</h2>
          <ul className="mt-3 space-y-1">
            <li>
              <Link
                href="/#menu"
                className="inline-block py-1.5 text-flour/70 transition-colors duration-200 hover:text-butter focus-visible:outline-butter"
              >
                This week&apos;s menu
              </Link>
            </li>
            <li>
              <Link
                href="/tracking"
                className="inline-block py-1.5 text-flour/70 transition-colors duration-200 hover:text-butter focus-visible:outline-butter"
              >
                Track an order
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="mx-auto max-w-6xl border-t border-flour/10 px-4 py-6 text-sm text-flour/60 sm:px-6">
        © {new Date().getFullYear()} Nades Hands. All rights reserved.
      </p>
    </footer>
  );
}
