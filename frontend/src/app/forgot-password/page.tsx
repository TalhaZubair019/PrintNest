"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  ChevronRight,
  ArrowLeft,
  Mail,
  CheckCircle2,
} from "lucide-react";
import db from "@data/db.json";
import PageHeader from "@/components/ui/PageHeader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset link");

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-800">
      <PageHeader
        title="Reset Password"
        breadcrumbs={[
          { label: "Login", href: "/login" },
          { label: "Forgot Password" },
        ]}
      />
      <div className="relative z-10">

        <div className="max-w-7xl mx-auto mt-20 px-4 lg:px-8 pb-32">
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            {!submitted ? (
              <>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
                  Forgot Password?
                </h2>
                <p className="text-slate-500 text-center mb-8">
                  Enter your email address and we'll send you a link to reset
                  your password.
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
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full border border-slate-300 rounded-lg pl-11 pr-4 py-3 text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-lg bg-linear-to-r from-purple-600 to-teal-400 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-teal-500" size={48} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Check your email
                </h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  If an account exists for{" "}
                  <span className="font-bold text-slate-700">{email}</span>, you
                  will receive a password reset link shortly.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500 text-left mb-8 flex gap-3">
                  <div className="shrink-0 pt-0.5">💡</div>
                  <p>
                    Don't forget to check your spam folder if you don't see the
                    email within a few minutes.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-purple-600 font-bold hover:text-purple-500 transition-colors"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
              <Link
                href="/login"
                className="flex items-center gap-2 text-slate-600 font-bold hover:text-slate-900 transition-all group"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
