"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/redux/CartSlice";
import AuthPromptModal from "@/components/auth/AuthPromptModal";

import {
  ChevronRight,
  ChevronDown,
  CreditCard,
  Banknote,
  ChevronLeft,
  X,
} from "lucide-react";
import db from "@/data/db.json";
const checkoutConfig = db.checkout;

interface CheckoutData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  province: string;
  postcode: string;
  phone: string;
  paymentMethod: "cod" | "bank";
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { cartItems } = useSelector((state: any) => state.cart);
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const [hasMounted, setHasMounted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce(
    (acc: number, item: any) => acc + item.price * (item.quantity || 1),
    0,
  );
  const [formData, setFormData] = useState<CheckoutData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    province: "",
    postcode: "",
    phone: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
      if (!isAuthenticated) {
        setShowAuthModal(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const updateData = (newData: Partial<CheckoutData>) =>
    setFormData((prev) => ({ ...prev, ...newData }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current?.checkValidity()) {
      const firstInvalid = formRef.current?.querySelector(
        ":invalid",
      ) as HTMLElement;
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: formData,
        items: cartItems,
        totalAmount: subtotal,
      };
      const response = await fetch("/api/public/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        dispatch(clearCart());
        router.push("/thank-you");
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      alert("Error: Could not place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-800">
      {showAuthModal && (
        <AuthPromptModal
          onClose={() => {
            router.push("/cart");
          }}
        />
      )}
      <div className="absolute top-0 left-0 w-full h-175 z-0 pointer-events-none">
        <Image
          src={checkoutConfig.backgroundImage}
          alt="Hero Background"
          fill
          className="object-fill opacity-100"
          priority
        />
        <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-white to-transparent" />
      </div>

      <div className="relative z-10 pt-40">
        <CheckoutHeader />
        <div className="max-w-7xl mx-auto mt-30 px-4 lg:px-8 pb-32">
          <div
            className={`transition-all duration-300 ${showAuthModal || isCheckingAuth ? "opacity-50 blur-sm pointer-events-none" : "opacity-100"}`}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
            >
              <div className="lg:col-span-7 space-y-10">
                <ContactSection
                  email={formData.email}
                  update={updateData}
                  isReadOnly={hasMounted && !!user?.email}
                />
                <BillingSection data={formData} update={updateData} />
                <PaymentSection data={formData} update={updateData} />
                <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 text-slate-600 font-bold hover:text-slate-900 transition-colors"
                  >
                    <ChevronLeft size={16} /> Return to Cart
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto px-10 py-4 rounded-full bg-linear-to-r from-[#8B5CF6] to-[#2DD4BF] text-white font-bold text-lg shadow-lg shadow-purple-200 transition-all duration-300 ${
                      isSubmitting
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </div>
              <div className="lg:col-span-5">
                {hasMounted ? (
                  <OrderSummary cartItems={cartItems} subtotal={subtotal} />
                ) : (
                  <div className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8 animate-pulse">
                    <div className="h-6 w-32 bg-slate-100 rounded mb-6" />
                    <div className="space-y-6">
                      <div className="h-16 bg-slate-50 rounded" />
                      <div className="h-16 bg-slate-50 rounded" />
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutHeader() {
  return (
    <div className="w-full pb-20 mt-50 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-slate-900 tracking-tight mb-4">
        Checkout
      </h1>
      <div className="h-1.5 w-20 bg-linear-to-r from-purple-500 to-teal-400 rounded-full mb-10"></div>
      <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          {checkoutConfig.breadcrumbs.home}
        </Link>
        <div className="flex text-blue-400">
          <ChevronRight size={14} strokeWidth={2.5} />
          <ChevronRight size={14} className="-ml-2" strokeWidth={2.5} />
        </div>
        <span className="text-slate-900">
          {checkoutConfig.breadcrumbs.current}
        </span>
      </div>
    </div>
  );
}

function ContactSection({ email, update, isReadOnly }: any) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-700 mb-4">
        Contact information
      </h2>
      <input
        type="email"
        required
        readOnly={isReadOnly}
        placeholder="Email address"
        className={`w-full border border-slate-300 rounded-md px-4 py-3 text-slate-700 focus:outline-none focus:border-blue-500 placeholder:text-slate-400 ${isReadOnly ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""}`}
        value={email}
        onChange={(e) => update({ email: e.target.value })}
      />
      {!isReadOnly && (
        <p className="text-xs text-slate-500 mt-2">
          You are currently checking out as a guest
        </p>
      )}
    </section>
  );
}

function BillingSection({ data, update }: any) {
  const InputClass =
    "w-full border border-slate-300 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 text-slate-700 placeholder:text-slate-400";
  const LabelClass =
    "text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block";
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-700 mb-4">Billing address</h2>
      <div className="space-y-4">
        <div className="relative">
          <label className={LabelClass}>
            Country / Region <span className="text-red-500">*</span>
          </label>
          <select
            className={`${InputClass} appearance-none bg-slate-50 cursor-pointer`}
          >
            <option value="PK">Pakistan</option>
          </select>
          <ChevronDown
            className="absolute right-4 top-9 text-slate-400 pointer-events-none"
            size={16}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LabelClass}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className={InputClass}
              value={data.firstName}
              onChange={(e) => update({ firstName: e.target.value })}
            />
          </div>
          <div>
            <label className={LabelClass}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className={InputClass}
              value={data.lastName}
              onChange={(e) => update({ lastName: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={LabelClass}>
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="House number and street name"
            className={`${InputClass} mb-3`}
            value={data.address}
            onChange={(e) => update({ address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Apartment, suite, unit, etc. (optional)"
            className={InputClass}
            value={data.apartment}
            onChange={(e) => update({ apartment: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={LabelClass}>
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className={InputClass}
              value={data.city}
              onChange={(e) => update({ city: e.target.value })}
            />
          </div>
          <div className="relative">
            <label className={LabelClass}>
              Province <span className="text-red-500">*</span>
            </label>
            <select
              required
              className={`${InputClass} appearance-none bg-transparent cursor-pointer`}
              value={data.province}
              onChange={(e) => update({ province: e.target.value })}
            >
              <option value="">Select...</option>
              {checkoutConfig.provinces.map((p: any) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-9 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>
          <div>
            <label className={LabelClass}>
              Postcode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className={InputClass}
              value={data.postcode}
              onChange={(e) => update({ postcode: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={LabelClass}>
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            className={InputClass}
            value={data.phone}
            onChange={(e) => update({ phone: e.target.value })}
          />
        </div>
      </div>
    </section>
  );
}

function OrderSummary({ cartItems, subtotal }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8 shadow-sm sticky top-40">
      <h3 className="text-lg font-bold text-slate-700 mb-6">Order summary</h3>
      <div className="space-y-6 mb-6">
        {cartItems.map((item: any) => (
          <div key={item.id} className="flex gap-4 items-start">
            <div className="relative w-16 h-16 border border-slate-200 rounded bg-slate-50 shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                  No Img
                </div>
              )}
              <span className="absolute -top-2 -right-2 bg-slate-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-700 text-sm">
                  {item.name}
                </h4>
                <span className="text-sm font-medium text-slate-600">
                  ${(item.price * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="py-4 border-t border-b border-slate-100 mb-4">
        <div className="flex justify-between items-center cursor-pointer group">
          <span className="text-sm text-slate-500 group-hover:text-blue-600 transition-colors">
            Add coupon
          </span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-medium text-slate-900">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Shipping</span>
          <span className="font-medium text-slate-900">Free</span>
        </div>
        <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-slate-100 mt-4">
          <span className="text-slate-800">Total</span>
          <span className="text-slate-900">${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function PaymentSection({
  data,
  update,
}: {
  data: CheckoutData;
  update: (d: Partial<CheckoutData>) => void;
}) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-700 mb-4">Payment options</h2>
      <div className="space-y-3">
        <PaymentOption
          id="cod"
          label="Cash on Delivery"
          icon={<Banknote className="text-slate-600" size={20} />}
          description="Pay with cash upon delivery."
          isSelected={data.paymentMethod === "cod"}
          onSelect={() => update({ paymentMethod: "cod" })}
        />
        <PaymentOption
          id="bank"
          label="Direct Bank Transfer"
          icon={<CreditCard className="text-slate-600" size={20} />}
          description="Make your payment directly into our bank account."
          isSelected={data.paymentMethod === "bank"}
          onSelect={() => update({ paymentMethod: "bank" })}
        />
      </div>
    </section>
  );
}

function PaymentOption({
  id,
  label,
  icon,
  description,
  isSelected,
  onSelect,
}: any) {
  return (
    <div
      onClick={onSelect}
      className={`border rounded-xl p-4 cursor-pointer transition-all ${isSelected ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500" : "border-slate-200 hover:border-slate-300"}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-blue-600" : "border-slate-400"}`}
        >
          {isSelected && (
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
          )}
        </div>
        {icon}
        <span className="font-bold text-slate-800">{label}</span>
      </div>
      {isSelected && (
        <div className="mt-3 ml-8 text-sm text-slate-500 animate-in fade-in slide-in-from-top-1">
          {description}
        </div>
      )}
    </div>
  );
}

