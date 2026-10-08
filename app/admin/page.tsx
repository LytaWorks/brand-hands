"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { formatGHS } from "@/lib/products";
import {
  Check,
  CircleAlert,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Undo2,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  created_at: string;
  full_name?: string;
  customer_name?: string;
  email?: string;
  phone?: string;
  phone_number?: string;
  delivery_location?: string;
  notes?: string;
  total_amount: number;
  paystack_ref: string;
  status: string;
  items: OrderItem[];
}

type Filter = "Pending" | "Completed" | "All";

const isDone = (order: Order) =>
  order.status === "Completed" || order.status === "Delivered";

const placedFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [filter, setFilter] = useState<Filter>("Pending");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error.message);
      setFetchError(error.message);
    } else if (data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for the first fetch after sign-in
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
    //.trim prevents trailing spaces from failing the match
    if (password.trim() === adminPassword.trim()) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("That password is not right. Try again.");
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdateError("");
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      setUpdateError(`Could not update the order: ${error.message}`);
    } else {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, status: newStatus } : ord,
        ),
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="slip w-full max-w-sm p-6 sm:p-8">
          <p className="font-display text-2xl font-semibold tracking-tight">
            Nades Hands
          </p>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
            Sign in to orders
          </h1>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="mb-1.5 block font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "password-error" : undefined}
                  className="field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-mocha transition-colors duration-200 hover:text-cocoa"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden />
                  ) : (
                    <Eye className="size-4" aria-hidden />
                  )}
                </button>
              </div>
              {error && (
                <p id="password-error" className="mt-1.5 text-sm text-jam">
                  {error}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Sign in
            </button>
          </form>
        </div>
      </main>
    );
  }

  const pending = orders.filter((o) => !isDone(o));
  const completed = orders.filter(isDone);
  const totalRevenue = orders.reduce(
    (acc, o) => acc + Number(o.total_amount || 0),
    0,
  );

  // What to bake: every item across the orders still waiting.
  const bakeTotals = new Map<string, number>();
  for (const order of pending) {
    if (!Array.isArray(order.items)) continue;
    for (const item of order.items) {
      bakeTotals.set(
        item.name,
        (bakeTotals.get(item.name) || 0) + (item.quantity || 0),
      );
    }
  }
  const bakeList = [...bakeTotals].sort((a, b) => b[1] - a[1]);

  const filters: { name: Filter; count: number }[] = [
    { name: "Pending", count: pending.length },
    { name: "Completed", count: completed.length },
    { name: "All", count: orders.length },
  ];
  const visible =
    filter === "Pending" ? pending : filter === "Completed" ? completed : orders;

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-crust bg-flour/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="font-display text-2xl font-semibold leading-none tracking-tight">
            Nades Hands
            <span className="ml-2 font-sans text-base font-medium text-mocha">
              Orders
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="btn btn-quiet btn-sm"
            >
              <RefreshCw
                className={`size-4 ${loading ? "animate-spin" : ""}`}
                aria-hidden
              />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sr-only sm:hidden">Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="btn btn-quiet btn-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8 sm:px-6">
        <section
          aria-labelledby="bake-list-heading"
          className="slip grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.4fr_1fr] lg:gap-10"
        >
          <div>
            <h1
              id="bake-list-heading"
              className="font-display text-3xl font-semibold tracking-tight"
            >
              {pending.length === 0
                ? "Nothing to bake yet"
                : `To bake: ${pending.length} ${pending.length === 1 ? "order" : "orders"} waiting`}
            </h1>
            {bakeList.length > 0 ? (
              <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {bakeList.map(([name, quantity]) => (
                  <li
                    key={name}
                    className="flex items-baseline justify-between gap-4 border-b border-crust pb-2"
                  >
                    <span>{name}</span>
                    <span className="font-display text-xl font-semibold tabular-nums">
                      {quantity}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-mocha">
                Paid orders appear here with a total for each bake.
              </p>
            )}
          </div>

          <dl className="flex flex-wrap gap-x-8 gap-y-4 self-start lg:border-l lg:border-crust lg:pl-10">
            <div>
              <dt className="text-sm text-mocha">Pending</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">
                {pending.length}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-mocha">Completed</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">
                {completed.length}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-mocha">Revenue</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">
                {formatGHS(totalRevenue)}
              </dd>
            </div>
          </dl>
        </section>

        {(fetchError || updateError) && (
          <p
            role="alert"
            className="flex gap-3 rounded-field bg-jam-soft p-4 text-jam"
          >
            <CircleAlert className="mt-1 size-4 shrink-0" aria-hidden />
            <span>
              {fetchError
                ? `Could not load orders: ${fetchError}. Press Refresh to try again.`
                : updateError}
            </span>
          </p>
        )}

        <section aria-label="Orders">
          <div
            role="group"
            aria-label="Filter orders"
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {filters.map(({ name, count }) => {
              const selected = name === filter;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(name)}
                  className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold tabular-nums transition-colors duration-200 ease-soft ${
                    selected
                      ? "bg-cocoa text-flour"
                      : "bg-oat text-cocoa hover:bg-crust"
                  }`}
                >
                  {name} {count}
                </button>
              );
            })}
          </div>

          {loading && orders.length === 0 ? (
            <div
              aria-busy="true"
              className="mt-6 grid animate-pulse gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              <span className="sr-only">Loading orders</span>
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-72 rounded-card bg-oat" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="mt-6 rounded-card border border-dashed border-crust p-10 text-center">
              <p className="font-display text-xl font-semibold">
                {orders.length === 0
                  ? "No orders yet"
                  : `No ${filter.toLowerCase()} orders`}
              </p>
              <p className="mt-1 text-mocha">
                {orders.length === 0
                  ? "When a customer pays, their order shows up here."
                  : "Choose another filter to see the rest."}
              </p>
            </div>
          ) : (
            <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((order) => {
                const customerName =
                  order.full_name || order.customer_name || "No name given";
                const phone = order.phone || order.phone_number;
                const done = isDone(order);

                return (
                  <li key={order.id} className="slip flex flex-col">
                    <div className="flex-1 space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-lg font-semibold leading-snug">
                            {customerName}
                          </p>
                          <p className="text-sm text-mocha">
                            {placedFormat.format(new Date(order.created_at))} ·
                            #{order.paystack_ref.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            done
                              ? "bg-leaf-soft text-leaf"
                              : "bg-butter-soft text-cocoa-deep"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <ul className="space-y-1 text-sm">
                        <li className="flex gap-2">
                          <MapPin
                            className="mt-0.5 size-4 shrink-0 text-mocha"
                            aria-hidden
                          />
                          <span className="font-medium">
                            {order.delivery_location || "No location given"}
                          </span>
                        </li>
                        {phone && (
                          <li>
                            <a
                              href={`tel:${phone}`}
                              className="inline-flex items-center gap-2 underline decoration-crust underline-offset-4 hover:decoration-cocoa"
                            >
                              <Phone
                                className="size-4 shrink-0 text-mocha"
                                aria-hidden
                              />
                              {phone}
                            </a>
                          </li>
                        )}
                        {order.email && (
                          <li className="flex items-center gap-2 text-mocha">
                            <Mail className="size-4 shrink-0" aria-hidden />
                            <span className="truncate">{order.email}</span>
                          </li>
                        )}
                      </ul>

                      {order.notes && (
                        <p className="rounded-field bg-butter-soft p-3 text-sm">
                          <span className="font-semibold">Note: </span>
                          {order.notes}
                        </p>
                      )}

                      {Array.isArray(order.items) && (
                        <ul className="space-y-1.5 text-sm">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between gap-3">
                              <span>
                                <span className="font-semibold tabular-nums">
                                  {item.quantity} ×
                                </span>{" "}
                                {item.name}
                              </span>
                              <span className="shrink-0 text-mocha tabular-nums">
                                {formatGHS(
                                  item.totalPrice ||
                                    item.unitPrice * item.quantity ||
                                    0,
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="slip-tear flex items-center justify-between gap-3 p-5">
                      <p className="font-display text-xl font-semibold tabular-nums">
                        {formatGHS(Number(order.total_amount || 0))}
                      </p>
                      {done ? (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, "Pending")}
                          className="btn btn-quiet btn-sm"
                        >
                          <Undo2 className="size-4" aria-hidden />
                          Mark pending
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            updateOrderStatus(order.id, "Completed")
                          }
                          className="btn btn-primary btn-sm"
                        >
                          <Check className="size-4" aria-hidden />
                          Mark completed
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
