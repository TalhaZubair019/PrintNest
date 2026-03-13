"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/redux/AuthSlice";
import { initializeCart } from "@/redux/CartSlice";
import { initializeWishlist } from "@/redux/WishListSlice";
import { Loader2, ChevronRight, Eye, EyeOff } from "lucide-react";
import db from "@data/db.json";
import PageHeader from "@/components/ui/PageHeader";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const dispatch = useDispatch();
  const { cartItems: localCartItems } = useSelector((state: any) => state.cart);

  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        password: savedPassword || prev.password,
      }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", formData.email);
      localStorage.setItem("rememberedPassword", formData.password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (data.user.wishlist && Array.isArray(data.user.wishlist)) {
        dispatch(initializeWishlist(data.user.wishlist));
      } else {
        dispatch(initializeWishlist([]));
      }

      let mergedCart = [...(data.user.cart || [])];

      localCartItems.forEach((localItem: any) => {
        const existingItemIndex = mergedCart.findIndex(
          (item: any) => item.id === localItem.id,
        );
        if (existingItemIndex > -1) {
          mergedCart[existingItemIndex] = {
            ...mergedCart[existingItemIndex],
            quantity:
              mergedCart[existingItemIndex].quantity + localItem.quantity,
          };
        } else {
          mergedCart.push(localItem);
        }
      });

      const totalQty = mergedCart.reduce(
        (acc: number, item: any) => acc + (item.quantity || 1),
        0,
      );
      const totalAmt = mergedCart.reduce(
        (acc: number, item: any) => acc + item.price * (item.quantity || 1),
        0,
      );

      dispatch(
        initializeCart({
          cartItems: mergedCart,
          totalQuantity: totalQty,
          totalAmount: totalAmt,
        }),
      );

      dispatch(loginSuccess({ user: data.user, token: data.token }));

      if (redirect) {
        router.push(redirect);
      } else if (data.user.isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-800">
      <PageHeader title="Login" breadcrumb="Login" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto mt-20 px-4 lg:px-8 pb-32">
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-slate-500 text-center mb-8">
              Sign in to your account
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all pr-12"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white transition-all checked:border-purple-500 checked:bg-purple-500 focus:ring-2 focus:ring-purple-100"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <svg
                      className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                    Remember me
                  </span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-bold text-purple-600 hover:text-purple-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-linear-to-r from-purple-600 to-teal-400 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            <div className="text-center text-sm mt-6">
              <p className="text-slate-600">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-purple-600 hover:text-purple-500 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
