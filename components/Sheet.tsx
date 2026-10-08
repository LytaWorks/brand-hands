"use client";

import { useEffect, useRef } from "react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  label: string;
  variant: "drawer" | "product";
  children: React.ReactNode;
}

// A native modal <dialog>: the browser handles the focus trap, Escape,
// returning focus on close and making the page behind inert.
export default function Sheet({
  open,
  onClose,
  label,
  variant,
  children,
}: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className={`sheet sheet-${variant}`}
      onClose={onClose}
      onClick={(event) => {
        // A click that lands on the dialog itself is a click on the backdrop.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
