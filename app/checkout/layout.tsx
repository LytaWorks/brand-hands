import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Add your delivery details and pay securely with Paystack.",
  robots: { index: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
