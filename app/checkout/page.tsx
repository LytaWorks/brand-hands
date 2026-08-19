"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryLocation: "",
    notes: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.deliveryLocation
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

    try {
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: paystackKey,
        email: formData.email,
        amount: Math.round(total * 100),
        currency: "GHS",
        onSuccess: async (transaction: { reference: string }) => {
          const itemsPayload = cart.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: item.product.price * item.quantity,
          }));

          const { error } = await supabase.from("orders").insert([
            {
              full_name: formData.fullName,
              customer_name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              phone_number: formData.phone,
              delivery_location: formData.deliveryLocation,
              digital_address: formData.deliveryLocation,
              landmark: formData.deliveryLocation,
              notes: formData.notes,
              total_amount: total,
              paystack_ref: transaction.reference,
              items: itemsPayload,
              status: "Pending",
            },
          ]);

          if (error) {
            console.error("Supabase save error:", error.message);
            alert(
              `Payment succeeded, but order logging had an issue: ${error.message}`,
            );
          }

          setIsProcessing(false);
          setOrderSuccess(true);
          clearCart();
        },
        onCancel: () => {
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error("Paystack error:", error);
      setIsProcessing(false);
      alert("Failed to initialize Paystack payment.");
    }
  };

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 text-center shadow-xs border border-gray-100 space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Order Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Thank you,{" "}
            <span className="font-bold text-gray-900">{formData.fullName}</span>
            ! Your payment was successful and your order has been received.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all text-sm mt-4"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Your cart is empty
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Add some fresh bakes to your cart before checking out.
        </p>
        <Link
          href="/"
          className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors"
        >
          Browse Selection
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/70 pb-16">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 py-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <span className="text-base font-black text-amber-950">Checkout</span>
          <div className="w-12"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-white p-5 sm:p-7 rounded-3xl border border-gray-100 shadow-xs space-y-5">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <MapPin className="w-5 h-5 text-amber-600" /> Delivery Details
          </h2>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Nana Ama"
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-base sm:text-sm font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-base sm:text-sm font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="024 000 0000"
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-base sm:text-sm font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Campus / Hostel Location *
              </label>
              <input
                type="text"
                name="deliveryLocation"
                required
                value={formData.deliveryLocation}
                onChange={handleInputChange}
                placeholder="e.g. Pentagon Block B, Room 204"
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-base sm:text-sm font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Delivery Notes (Optional)
              </label>
              <textarea
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="e.g. Call me when at the entrance"
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-base sm:text-sm font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 resize-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl shadow-xs transition-all text-sm mt-4 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              {isProcessing
                ? "Opening Paystack..."
                : `Pay GHS ${total.toFixed(2)} with Paystack`}
            </button>
          </form>
        </div>

        <div className="md:col-span-5 bg-white p-5 sm:p-7 rounded-3xl border border-gray-100 shadow-xs h-fit space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Order Summary
          </h2>

          <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="py-2.5 flex justify-between text-xs sm:text-sm"
              >
                <div>
                  <p className="font-bold text-gray-800">{item.product.name}</p>
                  <p className="text-gray-400 font-medium">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-black text-gray-900">
                  GHS {(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm sm:text-base font-black text-gray-900">
            <span>Total Amount</span>
            <span className="text-amber-600 text-lg">
              GHS {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
