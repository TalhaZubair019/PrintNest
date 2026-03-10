"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
} from "lucide-react";
import db from "@data/db.json";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Reset token is missing. Please request a new link.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: formData.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-teal-500" size={48} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Password Reset!
        </h2>
        <p className="text-slate-500 mb-8">
          Your password has been successfully updated. Redirecting you to the
          login page...
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3 bg-linear-to-r from-purple-600 to-teal-400 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          Go to Login Now
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100 italic">
          {error}
        </div>
      )}

      {!token && (
        <div className="text-amber-600 text-sm text-center bg-amber-50 p-3 rounded-lg border border-amber-100 mb-4 font-medium">
          Invalid or missing reset token. Please request another link.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            disabled={!token}
            className="w-full border border-slate-300 rounded-lg pl-11 pr-12 py-3 text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium disabled:bg-slate-50 disabled:cursor-not-allowed"
            placeholder="Min 6 characters"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
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

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            disabled={!token}
            className="w-full border border-slate-300 rounded-lg pl-11 pr-4 py-3 text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium disabled:bg-slate-50 disabled:cursor-not-allowed"
            placeholder="Repeat your new password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !token}
        className="w-full py-3.5 rounded-lg bg-linear-to-r from-purple-600 to-teal-400 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2 mt-8"
      >
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          "Update Password"
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-800">
      <div className="absolute top-0 left-0 w-full h-175 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-purple-50/50 via-teal-50/30 to-white z-10 mix-blend-multiply" />
        <Image
          src={db.shop.backgroundImage}
          alt="Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-white to-transparent z-20" />
      </div>

      <div className="relative z-10 pt-80">
        <div className="w-full pb-10 flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold text-slate-900 tracking-tight mb-4">
            Security
          </h1>
          <div className="h-1.5 w-20 bg-linear-to-r from-purple-500 to-teal-400 rounded-full mb-10"></div>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <div className="flex text-purple-400">
              <ChevronRight size={14} strokeWidth={2.5} />
              <ChevronRight size={14} className="-ml-2" strokeWidth={2.5} />
            </div>
            <Link
              href="/login"
              className="hover:text-purple-600 transition-colors"
            >
              Login
            </Link>
            <div className="flex text-purple-400">
              <ChevronRight size={14} strokeWidth={2.5} />
              <ChevronRight size={14} className="-ml-2" strokeWidth={2.5} />
            </div>
            <span className="text-slate-900">Reset Password</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 px-4 lg:px-8 pb-32">
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
              New Password
            </h2>
            <p className="text-slate-500 text-center mb-8">
              Please enter and confirm your new password below.
            </p>

            <Suspense
              fallback={
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-purple-500" />
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-bold text-purple-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
