"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_ITEM_QUANTITY } from "@/context/CartContext";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  /** What is being counted, for screen readers. */
  label: string;
  /** Lowest value the minus button will go to. */
  min?: number;
  size?: "sm" | "md";
}

export default function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  size = "md",
}: QuantityStepperProps) {
  const button =
    size === "sm"
      ? "size-8 [&_svg]:size-3.5"
      : "size-10 [&_svg]:size-4";

  return (
    <div
      role="group"
      aria-label={`Quantity of ${label}`}
      className="inline-flex items-center rounded-full bg-oat p-1"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="One fewer"
        className={`${button} relative flex items-center justify-center rounded-full bg-paper text-cocoa transition-transform duration-200 ease-soft after:absolute after:-inset-1 active:scale-95 disabled:opacity-40`}
      >
        <Minus aria-hidden />
      </button>
      <span
        aria-live="polite"
        className={`${size === "sm" ? "w-7 text-sm" : "w-9 text-base"} text-center font-semibold tabular-nums`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_ITEM_QUANTITY}
        aria-label="One more"
        className={`${button} relative flex items-center justify-center rounded-full bg-paper text-cocoa transition-transform duration-200 ease-soft after:absolute after:-inset-1 active:scale-95 disabled:opacity-40`}
      >
        <Plus aria-hidden />
      </button>
    </div>
  );
}
