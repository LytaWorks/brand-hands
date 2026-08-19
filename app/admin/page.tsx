"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  Eye,
  EyeOff,
  Lock,
  LogIn,
  RefreshCw,
  Package,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  AlertCircle,
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

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error.message);
    } else if (data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
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
      setError("Invalid admin password. Please try again.");
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert(`Failed to update status: ${error.message}`);
    } else {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, status: newStatus } : ord,
        ),
      );
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const completedOrders = orders.filter(
    (o) => o.status === "Completed" || o.status === "Delivered",
  ).length;
  const totalRevenue = orders.reduce(
    (acc, o) => acc + Number(o.total_amount || 0),
    0,
  );

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-sm w-full rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-100/70 rounded-2xl flex items-center justify-center mx-auto text-amber-700 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Campus Cake Store Order Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin key"
                  required
                  className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-base sm:text-sm font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs font-semibold text-red-600 bg-red-50/80 p-3 rounded-xl border border-red-100 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-xs"
            >
              <LogIn className="w-4 h-4" /> Access Dashboard
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/70 pb-20">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              🎂
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                Dashboard
              </h1>
              <p className="text-xs font-semibold text-gray-400">Live Orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 px-3 py-2 rounded-xl transition-all"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-gray-600 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs font-bold text-red-600 hover:bg-red-50 active:scale-95 px-3 py-2 rounded-xl border border-red-100 transition-all"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">
                Total Orders
              </span>
              <Package className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900">
              {totalOrders}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">
                Pending
              </span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-600">
              {pendingOrders}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">
                Completed
              </span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-green-600">
              {completedOrders}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">
                Revenue
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900">
              GHS {totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        {loading && orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-sm text-gray-400 shadow-xs">
            Fetching order feed...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-sm text-gray-400 space-y-2 shadow-xs">
            <Package className="w-10 h-10 mx-auto text-gray-300" />
            <p className="font-bold text-gray-700 text-base">No orders yet</p>
            <p className="text-gray-400">
              New customer purchases will appear here live.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {orders.map((order) => {
              const customerName =
                order.full_name || order.customer_name || "N/A";
              const phone = order.phone || order.phone_number || "N/A";
              const location = order.delivery_location || "N/A";
              const isCompleted =
                order.status === "Completed" || order.status === "Delivered";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-4 sm:p-5 border-b border-gray-100/60 bg-gray-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-900 tracking-tight">
                        #{order.paystack_ref.slice(-8).toUpperCase()}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isCompleted
                            ? "bg-green-100 text-green-700 border border-green-200/50"
                            : "bg-amber-100 text-amber-700 border border-amber-200/50"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      {new Date(order.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-4 flex-1 text-xs sm:text-sm">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900 text-sm sm:text-base">
                        {customerName}
                      </p>
                      <div className="flex flex-col gap-1 text-gray-600 pt-0.5">
                        <a
                          href={`tel:${phone}`}
                          className="flex items-center gap-1.5 hover:text-amber-600 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="font-medium">{phone}</span>
                        </a>
                        {order.email && (
                          <span className="flex items-center gap-1.5 text-gray-500 truncate">
                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{order.email}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-amber-50/60 border border-amber-100/80 rounded-2xl p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Delivery Location
                      </div>
                      <p className="text-gray-800 font-semibold leading-relaxed">
                        {location}
                      </p>
                      {order.notes && (
                        <p className="text-xs text-gray-500 italic pt-1 border-t border-amber-200/40 mt-1">
                          &quot;{order.notes}&quot;
                        </p>
                      )}
                    </div>

                    {order.items && Array.isArray(order.items) && (
                      <div className="bg-gray-50/70 rounded-2xl p-3 border border-gray-100 space-y-2">
                        <p className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">
                          Items
                        </p>
                        <div className="divide-y divide-gray-100">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="py-1.5 flex justify-between items-center text-xs sm:text-sm"
                            >
                              <span className="font-medium text-gray-800 truncate pr-2">
                                {item.name}{" "}
                                <span className="font-bold text-gray-400">
                                  x{item.quantity}
                                </span>
                              </span>
                              <span className="font-bold text-gray-900 shrink-0">
                                GHS{" "}
                                {(
                                  item.totalPrice ||
                                  item.unitPrice * item.quantity ||
                                  0
                                ).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                        Total
                      </p>
                      <p className="text-base sm:text-lg font-black text-amber-600">
                        GHS {Number(order.total_amount || 0).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      {!isCompleted ? (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "Completed")
                          }
                          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-xs"
                        >
                          <CheckCircle className="w-4 h-4" /> Complete
                        </button>
                      ) : (
                        <button
                          onClick={() => updateOrderStatus(order.id, "Pending")}
                          className="text-xs sm:text-sm font-bold text-gray-600 bg-gray-200/70 hover:bg-gray-200 active:scale-95 px-3.5 py-2 rounded-xl transition-all"
                        >
                          Mark Pending
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
