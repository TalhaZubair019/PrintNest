import React from "react";
import { DashboardStats } from "@/app/admin/types";

interface CategorySalesChartProps {
  stats: DashboardStats;
}

const CategorySalesChart = ({ stats }: CategorySalesChartProps) => {
  const data = stats.categorySalesData || [];
  const totalValue = data.reduce((sum, item) => sum + item.value, 0) || 1;

  const colors = [
    "#a85df6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#6366f1",
  ];

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[32px] shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-8">
        <h3 className="font-bold text-xl text-slate-800 tracking-tight">
          Sales by Category
        </h3>
        <div className="h-2 w-2 bg-purple-500 rounded-full" />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-8">
        <div className="relative w-56 h-56 shrink-0">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full -rotate-90 transform group"
          >
            {data.map((item, i) => {
              const slicePercent = item.value / totalValue;
              const strokeDasharray = `${slicePercent * circumference} ${circumference}`;
              const strokeDashoffset = -currentOffset;
              currentOffset += slicePercent * circumference;

              return (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={colors[i % colors.length]}
                  strokeWidth="15"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-700 ease-in-out hover:opacity-85 cursor-pointer origin-center"
                />
              );
            })}
          </svg>

          {/* Central Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
              Total
            </span>
            <span className="text-2xl font-black text-slate-900 leading-tight">
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>

        {/* Legend Container */}
        <div className="flex-1 w-full space-y-4">
          {data.slice(0, 6).map((item, i) => {
            const percentage = (item.value / totalValue) * 100;
            const categoryColor = colors[i % colors.length];
            return (
              <div key={i} className="flex flex-col gap-2 group">
                <div className="flex items-center justify-between group transition-all">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-sm ring-2 ring-white"
                      style={{ backgroundColor: categoryColor }}
                    />
                    <span className="text-[14px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                      {item.category || "General"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[14px] font-black text-slate-900 tabular-nums">
                      ${item.value.toLocaleString()}
                    </span>
                    <div
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold min-w-[45px] text-center border"
                      style={{
                        backgroundColor: `${categoryColor}10`,
                        borderColor: `${categoryColor}30`,
                        color: categoryColor,
                      }}
                    >
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50 mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: categoryColor,
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100 mt-auto">
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 group hover:border-purple-200 transition-colors">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-purple-500">
            Average Sale
          </p>
          <p className="text-lg font-black text-slate-800 tabular-nums">
            $
            {(totalValue / (data.length || 1)).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 group hover:border-blue-200 transition-colors">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-500">
            Categories
          </p>
          <p className="text-lg font-black text-slate-800 tabular-nums">
            {data.length}{" "}
            <span className="text-[10px] font-bold text-slate-400">Total</span>
          </p>
        </div>
        <div className="hidden md:block bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 group hover:border-emerald-200 transition-colors">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-emerald-500">
            Top Growth
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-lg border border-emerald-100">
              +12%
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              This Month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySalesChart;
