"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, CircleAlert, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatGHS } from "@/lib/products";
import { formatBakeDay, getBakeSchedule, useNow } from "@/lib/bake";
import { loadLastOrder, SHOP_WHATSAPP, splitDeliveryDay } from "@/lib/customer";

const noopSubscribe = () => () => {};

interface TrackedOrder {
  status: string;
  created_at: string;
  total_amount: number;
  paystack_ref: string;
  items: { name: string; quantity: number }[] | null;
  notes: string | null;
}

type Lookup =
  | { ref: string; state: "found"; order: TrackedOrder }
  | { ref: string; state: "missing" | "error" };

const placedFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

function LookupForm({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const ref = value.trim();
        if (ref) router.push(`/tracking?ref=${encodeURIComponent(ref)}`);
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <div className="flex-1">
        <label htmlFor="ref" className="sr-only">
          Order reference
        </label>
        <input
          id="ref"
          name="ref"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Order reference"
          autoComplete="off"
          spellCheck={false}
          required
          className="field"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        <Search className="size-4" aria-hidden />
        Track order
      </button>
    </form>
  );
}

export default function TrackingView() {
  const ref = useSearchParams().get("ref")?.trim() || "";
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const now = useNow();
  const lastOrder = useSyncExternalStore(noopSubscribe, loadLastOrder, () => null);

  useEffect(() => {
    if (!ref) return;
    let cancelled = false;

    supabase
      .from("orders")
      .select("status, created_at, total_amount, paystack_ref, items, notes")
      .eq("paystack_ref", ref)
      .limit(1)
      .then(
        ({ data, error }) => {
          if (cancelled) return;
          if (error) setLookup({ ref, state: "error" });
          else if (!data?.length) setLookup({ ref, state: "missing" });
          else setLookup({ ref, state: "found", order: data[0] as TrackedOrder });
        },
        () => {
          if (!cancelled) setLookup({ ref, state: "error" });
        },
      );

    return () => {
      cancelled = true;
    };
  }, [ref]);

  if (!ref) {
    return (
      <>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05] tracking-tight">
          Track your order
        </h1>
        <p className="mb-6 mt-3 text-mocha">
          Enter the reference from your confirmation screen or your Paystack
          receipt email.
        </p>
        <LookupForm />
        {lastOrder && (
          <Link
            href={`/tracking?ref=${encodeURIComponent(lastOrder)}`}
            className="slip mt-6 flex items-center justify-between gap-4 p-4 transition-colors duration-200 ease-soft hover:border-mocha"
          >
            <span className="min-w-0">
              <span className="block font-semibold">Your last order</span>
              <span className="block truncate text-sm text-mocha">
                Reference {lastOrder}
              </span>
            </span>
            <ArrowRight className="size-5 shrink-0" aria-hidden />
          </Link>
        )}
      </>
    );
  }

  // A result for an earlier reference is stale while the new one loads.
  const current = lookup?.ref === ref ? lookup : null;

  if (!current) {
    return (
      <div aria-busy="true" className="slip animate-pulse p-6 sm:p-8">
        <span className="sr-only">Looking up your order</span>
        <div className="h-8 w-2/3 rounded-field bg-oat" />
        <div className="mt-3 h-4 w-1/2 rounded-field bg-oat" />
        <div className="mt-8 space-y-6">
          <div className="h-10 rounded-field bg-oat" />
          <div className="h-10 rounded-field bg-oat" />
          <div className="h-10 rounded-field bg-oat" />
        </div>
      </div>
    );
  }

  if (current.state !== "found") {
    const missing = current.state === "missing";
    return (
      <>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05] tracking-tight">
          {missing ? "We can't find that order" : "We couldn't check that order"}
        </h1>
        <p
          role="alert"
          className="mb-6 mt-4 flex gap-3 rounded-field bg-jam-soft p-4 text-jam"
        >
          <CircleAlert className="mt-1 size-4 shrink-0" aria-hidden />
          <span>
            {missing
              ? `No order matches the reference "${ref}". Check it against your receipt and try again.`
              : "Something went wrong on our side. Check your connection and try again in a moment."}
          </span>
        </p>
        <LookupForm initial={ref} />
        {SHOP_WHATSAPP && (
          <p className="mt-4 text-mocha">
            Still stuck?{" "}
            <a href={SHOP_WHATSAPP} className="font-semibold text-cocoa underline underline-offset-4">
              Message us on WhatsApp
            </a>
          </p>
        )}
      </>
    );
  }

  const { order } = current;
  const placed = new Date(order.created_at);
  const { deliveryDay } = splitDeliveryDay(order.notes);
  const bakeDate = getBakeSchedule(placed).bakeDay;
  const bakeDay = formatBakeDay(bakeDate);
  const delivered =
    order.status === "Completed" || order.status === "Delivered";
  // Baking is done by Friday noon GMT; delivery starts that afternoon.
  const baked =
    delivered || (now !== null && now.getTime() > bakeDate.getTime() + 12 * 3600_000);

  const steps = [
    {
      title: "Paid and received",
      detail: placedFormat.format(placed),
      done: true,
    },
    {
      title: baked ? "Baked" : `Baking on ${bakeDay}`,
      detail: baked ? bakeDay : "Baked fresh that morning.",
      done: baked,
    },
    {
      title: delivered ? "Delivered" : "Delivery",
      detail: delivered
        ? "Enjoy. Thank you for ordering."
        : deliveryDay || "Friday afternoon or over the weekend.",
      done: delivered,
    },
  ];
  const currentStep = steps.findIndex((step) => !step.done);

  return (
    <div className="slip animate-rise">
      <div className="p-6 sm:p-8">
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {delivered
            ? "Your order was delivered"
            : baked
              ? "Your order is baked and due for delivery"
              : `Your order is booked for ${bakeDay}`}
        </h1>
        <p className="mt-2 break-all text-mocha">
          Reference {order.paystack_ref}
        </p>

        <ol className="mt-8">
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            const isLast = index === steps.length - 1;
            return (
              <li
                key={step.title}
                aria-current={isCurrent ? "step" : undefined}
                className="relative flex gap-4 pb-7 last:pb-0"
              >
                {!isLast && (
                  <span
                    aria-hidden
                    className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${
                      step.done ? "bg-leaf" : "bg-crust"
                    }`}
                  />
                )}
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums ${
                    step.done
                      ? "bg-leaf text-paper"
                      : isCurrent
                        ? "bg-butter text-cocoa-deep"
                        : "bg-oat text-mocha"
                  }`}
                >
                  {step.done ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
                <div className="pt-0.5">
                  <p className="font-semibold leading-snug">
                    {step.title}
                    {step.done && <span className="sr-only"> (done)</span>}
                  </p>
                  <p className="mt-0.5 text-sm text-mocha">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="slip-tear p-6 sm:px-8">
        {Array.isArray(order.items) && order.items.length > 0 && (
          <ul className="mb-4 space-y-1.5">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between gap-4">
                <span>{item.name}</span>
                <span className="shrink-0 text-mocha tabular-nums">
                  × {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-semibold">Total paid</span>
          <span className="font-display text-2xl font-semibold tabular-nums">
            {formatGHS(Number(order.total_amount || 0))}
          </span>
        </div>
      </div>

      <div className="slip-tear p-6 sm:px-8">
        <Link href="/" className="btn btn-quiet w-full">
          Back to the menu
        </Link>
      </div>
    </div>
  );
}
