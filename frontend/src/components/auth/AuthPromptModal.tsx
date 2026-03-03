"use client";
import React from "react";
import Link from "next/link";
import { X, LogIn, UserPlus } from "lucide-react";

interface AuthPromptModalProps {
  onClose: () => void;
  redirectUrl?: string;
}

const AuthPromptModal = ({ onClose, redirectUrl }: AuthPromptModalProps) => {
  const loginUrl = redirectUrl
    ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
    : "/login";
  const signupUrl = redirectUrl
    ? `/signup?redirect=${encodeURIComponent(redirectUrl)}`
    : "/signup";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn size={32} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Account Required
          </h2>
          <p className="text-slate-500 mb-8">
            Please login or create an account to complete your purchase and
            track your order.
          </p>

          <div className="space-y-3">
            <Link
              href={loginUrl}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-linear-to-r from-purple-600 to-blue-500 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <LogIn size={18} />
              Login
            </Link>

            <Link
              href={signupUrl}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <UserPlus size={18} />
              Create Account
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              onClick={onClose}
              className="text-sm text-slate-400 hover:text-slate-600 font-medium"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
