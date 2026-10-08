"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { Product, PRODUCTS_BY_ID } from "@/lib/products";

export type { Product };

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartNotice {
  id: number;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  /** False until the saved basket has been read in the browser. */
  ready: boolean;
  itemCount: number;
  addToCart: (product: Product, quantity: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  total: number;
  notice: CartNotice | null;
  dismissNotice: () => void;
}

// The basket is kept in localStorage as product ids and quantities only.
// Names and prices are always read from the catalogue, so a saved basket
// can never carry an old price into checkout.
type Entry = { id: string; quantity: number };

const STORAGE_KEY = "nades-hands-basket";
const MAX_QUANTITY = 20;
const EMPTY: Entry[] = [];

let entries: Entry[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function parse(raw: string | null): Entry[] {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;
    return data.flatMap((e) =>
      e &&
      typeof e.id === "string" &&
      PRODUCTS_BY_ID.has(e.id) &&
      Number.isInteger(e.quantity) &&
      e.quantity > 0
        ? [{ id: e.id, quantity: Math.min(e.quantity, MAX_QUANTITY) }]
        : [],
    );
  } catch {
    return EMPTY;
  }
}

function readStorage() {
  try {
    return parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return EMPTY;
  }
}

function getSnapshot() {
  if (!loaded) {
    loaded = true;
    entries = readStorage();
  }
  return entries;
}

const getServerSnapshot = () => EMPTY;

function write(next: Entry[]) {
  entries = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or a full disk: the basket still works for this visit.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    entries = parse(event.newValue);
    listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notice, setNotice] = useState<CartNotice | null>(null);

  const cart = useMemo(
    () =>
      stored.flatMap((entry) => {
        const product = PRODUCTS_BY_ID.get(entry.id);
        return product ? [{ product, quantity: entry.quantity }] : [];
      }),
    [stored],
  );

  const addToCart = useCallback((product: Product, quantity: number) => {
    const current = getSnapshot();
    const existing = current.find((e) => e.id === product.id);
    write(
      existing
        ? current.map((e) =>
            e.id === product.id
              ? { ...e, quantity: Math.min(e.quantity + quantity, MAX_QUANTITY) }
              : e,
          )
        : [...current, { id: product.id, quantity: Math.min(quantity, MAX_QUANTITY) }],
    );
    setNotice({ id: Date.now(), product, quantity });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    write(getSnapshot().filter((e) => e.id !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      write(getSnapshot().filter((e) => e.id !== productId));
      return;
    }
    write(
      getSnapshot().map((e) =>
        e.id === productId
          ? { ...e, quantity: Math.min(quantity, MAX_QUANTITY) }
          : e,
      ),
    );
  }, []);

  const clearCart = useCallback(() => write(EMPTY), []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        ready,
        itemCount,
        addToCart,
        setQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        total,
        notice,
        dismissNotice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const MAX_ITEM_QUANTITY = MAX_QUANTITY;

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
