import React from "react";
import { Wallet, Banknote } from "lucide-react";

interface PaymentOptionProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

function PaymentOption({
  id,
  label,
  icon,
  description,
  isSelected,
  onSelect,
}: PaymentOptionProps) {
  return (
    <div
      onClick={onSelect}
      className={`border rounded-xl p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
            isSelected ? "border-blue-600" : "border-slate-400"
          }`}
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

interface PaymentSectionProps {
  data: any;
  update: (data: any) => void;
}

export default function PaymentSection({ data, update }: PaymentSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-700 mb-4">Payment options</h2>
      <div className="space-y-3">
        <PaymentOption
          id="paypal"
          label="PayPal"
          icon={<Wallet className="text-slate-600" size={20} />}
          description="Pay securely using your PayPal account."
          isSelected={data.paymentMethod === "paypal"}
          onSelect={() => update({ paymentMethod: "paypal" })}
        />
        <PaymentOption
          id="stripe"
          label="Credit / Debit Card (International)"
          icon={<Wallet className="text-slate-600" size={20} />}
          description="Pay securely using your international credit or debit card."
          isSelected={data.paymentMethod === "stripe"}
          onSelect={() => update({ paymentMethod: "stripe" })}
        />

        <PaymentOption
          id="cod"
          label="Cash on Delivery"
          icon={<Banknote className="text-slate-600" size={20} />}
          description="Pay with cash upon delivery."
          isSelected={data.paymentMethod === "cod"}
          onSelect={() => update({ paymentMethod: "cod" })}
        />
      </div>
    </section>
  );
}
