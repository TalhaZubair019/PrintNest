"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Eye,
  EyeOff,
  Package,
  Heart,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  ArrowLeft,
  Calendar,
  User as UserIcon,
  Shield,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/Store";
import { loginSuccess, logout } from "@/redux/AuthSlice";
import { addToCart } from "@/redux/CartSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import db from "@data/db.json";
import { Country, State, City } from "country-state-city";
import QuickViewModal from "@/components/products/QuickViewModal";
import UserSidebar from "@/components/layout/UserSidebar";

interface TrackingEntry {
  status: string;
  message: string;
  timestamp: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    city?: string;
    country?: string;
    address?: string;
    countryCode?: string;
    stateCode?: string;
    postcode?: string;
    phone?: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
  trackingHistory?: TrackingEntry[];
}

export default function MyAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}

function AccountContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    country: "Pakistan",
    countryCode: "PK",
    stateCode: "",
    province: "",
    postcode: "",
  });

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    if (profileForm.countryCode) {
      setStates(State.getStatesOfCountry(profileForm.countryCode));
      if (profileForm.stateCode) {
        setCities(
          City.getCitiesOfState(profileForm.countryCode, profileForm.stateCode),
        );
      }
    }
  }, [profileForm.countryCode, profileForm.stateCode]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["dashboard", "orders", "wishlist", "profile"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId && orders.length > 0) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [searchParams, orders]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "Pakistan",
        countryCode: user.countryCode || "PK",
        stateCode: user.stateCode || "",
        province: user.province || "",
        postcode: user.postcode || "",
      });
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/public/orders");
      if (res.ok) {
        const data = await res.json();
        const sortedOrders = (data.orders || []).sort((a: Order, b: Order) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setOrders(sortedOrders);
      }
    } catch (err) {
      console.error("Failed to fetch orders");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      dispatch(loginSuccess({ user: data.user, token: data.token }));

      if (data.user.isAdmin) {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const contentArea = document.getElementById("user-content-area");
    if (contentArea) {
      contentArea.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(logout());
    setActiveTab("dashboard");
    setOrders([]);
    router.push("/login");
  };

  const handleAddToCart = (product: any, quantity = 1) => {
    const priceVal =
      typeof product.price === "string"
        ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
        : product.price;
    dispatch(
      addToCart({
        id: product.id,
        name: product.title || product.name,
        price: priceVal,
        image: product.image,
        quantity: quantity,
      }),
    );
    alert(`Added ${quantity} x "${product.title || product.name}" to cart!`);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        alert("Profile updated successfully!");
        dispatch(
          loginSuccess({ user: { ...user, ...profileForm }, token: "active" }),
        );
      }
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-white font-sans text-slate-800">
        <PageHeader title="My Account" breadcrumb="Account" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-32 pt-20">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Login to your account
            </h2>
            <form
              onSubmit={handleLogin}
              className="border border-slate-200 rounded-xl p-8 bg-white shadow-xl shadow-slate-200/50"
            >
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all pr-12"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg bg-linear-to-r from-purple-600 to-blue-500 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:scale-100"
                >
                  {loading ? "Signing in..." : "Log in"}
                </button>
                <div className="text-center text-sm text-slate-500 mt-4">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-purple-600 font-bold hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <PageHeader
          title={`Order #${selectedOrder.id.slice(-8).toUpperCase()}`}
          breadcrumb="Order Details"
        />
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-16">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-purple-600 mb-6 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
            <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-linear-to-r from-purple-50 to-pink-50 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Order Details
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {selectedOrder.date}
                  </span>
                  <OrderStatusBadge status={selectedOrder.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Order Total</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${selectedOrder.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2">
              <OrderTrackingTimeline
                status={selectedOrder.status}
                trackingHistory={selectedOrder.trackingHistory || []}
                order={selectedOrder}
              />
            </div>
            <div className="md:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                  <h3 className="font-bold text-slate-900 text-lg">
                    Items Ordered
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0"
                    >
                      <div className="h-16 w-16 bg-slate-50 rounded-xl relative overflow-hidden shrink-0 border border-slate-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-300">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">
                          {item.name}
                        </h4>
                        <p className="text-slate-500 text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400">
                          ${item.price} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-slate-500 font-medium text-sm">
                    Grand Total
                  </span>
                  <span className="text-xl font-bold text-purple-600">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
      <PageHeader
        title={`Welcome, ${user?.name || "User"}`}
        breadcrumb="Dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="lg:hidden mb-6 flex items-center justify-between bg-[#0f172a] p-4 rounded-2xl shadow-lg border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-600 border border-purple-500/20 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-purple-600/20">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <span className="text-xl font-bold text-white tracking-tight truncate block">
                {user?.name || "User"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user?.isAdmin && (
              <Link
                href="/admin/dashboard"
                className="text-purple-400 hover:text-purple-300 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors"
                title="Switch to Admin View"
              >
                <Shield size={18} />
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="bg-slate-800 text-purple-400 text-xs font-bold py-2 px-3 rounded-lg border border-slate-700 outline-none"
            >
              <option value="dashboard">Dashboard</option>
              <option value="profile">Edit Profile</option>
              <option value="orders">Orders</option>
              <option value="wishlist">Wishlist</option>
              <option value="cart">Cart</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <UserSidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            ordersCount={orders.length}
            wishlistCount={wishlistItems.length}
            cartCount={cartItems.length}
            handleLogout={handleLogout}
          />
          <div id="user-content-area" className="lg:flex-1">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    label="Total Orders"
                    value={orders.length.toString()}
                    icon={<Package className="text-blue-500" />}
                    bg="bg-blue-50"
                  />
                  <StatCard
                    label="Wishlist Items"
                    value={wishlistItems.length.toString()}
                    icon={<Heart className="text-pink-500" />}
                    bg="bg-pink-50"
                  />
                  <StatCard
                    label="Cart Items"
                    value={cartItems.length.toString()}
                    icon={<ShoppingCart className="text-orange-500" />}
                    bg="bg-orange-50"
                  />
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Hello, {user?.name}!
                  </h3>
                  <p className="text-slate-500">
                    From your account dashboard you can view your{" "}
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-purple-600 hover:underline"
                    >
                      recent orders
                    </button>
                    ,{" "}
                    <button
                      onClick={() => setActiveTab("cart")}
                      className="text-purple-600 hover:underline"
                    >
                      items in cart
                    </button>
                    ,{" "}
                    <button
                      onClick={() => setActiveTab("wishlist")}
                      className="text-purple-600 hover:underline"
                    >
                      items in wishlist
                    </button>
                    {" and "}edit your{" "}
                    <button
                      onClick={() => setActiveTab("profile")}
                      className="text-purple-600 hover:underline"
                    >
                      account details
                    </button>
                    .
                  </p>
                </div>
              </div>
            )}
            {activeTab === "profile" && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Edit Profile
                </h3>
                <form
                  onSubmit={handleUpdateProfile}
                  className="space-y-6 max-w-2xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all"
                      value={profileForm.address}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Country
                      </label>
                      <select
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all appearance-none cursor-pointer"
                        value={profileForm.countryCode}
                        onChange={(e) => {
                          const country = countries.find(
                            (c: any) => c.isoCode === e.target.value,
                          );
                          setProfileForm({
                            ...profileForm,
                            countryCode: e.target.value,
                            country: country?.name || "",
                            stateCode: "",
                            city: "",
                          });
                        }}
                      >
                        <option value="">Select Country...</option>
                        {countries.map((c: any) => (
                          <option key={c.isoCode} value={c.isoCode}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Province / State
                      </label>
                      <select
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all appearance-none cursor-pointer"
                        value={profileForm.stateCode}
                        onChange={(e) => {
                          const state = states.find(
                            (s: any) => s.isoCode === e.target.value,
                          );
                          setProfileForm({
                            ...profileForm,
                            stateCode: e.target.value,
                            province: state?.name || "",
                            city: "",
                          });
                        }}
                        disabled={!profileForm.countryCode}
                      >
                        <option value="">Select...</option>
                        {states.map((s: any) => (
                          <option key={s.isoCode} value={s.isoCode}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City
                      </label>
                      {cities.length > 0 ? (
                        <select
                          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all appearance-none cursor-pointer"
                          value={profileForm.city}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              city: e.target.value,
                            })
                          }
                          disabled={!profileForm.stateCode}
                        >
                          <option value="">Select...</option>
                          {cities.map((c: any) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all"
                          value={profileForm.city}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              city: e.target.value,
                            })
                          }
                          disabled={!profileForm.stateCode}
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Postcode
                      </label>
                      <input
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all"
                        value={profileForm.postcode}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            postcode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900">
                    Order History
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Package size={48} className="mx-auto mb-3 opacity-20" />
                      <p>You haven't placed any orders yet.</p>
                      <Link
                        href="/shop"
                        className="text-purple-600 font-bold hover:underline mt-2 inline-block"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-xs">
                        <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-medium text-purple-600">
                              {order.id}
                            </td>
                            <td className="px-6 py-4">{order.date}</td>
                            <td className="px-6 py-4">
                              <OrderStatusBadge status={order.status} />
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-800">
                              ${order.total.toFixed(2)}
                              <span className="text-xs font-normal text-slate-400 block">
                                {order.items.length} items
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="text-blue-600 hover:text-purple-600 font-bold text-xs uppercase tracking-wide border border-blue-200 hover:border-purple-200 px-3 py-1.5 rounded-full transition-all"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
            {activeTab === "wishlist" && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  My Wishlist
                </h3>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Heart size={48} className="mx-auto mb-3 opacity-20" />
                    <p>No items in wishlist yet.</p>
                    <Link
                      href="/shop"
                      className="text-purple-600 font-bold hover:underline mt-2 inline-block"
                    >
                      Go Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="h-16 w-16 bg-slate-50 rounded-lg relative overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-purple-600 font-medium text-sm">
                            {item.price}
                          </p>
                        </div>
                        <button
                          onClick={() => setQuickViewProduct(item)}
                          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-purple-600 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "cart" && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Items in Cart
                </h3>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShoppingCart
                      size={48}
                      className="mx-auto mb-3 opacity-20"
                    />
                    <p>Your cart is empty.</p>
                    <Link
                      href="/shop"
                      className="text-purple-600 font-bold hover:underline mt-2 inline-block"
                    >
                      Go Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 bg-slate-50 rounded-md relative overflow-hidden border border-slate-100">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                              />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-700">
                              {item.name}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {item.quantity} x ${item.price}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-purple-600">
                          ${item.totalPrice}
                        </span>
                      </div>
                    ))}
                    <div className="pt-4 mt-4 border-t border-slate-100 text-right">
                      <Link
                        href="/cart"
                        className="inline-block px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Go to Cart Page
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({
  label,
  value,
  icon,
  bg,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center ${bg}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

const PageHeader = ({
  title,
  breadcrumb,
}: {
  title: string;
  breadcrumb: string;
}) => {
  return (
    <div className="relative w-full h-175 z-0">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-amber-50/50 via-teal-50/30 to-white z-10 mix-blend-multiply" />
        <Image
          src={db.shop.backgroundImage}
          alt="Background"
          fill
          className="object-fill opacity-80"
          priority
        />
        <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-white to-transparent z-20" />
      </div>

      <div className="relative z-10 pt-80 flex flex-col items-center justify-center pb-10">
        <h1 className="text-6xl font-bold text-slate-900 tracking-tight mb-4 capitalize">
          {title}
        </h1>
        <div className="h-1.5 w-20 bg-linear-to-r from-purple-500 to-teal-400 rounded-full mb-10"></div>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
          <Link href="/" className="hover:text-purple-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-900">{breadcrumb}</span>
        </div>
      </div>
    </div>
  );
};

const STATUS_STEPS = [
  { key: "Pending", label: "Order Placed", icon: "📦" },
  { key: "Accepted", label: "Order Accepted", icon: "✅" },
  { key: "Shipped", label: "Shipped", icon: "🚚" },
  { key: "Arrived in Country", label: "Arrived in Country", icon: "🌍" },
  { key: "Arrived in City", label: "Arrived in City", icon: "📍" },
  { key: "Out for Delivery", label: "Out for Delivery", icon: "🏠" },
  { key: "Delivered", label: "Delivered", icon: "🎉" },
];

const OrderTrackingTimeline = ({
  status,
  trackingHistory,
  order,
}: {
  status: string;
  trackingHistory: { status: string; message: string; timestamp: string }[];
  order: Order;
}) => {
  const isCancelled = status === "Cancelled";

  const getStepLabel = (step: any) => {
    if (step.key === "Arrived in Country") {
      return `Arrived in ${order.customer?.country || "Country"}`;
    }
    if (step.key === "Arrived in City") {
      return `Arrived in ${order.customer?.city || "City"}`;
    }
    return step.label;
  };

  const steps = isCancelled
    ? [{ key: "Cancelled", label: "Order Cancelled", icon: "❌" }]
    : STATUS_STEPS;

  const completedKeys = new Set(trackingHistory.map((h) => h.status));
  const currentStatusIdx = STATUS_STEPS.findIndex((s) => s.key === status);

  const formatDate = (ts: string) => {
    try {
      return new Date(ts).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full">
      <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
        <span className="text-xl">📍</span> Tracking Status
      </h3>
      <div className="space-y-0">
        {steps.map((step, idx) => {
          const isCompleted =
            completedKeys.has(step.key) ||
            (currentStatusIdx !== -1 && idx < currentStatusIdx);
          const isCurrent = step.key === status;
          const isLast = idx === steps.length - 1;
          const historyEntry = trackingHistory.find(
            (h) => h.status === step.key,
          );
          const label = getStepLabel(step);

          return (
            <div key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 border-2 transition-all ${
                    isCurrent
                      ? "bg-purple-600 border-purple-600 shadow-lg shadow-purple-200 ring-4 ring-purple-100"
                      : isCompleted
                        ? "bg-emerald-500 border-emerald-500"
                        : "bg-white border-slate-200"
                  }`}
                >
                  {isCompleted ? (
                    <span className="text-white text-xs font-black">✓</span>
                  ) : (
                    <span
                      className={isCurrent ? "text-white" : "text-slate-300"}
                    >
                      {step.icon}
                    </span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 my-1 min-h-[32px] rounded-full ${
                      isCompleted ? "bg-emerald-400" : "bg-slate-100"
                    }`}
                  />
                )}
              </div>
              <div className={`pb-6 ${isLast ? "pb-0" : ""} flex-1 pt-0.5`}>
                <p
                  className={`text-sm font-bold leading-tight ${
                    isCurrent
                      ? "text-purple-700"
                      : isCompleted
                        ? "text-slate-800"
                        : "text-slate-400"
                  }`}
                >
                  {label}
                  {isCurrent && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                      Current
                    </span>
                  )}
                </p>
                {historyEntry && (
                  <div className="mt-1">
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {historyEntry.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {formatDate(historyEntry.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {isCancelled && (
        <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-600 font-medium">
          Your order was cancelled. Contact support for help.
        </div>
      )}
    </div>
  );
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  const colors: { [key: string]: string } = {
    Pending: "bg-yellow-100 text-yellow-700",
    Accepted: "bg-blue-100 text-blue-700",
    Shipped: "bg-indigo-100 text-indigo-700",
    "Arrived in Country": "bg-violet-100 text-violet-700",
    "Arrived in City": "bg-pink-100 text-pink-700",
    "Out for Delivery": "bg-orange-100 text-orange-700",
    Delivered: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
        colors[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
};
