import React from "react";
import { Order, DashboardStats } from "@/app/admin/types";

interface OrderStatusChartProps {
  stats: DashboardStats;
}

const OrderStatusChart = ({ stats }: OrderStatusChartProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-500">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        Order Status Distribution
        <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-300" />
      </h3>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
          {(() => {
            const pending = stats.recentOrders.filter(
              (o) => o.status === "Pending",
            ).length;
            const accepted = stats.recentOrders.filter(
              (o) => o.status === "Accepted",
            ).length;
            const completed = stats.recentOrders.filter(
              (o) => o.status === "Completed",
            ).length;
            const cancelled = stats.recentOrders.filter(
              (o) => o.status === "Cancelled",
            ).length;
            const total = pending + accepted + completed + cancelled || 1;
            const CIRC = 502.4;
            const pPending = (pending / total) * CIRC;
            const pAccepted = (accepted / total) * CIRC;
            const pCompleted = (completed / total) * CIRC;
            const pCancelled = (cancelled / total) * CIRC;
            return (
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="40"
                />
                {pending > 0 && (
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="40"
                    strokeDasharray={`${pPending} ${CIRC}`}
                    strokeDashoffset="0"
                  />
                )}
                {accepted > 0 && (
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="40"
                    strokeDasharray={`${pAccepted} ${CIRC}`}
                    strokeDashoffset={`-${pPending}`}
                  />
                )}
                {completed > 0 && (
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="40"
                    strokeDasharray={`${pCompleted} ${CIRC}`}
                    strokeDashoffset={`-${pPending + pAccepted}`}
                  />
                )}
                {cancelled > 0 && (
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="40"
                    strokeDasharray={`${pCancelled} ${CIRC}`}
                    strokeDashoffset={`-${pPending + pAccepted + pCompleted}`}
                  />
                )}
              </svg>
            );
          })()}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalOrders}
              </p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-slate-600">
              Pending (
              {stats.recentOrders.filter((o) => o.status === "Pending").length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-600">
              Accepted (
              {stats.recentOrders.filter((o) => o.status === "Accepted").length}
              )
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">
              Completed (
              {
                stats.recentOrders.filter((o) => o.status === "Completed")
                  .length
              }
              )
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-600">
              Cancelled (
              {
                stats.recentOrders.filter((o) => o.status === "Cancelled")
                  .length
              }
              )
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusChart;
