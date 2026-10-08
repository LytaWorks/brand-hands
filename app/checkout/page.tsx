"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { formatGHS } from "@/lib/products";
import BakeDate from "@/components/BakeDate";
import { formatBakeDay, getBakeSchedule, useNow } from "@/lib/bake";
import {
  loadDetails,
  saveDetails,
  saveLastOrder,
  SHOP_WHATSAPP,
  withDeliveryDay,
} from "@/lib/customer";
import {
  ArrowLeft,
  CircleAlert,
  CircleCheck,
  LockKeyhole,
  ShoppingBasket,
} from "lucide-react";

type FieldName = "fullName" | "email" | "phone" | "deliveryLocation";
type FormData = Record<FieldName | "notes" | "deliveryDay", string>;
type FormErrors = Partial<Record<FieldName | "deliveryDay", string>>;

const DAY_MS = 24 * 60 * 60 * 1000;

interface Confirmation {
  reference: string;
  deliveryDay: string;
  name: string;
  total: number;
  /** Set when Paystack took the payment but the order row did not save. */
  saveFailed: boolean;
}

function validate(data: FormData) {
  const errors: FormErrors = {};
  if (!data.fullName.trim()) errors.fullName = "Enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) {
    errors.email = "Enter an email like name@example.com. Your receipt goes here.";
  }
  if (data.phone.replace(/\D/g, "").length < 9) {
    errors.phone = "Enter a phone number we can reach you on.";
  }
  if (!data.deliveryLocation.trim()) {
    errors.deliveryLocation = "Tell us your hostel, block and room.";
  }
  if (!data.deliveryDay) errors.deliveryDay = "Choose a delivery day.";
  return errors;
}

export default function CheckoutPage() {
  const { ready } = useCart();
  // The form mounts only in the browser, once saved details can be read.
  if (!ready) {
    return <main className="flex-1" aria-busy="true" />;
  }
  return <Checkout />;
}

