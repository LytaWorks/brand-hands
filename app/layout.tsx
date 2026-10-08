import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import BasketToast from "@/components/BasketToast";
import PoweredBy from "@/components/PoweredBy";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const description =
  "Loaf cakes and cupcakes made by hand and baked every Friday morning. Order by Thursday 5pm for delivery on campus that afternoon or weekend.";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: "Nades Hands | Loaf cakes and cupcakes, baked every Friday",
    template: "%s | Nades Hands",
  },
  description,
  openGraph: {
    title: "Nades Hands | Loaf cakes and cupcakes, baked every Friday",
    description,
    siteName: "Nades Hands",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#3d2822",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${figtree.variable} ${fraunces.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#content"
          className="btn btn-primary btn-sm sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50"
        >
          Skip to content
        </a>
        <CartProvider>
          <Header />
          <div id="content" className="flex flex-1 flex-col">
            {children}
          </div>
          <CartDrawer />
          <BasketToast />
        </CartProvider>
        <PoweredBy />
      </body>
    </html>
  );
}
