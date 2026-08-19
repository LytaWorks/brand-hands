import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Nased Hands | Fresh Loaf Cakes & Cupcakes",
  description:
    "Order fresh loaf cakes and cupcakes baked for weekend delivery on campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <CartDrawer />
          <div className="flex-1">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