function Checkout() {
  const { cart, itemCount, total, clearCart } = useCart();
  const now = useNow();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<FormData>(() => ({
    fullName: "",
    email: "",
    phone: "",
    deliveryLocation: "",
    ...loadDetails(),
    deliveryDay: "",
    notes: "",
  }));
  const [errors, setErrors] = useState<FormErrors>({});

  const bakeDay = now ? getBakeSchedule(now).bakeDay : null;
  const deliveryDays = bakeDay
    ? [
        { label: "Friday afternoon", suffix: " afternoon", offset: 0 },
        { label: "Saturday", suffix: "", offset: 1 },
        { label: "Sunday", suffix: "", offset: 2 },
      ].map(({ label, suffix, offset }) => {
        const day = formatBakeDay(new Date(bakeDay.getTime() + offset * DAY_MS));
        return {
          label,
          // "Saturday 17 Oct" is stored with the order; "17 Oct" is shown under the label.
          value: day + suffix,
          date: day.slice(day.indexOf(" ") + 1),
        };
      })
    : [];
  const [formError, setFormError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const found = validate(formData);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
    if (!paystackKey) {
      setFormError(
        "Online payment is not available right now. Please contact us to place your order.",
      );
      return;
    }

    setIsProcessing(true);

    try {
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: paystackKey,
        email: formData.email.trim(),
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
              notes: withDeliveryDay(formData.deliveryDay, formData.notes),
              total_amount: total,
              paystack_ref: transaction.reference,
              items: itemsPayload,
              status: "Pending",
            },
          ]);

          if (error) {
            console.error("Supabase save error:", error.message);
          }

          saveDetails({
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            deliveryLocation: formData.deliveryLocation.trim(),
          });
          if (!error) saveLastOrder(transaction.reference);

          setConfirmation({
            deliveryDay: formData.deliveryDay,
            reference: transaction.reference,
            name: formData.fullName.trim(),
            total,
            saveFailed: Boolean(error),
          });
          setIsProcessing(false);
          clearCart();
        },
        onCancel: () => {
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error("Paystack error:", error);
      setIsProcessing(false);
      setFormError(
        "We could not open the payment window. Check your connection and try again.",
      );
    }
  };

  if (confirmation) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="slip w-full max-w-md animate-rise">
          <div className="p-6 text-center sm:p-8">
            <CircleCheck className="mx-auto size-12 text-leaf" aria-hidden />
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
              Order confirmed
            </h1>
            <p className="mt-2 text-mocha">
              Thank you, {confirmation.name}. We received your payment of{" "}
              {formatGHS(confirmation.total)}.
            </p>
          </div>

          <dl className="slip-tear space-y-3 p-6 sm:px-8">
            <div className="flex justify-between gap-4">
              <dt className="text-mocha">Reference</dt>
              <dd className="break-all text-right font-semibold">
                {confirmation.reference}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mocha">Delivery</dt>
              <dd className="text-right font-semibold">
                {confirmation.deliveryDay}
              </dd>
            </div>
          </dl>

          {confirmation.saveFailed && (
            <p
              role="alert"
              className="mx-6 mb-6 flex gap-3 rounded-field bg-jam-soft p-4 text-sm text-jam sm:mx-8"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                Your payment went through, but we could not save your delivery
                details. Please send us the reference above with your name and
                hostel so we can bake your order.
                {SHOP_WHATSAPP && (
                  <>
                    {" "}
                    <a href={SHOP_WHATSAPP} className="font-semibold underline">
                      Message us on WhatsApp
                    </a>
                  </>
                )}
              </span>
            </p>
          )}

          <div className="slip-tear flex flex-col gap-3 p-6 sm:px-8">
            {!confirmation.saveFailed && (
              <Link
                href={`/tracking?ref=${encodeURIComponent(confirmation.reference)}`}
                className="btn btn-primary"
              >
                Track this order
              </Link>
            )}
            <Link href="/" className="btn btn-quiet">
              Back to the menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <ShoppingBasket className="size-12 text-mocha" aria-hidden />
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
          Your basket is empty
        </h1>
        <p className="mt-2 max-w-sm text-mocha">
          Add something from the menu first, then come back to check out.
        </p>
        <Link href="/#menu" className="btn btn-primary mt-6">
          See the menu
        </Link>
      </main>
    );
  }

  const fieldProps = (name: FieldName) => ({
    id: name,
    name,
    value: formData[name],
    onChange: handleInputChange,
    className: "field",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const fieldError = (name: FieldName) =>
    errors[name] && (
      <p id={`${name}-error`} className="mt-1.5 text-sm text-jam">
        {errors[name]}
      </p>
    );

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-crust bg-flour/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="whitespace-nowrap font-display text-2xl font-semibold leading-none tracking-tight"
          >
            Nades Hands
          </Link>
          <Link href="/" className="btn btn-quiet btn-sm">
            <ArrowLeft className="size-4" aria-hidden />
            <span className="sm:hidden">Menu</span>
            <span className="hidden sm:inline">Back to the menu</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05] tracking-tight">
          Checkout
        </h1>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.25fr_1fr] md:items-start md:gap-12">
          <form
            ref={formRef}
            onSubmit={handlePayment}
            noValidate
            className="space-y-5"
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Where should we deliver?
            </h2>

            <div>
              <label htmlFor="fullName" className="mb-1.5 block font-medium">
                Full name
              </label>
              <input
                {...fieldProps("fullName")}
                type="text"
                autoComplete="name"
                placeholder="Nana Ama Mensah"
              />
              {fieldError("fullName")}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1.5 block font-medium">
                  Email
                </label>
                <input
                  {...fieldProps("email")}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder="name@example.com"
                />
                {fieldError("email")}
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block font-medium">
                  Phone
                </label>
                <input
                  {...fieldProps("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="024 000 0000"
                />
                {fieldError("phone")}
              </div>
            </div>

            <div>
              <label
                htmlFor="deliveryLocation"
                className="mb-1.5 block font-medium"
              >
                Hostel, block and room
              </label>
              <input
                {...fieldProps("deliveryLocation")}
                type="text"
                autoComplete="street-address"
                placeholder="Pentagon Block B, Room 204"
              />
              {fieldError("deliveryLocation")}
            </div>

            <fieldset
              aria-describedby={errors.deliveryDay ? "deliveryDay-error" : undefined}
            >
              <legend className="mb-1.5 font-medium">Delivery day</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {deliveryDays.map((day) => (
                  <label
                    key={day.value}
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-field border bg-paper px-3.5 py-2.5 transition-colors duration-200 ease-soft has-[:checked]:border-cocoa has-[:checked]:bg-butter-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cocoa ${
                      errors.deliveryDay ? "border-jam" : "border-crust hover:border-mocha"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryDay"
                      value={day.value}
                      checked={formData.deliveryDay === day.value}
                      onChange={handleInputChange}
                      className="size-4 shrink-0 accent-cocoa outline-none"
                    />
                    <span className="leading-tight">
                      <span className="block font-semibold">{day.label}</span>
                      <span className="block text-sm text-mocha">
                        {day.date}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.deliveryDay && (
                <p id="deliveryDay-error" className="mt-1.5 text-sm text-jam">
                  {errors.deliveryDay}
                </p>
              )}
            </fieldset>

            <div>
              <label htmlFor="notes" className="mb-1.5 block font-medium">
                Delivery notes{" "}
                <span className="font-normal text-mocha">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Call me when you are at the entrance"
                className="field resize-none"
              />
            </div>

            {formError && (
              <p
                role="alert"
                className="flex gap-3 rounded-field bg-jam-soft p-4 text-sm text-jam"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{formError}</span>
              </p>
            )}

            <div className="pt-1">
              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-primary w-full tabular-nums"
              >
                <LockKeyhole className="size-4" aria-hidden />
                {isProcessing ? "Opening Paystack…" : `Pay ${formatGHS(total)}`}
              </button>
              <p className="mt-3 text-center text-sm text-mocha">
                Paid securely through Paystack.
              </p>
            </div>
          </form>

          <aside aria-labelledby="summary-heading" className="slip md:sticky md:top-24">
            <div className="p-5 sm:p-6">
              <h2
                id="summary-heading"
                className="font-display text-2xl font-semibold tracking-tight"
              >
                Your order
                <span className="ml-2 font-sans text-base font-medium text-mocha tabular-nums">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </h2>

              <ul className="mt-4 space-y-4">
                {cart.map((item) => (
                  <li key={item.product.id} className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-field bg-oat">
                      <Image
                        src={item.product.image}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-snug">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-mocha tabular-nums">
                        {item.quantity} × {formatGHS(item.product.price)}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold tabular-nums">
                      {formatGHS(item.product.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="slip-tear space-y-2 p-5 sm:p-6">
              <div className="flex justify-between gap-4">
                <dt className="text-mocha">Baked on</dt>
                <dd className="font-semibold">
                  <BakeDate />
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mocha">Delivered</dt>
                <dd className="text-right font-semibold">
                  {formData.deliveryDay || "Choose a day"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 pt-2">
                <dt className="font-semibold">Total</dt>
                <dd className="font-display text-2xl font-semibold tabular-nums">
                  {formatGHS(total)}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </main>
    </>
  );
}
