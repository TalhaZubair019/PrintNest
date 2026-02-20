import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <div className="relative overflow-hidden group cursor-pointer">
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl hover:shadow-2xl transition-all duration-500 relative z-10">
      <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer" />
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div
          className={`p-4 rounded-2xl bg-linear-to-br ${color} shadow-lg relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
          <Icon
            size={28}
            className="text-white relative z-10"
            strokeWidth={2}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-4xl font-black bg-linear-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
          {value}
        </h3>
      </div>
    </div>
  </div>
);

export default StatCard;
