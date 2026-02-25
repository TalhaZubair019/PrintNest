import React from "react";
import { DashboardStats } from "@/app/admin/types";

interface CategorySalesChartProps {
  stats: DashboardStats;
}

const CategorySalesChart = ({ stats }: CategorySalesChartProps) => {
  const data = stats.categorySalesData || [];
  const totalValue = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const colors = [
    "#8b5cf6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#6366f1",
  ];

  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-500">
      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
        Sales by Category
        <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-300" />
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-40 h-40">
          <svg viewBox="-1 -1 2 2" className="w-full h-full -rotate-90">
            {data.map((item, i) => {
              const slicePercent = item.value / totalValue;
              const [startX, startY] =
                getCoordinatesForPercent(cumulativePercent);
              cumulativePercent += slicePercent;
              const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
              const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
              const pathData = [
                `M ${startX} ${startY}`,
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L 0 0`,
              ].join(" ");

              return (
                <path
                  key={i}
                  d={pathData}
                  fill={colors[i % colors.length]}
                  className="transition-all duration-500 hover:scale-105 hover:brightness-110 cursor-pointer origin-center"
                />
              );
            })}
            <circle cx="0" cy="0" r="0.65" fill="white" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total
            </span>
            <span className="text-lg font-black text-slate-800">
              ${stats.totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3 w-full">
          {data.slice(0, 5).map((item, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  {item.category || "General"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-800">
                  ${item.value.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 min-w-[45px] text-center">
                  {((item.value / totalValue) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
          {data.length > 5 && (
            <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest pt-2">
              + {data.length - 5} more categories
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySalesChart;
