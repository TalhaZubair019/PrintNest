import React from "react";
import { Clock, Package, CheckCircle, X, LucideIcon } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles: Record<
    string,
    { bg: string; text: string; border: string; icon: LucideIcon | null }
  > = {
    Pending: {
      bg: "bg-linear-to-r from-amber-100 to-orange-100",
      text: "text-amber-700",
      border: "border-amber-300",
      icon: Clock,
    },
    Accepted: {
      bg: "bg-linear-to-r from-blue-100 to-cyan-100",
      text: "text-blue-700",
      border: "border-blue-300",
      icon: Package,
    },
    Completed: {
      bg: "bg-linear-to-r from-emerald-100 to-green-100",
      text: "text-emerald-700",
      border: "border-emerald-300",
      icon: CheckCircle,
    },
    Cancelled: {
      bg: "bg-linear-to-r from-rose-100 to-red-100",
      text: "text-rose-700",
      border: "border-rose-300",
      icon: X,
    },
  };

  const config = styles[status] || {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    icon: null,
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${config.bg} ${config.text} ${config.border}`}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
