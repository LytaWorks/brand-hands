// Small conveniences kept on the customer's own device: their delivery
// details for next week's order, and the reference of their last order.

const DETAILS_KEY = "nades-hands-details";
const LAST_ORDER_KEY = "nades-hands-last-order";

export interface SavedDetails {
  fullName: string;
  email: string;
  phone: string;
  deliveryLocation: string;
}

export function loadDetails(): Partial<SavedDetails> {
  try {
    const data: unknown = JSON.parse(
      window.localStorage.getItem(DETAILS_KEY) || "{}",
    );
    if (!data || typeof data !== "object") return {};
    const out: Partial<SavedDetails> = {};
    for (const key of ["fullName", "email", "phone", "deliveryLocation"] as const) {
      const value = (data as Record<string, unknown>)[key];
      if (typeof value === "string") out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveDetails(details: SavedDetails) {
  try {
    window.localStorage.setItem(DETAILS_KEY, JSON.stringify(details));
  } catch {
    // Storage is unavailable; the order itself is unaffected.
  }
}

export function loadLastOrder(): string | null {
  try {
    return window.localStorage.getItem(LAST_ORDER_KEY);
  } catch {
    return null;
  }
}

export function saveLastOrder(reference: string) {
  try {
    window.localStorage.setItem(LAST_ORDER_KEY, reference);
  } catch {
    // Storage is unavailable; the reference is still shown on screen.
  }
}

/**
 * The delivery day is stored at the front of the order notes, so it needs
 * no extra database column: "Deliver: Saturday 17 Oct. Call at the gate".
 */
export function withDeliveryDay(day: string, notes: string) {
  return `Deliver: ${day}. ${notes.trim()}`.trim();
}

export function splitDeliveryDay(notes: string | null | undefined) {
  const match = /^Deliver: ([^.]+)\.\s*([\s\S]*)$/.exec(notes || "");
  return match
    ? { deliveryDay: match[1], notes: match[2] }
    : { deliveryDay: null, notes: notes || "" };
}

/** wa.me link for a Ghanaian or international number, or null if unusable. */
export function whatsappLink(phone: string | null | undefined) {
  let digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) digits = `233${digits.slice(1)}`;
  return digits.length >= 11 ? `https://wa.me/${digits}` : null;
}

/** The shop's own WhatsApp, set with NEXT_PUBLIC_WHATSAPP_NUMBER. */
export const SHOP_WHATSAPP = whatsappLink(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
