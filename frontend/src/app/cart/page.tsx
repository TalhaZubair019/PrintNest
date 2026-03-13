"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  deleteItem,
  syncCart,
} from "@/redux/CartSlice";
import { ChevronRight, ChevronDown } from "lucide-react";
import db from "@data/db.json";
import Loading from "@/components/ui/Loading";
import AuthPromptModal from "@/components/auth/AuthPromptModal";
import Toast from "@/components/products/Toast";
import PageHeader from "@/components/ui/PageHeader";

const cartData = db.cart;

type CartItemType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CartPage() {
  const { cartItems } = useSelector((state: any) => state.cart);
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const totalAmount = cartItems.reduce(
    (acc: number, item: CartItemType) =>
      acc + item.price * (item.quantity || 1),
    0,
  );
  const [isClient, setIsClient] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({
    show: false,
    message: "",
    type: "add",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const validateCart = async () => {
      if (cartItems.length === 0) return;

      const productIds = cartItems.map((item: CartItemType) => item.id);
      try {
        const response = await fetch("/api/public/validate-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds }),
        });

        if (response.ok) {
          const validProducts = await response.json();
          let stockAdjusted = false;
          const outOfStockItems: string[] = [];
          const limitedStockItems: string[] = [];

          for (const cartItem of cartItems) {
            const dbRef = validProducts.find(
              (vp: any) => String(vp.id) === String(cartItem.id),
            );

            if (!dbRef || dbRef.stockQuantity <= 0) {
              outOfStockItems.push(cartItem.name);
              stockAdjusted = true;
            } else if (dbRef.stockQuantity < cartItem.quantity) {
              limitedStockItems.push(cartItem.name);
              stockAdjusted = true;
            }
          }

          if (stockAdjusted) {
            let msg = "";
            if (outOfStockItems.length > 0) {
              msg += `"${outOfStockItems.join(", ")}" is out of stock and has been removed. `;
            }
            if (limitedStockItems.length > 0) {
              msg += `Quantity for "${limitedStockItems.join(", ")}" was adjusted based on available stock.`;
            }

            setToast({
              show: true,
              message: msg.trim(),
              type: "remove",
            });
            setTimeout(
              () => setToast((prev) => ({ ...prev, show: false })),
              6000,
            );
          }

          dispatch(syncCart(validProducts));
        }
      } catch (error) {
        console.error("Failed to validate cart:", error);
      }
    };

    if (isClient && cartItems.length > 0) {
      validateCart();
      const interval = setInterval(validateCart, 30000);
      return () => clearInterval(interval);
    }
  }, [isClient, dispatch]);

  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-800">
      {showAuthModal && (
        <AuthPromptModal
          onClose={() => setShowAuthModal(false)}
          redirectUrl="/checkout"
        />
      )}
      <PageHeader
        title={cartData.breadcrumbs.current}
        breadcrumb={cartData.breadcrumbs.current}
        backgroundImage={cartData.backgroundImage}
      />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto mt-30 px-4 lg:px-8 pb-32">
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-8">
                <div className="flex justify-between border-b border-slate-200 pb-4 mb-8">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {cartData.columns.product}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {cartData.columns.total}
                  </span>
                </div>
                <div className="space-y-12">
                  {cartItems.map((item: CartItemType) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4">
                <CartSummary
                  totalAmount={totalAmount}
                  onCheckout={handleCheckoutClick}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}


function EmptyCart() {
  return (
    <div className="text-center py-32 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
      <h2 className="text-2xl font-bold text-slate-400 mb-6">
        {cartData.emptyState.message}
      </h2>
      <Link
        href={cartData.emptyState.redirectUrl}
        className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
      >
        {cartData.emptyState.buttonText}
      </Link>
    </div>
  );
}

function CartItem({ item }: { item: CartItemType }) {
  const dispatch = useDispatch();
  const subTotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className="group">
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="relative w-32 h-40 bg-white border border-slate-100 rounded-xl overflow-hidden shrink-0 shadow-sm">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-contain p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
              {cartData.placeholders.noImageText}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">
                {cartData.placeholders.category}
              </h3>
              <p className="font-bold text-slate-900 text-lg mb-1">
                {item.name}
              </p>
              <span className="text-slate-500 font-medium text-sm block mb-3">
                ${item.price.toFixed(2)}
              </span>
            </div>
            <span className="font-bold text-slate-900 text-lg sm:hidden">
              ${subTotal}
            </span>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-lg hidden sm:block">
            {cartData.placeholders.description}
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-auto">
            <div className="flex items-center border border-slate-300 rounded overflow-hidden w-28 bg-white">
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold text-lg transition-colors border-r border-slate-200"
              >
                -
              </button>
              <span className="flex-1 text-center font-semibold text-slate-700 text-sm py-1">
                {item.quantity}
              </span>
              <button
                onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 font-bold text-lg transition-colors border-l border-slate-200"
              >
                +
              </button>
            </div>
            <button
              onClick={() => dispatch(deleteItem(item.id))}
              className="text-xs font-bold text-slate-400 border-b border-slate-300 pb-0.5 hover:text-red-500 hover:border-red-300 transition-all"
            >
              Remove all item
            </button>
          </div>
        </div>
        <div className="hidden sm:block text-right min-w-20 pt-1">
          <span className="font-bold text-slate-900 text-lg">${subTotal}</span>
        </div>
      </div>
      <div className="h-px w-full bg-slate-100 mt-10"></div>
    </div>
  );
}
function CartSummary({
  totalAmount,
  onCheckout,
}: {
  totalAmount: number;
  onCheckout: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="bg-white pl-0 lg:pl-8">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-200 pb-4">
        {cartData.summary.title}
      </h3>
      <div className="mb-10">
        <label className="block text-sm font-semibold text-slate-800 mb-3">
          {cartData.summary.couponLabel}
        </label>
        <div className="relative border-b border-slate-200 hover:border-slate-400 transition-colors">
          <select className="w-full appearance-none bg-transparent py-3 pr-8 text-slate-500 focus:outline-none cursor-pointer text-sm font-medium">
            <option>{cartData.summary.couponPlaceholder}</option>
            {cartData.summary.coupons.map((coupon) => (
              <option key={coupon.code} value={coupon.code}>
                {coupon.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-0 top-3 text-slate-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>
      <div className="flex justify-between items-center mb-8 pb-8 border-b border-slate-100">
        <span className="text-lg font-bold text-slate-900">
          {cartData.summary.totalLabel}
        </span>
        <span className="text-xl font-bold text-slate-900">
          ${totalAmount.toFixed(2)}
        </span>
      </div>
      <Link
        href={cartData.summary.checkoutUrl}
        onClick={onCheckout}
        className="block w-full text-center py-4 rounded-full bg-linear-to-r from-[#8B5CF6] to-[#2DD4BF] text-white font-bold text-lg shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
      >
        {cartData.summary.checkoutButtonText}
      </Link>
    </div>
  );
}
