"use client";

import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, bg }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center ${bg}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
