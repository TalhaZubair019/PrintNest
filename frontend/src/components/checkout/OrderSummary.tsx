import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface OrderSummaryProps {
  cartItems: any[];
  subtotal: number;
}

export default function OrderSummary({
  cartItems,
  subtotal,
}: OrderSummaryProps) {
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
