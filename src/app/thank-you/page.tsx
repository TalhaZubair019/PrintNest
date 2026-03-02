"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux/CartSlice";

export default function ThankYouPage() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: any) => state.cart);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processPendingOrder = async () => {
      try {
        const pendingDataStr = localStorage.getItem("pendingCheckoutData");

        if (pendingDataStr && cartItems.length > 0) {
          const customerData = JSON.parse(pendingDataStr);

          const subtotal = cartItems.reduce(
            (acc: number, item: any) => acc + item.price * (item.quantity || 1),
            0,
          );

          // Call the API to actually save the order and send the email
          const response = await fetch("/api/public/place-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer: customerData,
              items: cartItems,
              totalAmount: subtotal,
              paymentStatus: "Completed", // Or "Pending" depending on webhook verification later
            }),
          });

          if (response.ok) {
            // Clear the temporary data and the cart
            localStorage.removeItem("pendingCheckoutData");
            dispatch(clearCart());
          }
        }
      } catch (error) {
        console.error(
          "Error processing pending order on Thank You page",
          error,
        );
      } finally {
        setIsProcessing(false);
      }
    };

    processPendingOrder();
  }, [cartItems, dispatch]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 mt-50 font-sans">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-slate-100 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-slate-800">
            Finalizing Your Order...
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Please wait while we complete your purchase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 mt-50 font-sans">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Order Placed!
        </h1>
        <p className="text-slate-500 mb-8">
          Thank you for your purchase. We have received your order and sent a
          confirmation email to your inbox.
        </p>
        <div className="bg-slate-50 rounded-lg p-4 mb-8 text-sm text-slate-600 border border-slate-100">
          <p>
            Your order is being processed. You will receive another email once
            it ships.
          </p>
        </div>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-blue-200"
          >
            Continue Shopping
          </Link>

          <Link
            href="/contact"
            className="block w-full text-slate-500 hover:text-slate-800 font-medium py-2 text-sm transition-colors"
          >
            Need help? Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
