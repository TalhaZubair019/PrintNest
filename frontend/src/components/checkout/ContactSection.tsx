import React from "react";

interface ContactSectionProps {
  email: string;
  update: (data: any) => void;
  isReadOnly: boolean;
}

export default function ContactSection({
  email,
  update,
  isReadOnly,
}: ContactSectionProps) {
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
        className={`w-full border border-slate-300 rounded-md px-4 py-3 text-slate-700 focus:outline-none focus:border-blue-500 placeholder:text-slate-400 ${
          isReadOnly ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""
        }`}
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
