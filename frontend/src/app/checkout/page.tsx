"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, syncCart } from "@/redux/CartSlice";
import AuthPromptModal from "@/components/auth/AuthPromptModal";
import Toast from "@/components/products/Toast";

import {
  ChevronLeft,
} from "lucide-react";
import db from "@data/db.json";
import { Country, State, City } from "country-state-city";

import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import ContactSection from "@/components/checkout/ContactSection";
import BillingSection from "@/components/checkout/BillingSection";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummary from "@/components/checkout/OrderSummary";

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
  country: string;
  countryCode: string;
  stateCode: string;
  paymentMethod: "cod" | "stripe" | "paypal";
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const hasSynced = useRef(false);
  const { cartItems } = useSelector((state: any) => state.cart);
  const { isAuthenticated, user, isLoading } = useSelector(
    (state: any) => state.auth,
  );
  const [hasMounted, setHasMounted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUsingSavedAddress, setIsUsingSavedAddress] = useState(false);
  const [isViewingSavedAddress, setIsViewingSavedAddress] = useState(false);
  const [copyProfileAddress, setCopyProfileAddress] = useState(false);


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
    country: "Pakistan",
    countryCode: "PK",
    stateCode: "",
    paymentMethod: "cod",
  });

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    if (formData.countryCode) {
      const countryStates = State.getStatesOfCountry(formData.countryCode);
      setStates(countryStates);

      if (formData.stateCode) {
        setCities(
          City.getCitiesOfState(formData.countryCode, formData.stateCode),
        );
      }
    }
  }, [formData.countryCode, formData.stateCode]);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({
    show: false,
    message: "",
    type: "add",
  });

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    setHasMounted(true);
    const savedForm = localStorage.getItem("checkoutFormData");
    if (savedForm) {
      try {
        setFormData((prev) => ({ ...prev, ...JSON.parse(savedForm) }));
      } catch (e) {
        console.error("Could not parse saved form data", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!hasMounted || hasSynced.current || cartItems.length === 0) return;

    const checkAndSyncCart = async () => {
      try {
        const response = await fetch("/api/public/content?section=products");
        if (response.ok) {
          const data = await response.json();
          if (data && data.products) {
            hasSynced.current = true;
            const activeProductIds = data.products.map((p: any) =>
              String(p.id),
            );
            const removedItems = cartItems.filter(
              (item: any) => !activeProductIds.includes(String(item.id)),
            );

            if (removedItems.length > 0) {
              dispatch(syncCart(data.products));
              showToast(
                `${removedItems.length} item(s) were removed from your cart as they are no longer available.`,
                "remove",
              );
            } else {
              dispatch(syncCart(data.products));
            }
          }
        }
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    };

    checkAndSyncCart();
  }, [hasMounted, cartItems.length]);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("checkoutFormData", JSON.stringify(formData));
    }
  }, [formData, hasMounted]);

  useEffect(() => {
    if (user) {
      const hasSavedAddress = !!(user.address && user.city);
      setIsUsingSavedAddress(hasSavedAddress);

      if (hasSavedAddress) {
        setFormData((prev) => ({
          ...prev,
          email: user.email || prev.email || "",
          firstName: user.name?.split(" ")[0] || prev.firstName || "",
          lastName: user.name?.split(" ")[1] || prev.lastName || "",
          phone: user.phone || prev.phone || "",
          address: user.address || "",
          city: user.city || "",
          province: user.province || "",
          country: user.country || "Pakistan",
          countryCode: user.countryCode || "PK",
          stateCode: user.stateCode || "",
          postcode: user.postcode || "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          email: user.email || prev.email || "",
          firstName: prev.firstName || user.name?.split(" ")[0] || "",
          lastName: prev.lastName || user.name?.split(" ")[1] || "",
        }));
      }
    }
  }, [user]);

  const handleAddressModeChange = (useSaved: boolean) => {
    setIsUsingSavedAddress(useSaved);
    setIsViewingSavedAddress(false);
    if (useSaved && user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.name?.split(" ")[0] || prev.firstName,
        lastName: user.name?.split(" ")[1] || prev.lastName,
        phone: user.phone || prev.phone,
        address: user.address || "",
        city: user.city || "",
        province: user.province || "",
        country: user.country || "Pakistan",
        countryCode: user.countryCode || "PK",
        stateCode: user.stateCode || "",
        postcode: user.postcode || "",
      }));
    } else {
      if (!copyProfileAddress) {
        setFormData((prev) => ({
          ...prev,
          address: "",
          apartment: "",
          city: "",
          province: "",
          country: "Pakistan",
          countryCode: "PK",
          stateCode: "",
          postcode: "",
          phone: "",
        }));
      }
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, isLoading]);

  const updateData = (newData: Partial<CheckoutData>) =>
    setFormData((prev) => ({ ...prev, ...newData }));

  const saveOrderToDB = async (paymentStatus: string) => {
    const payload = {
      customer: formData,
      items: cartItems,
      totalAmount: subtotal,
      paymentStatus,
    };
    const response = await fetch("/api/public/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("API request failed");
    return await response.json();
  };

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


      if (formData.paymentMethod === "stripe") {
        localStorage.setItem("pendingCheckoutData", JSON.stringify(formData));
        const orderId = Date.now().toString();

        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            customerEmail: formData.email,
            orderId: orderId,
          }),
        });
        const session = await response.json();
        if (session.url) {
          window.location.href = session.url;
          return;
        }
        throw new Error(session.error || "Failed to initialize Stripe");
      }

      if (formData.paymentMethod === "paypal") {
        localStorage.setItem("pendingCheckoutData", JSON.stringify(formData));
        const orderId = Date.now().toString();

        const response = await fetch("/api/paypal/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalAmount: subtotal,
            customer: formData,
            orderId: orderId,
          }),
        });
        const session = await response.json();
        if (session.url) {
          window.location.href = session.url;
          return;
        }
        throw new Error(session.error || "Failed to initialize PayPal");
      }

      if (formData.paymentMethod === "cod") {
        await saveOrderToDB("Pending");
        localStorage.removeItem("pendingCheckoutData");
        dispatch(clearCart());
        router.push("/thank-you");
      }
    } catch (error) {
      alert("Error: Could not process checkout. Please try again.");
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
            className={`transition-all duration-300 ${
              hasMounted && (showAuthModal || isLoading)
                ? "opacity-50 blur-sm pointer-events-none"
                : "opacity-100"
            }`}
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
                <BillingSection
                  data={formData}
                  update={updateData}
                  user={user}
                  isAuthenticated={isAuthenticated}
                  isUsingSavedAddress={isUsingSavedAddress}
                  isViewingSavedAddress={isViewingSavedAddress}
                  setIsViewingSavedAddress={setIsViewingSavedAddress}
                  onAddressModeChange={handleAddressModeChange}
                  copyProfileAddress={copyProfileAddress}
                  setCopyProfileAddress={setCopyProfileAddress}
                  countries={countries}
                  states={states}
                  cities={cities}
                  hasMounted={hasMounted}
                />
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
        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </div>
    </div>
  );
}


