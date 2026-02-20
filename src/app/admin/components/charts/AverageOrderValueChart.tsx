import React from "react";
import { DashboardStats } from "@/app/admin/types";

interface AverageOrderValueChartProps {
  stats: DashboardStats;
}

const AverageOrderValueChart = ({ stats }: AverageOrderValueChartProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-500">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        Average Order Value Trend
        <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-300" />
      </h3>
      <div className="h-48 flex flex-col justify-between">
        <div className="flex-1 relative">
          <svg
            className="w-full h-full"
            viewBox="0 0 300 150"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="aovGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {(() => {
              const aovData = stats.revenueData.map((d: any) => {
                const ordersOnDay =
                  stats.recentOrders.filter(
                    (o: any) =>
                      new Date(o.date).toDateString() ===
                      new Date(d.date).toDateString(),
                  ).length || 1;
                return {
                  value: d.revenue / ordersOnDay,
                  date: d.date,
                };
              });
              const maxAOV = Math.max(...aovData.map((d) => d.value)) || 100;
              const points = aovData
                .map((d, i) => {
                  const x = (i / (aovData.length - 1)) * 300;
                  const y = 150 - (d.value / maxAOV) * 140;
                  return `${x},${y}`;
                })
                .join(" ");
              const areaPoints = `0,150 ${points} 300,150`;
              return (
                <>
                  <polyline
                    points={areaPoints}
                    fill="url(#aovGradient)"
                    stroke="none"
                  />
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-lg"
                  />
                  {aovData.map((d, i) => {
                    const x = (i / (aovData.length - 1)) * 300;
                    const y = 150 - (d.value / maxAOV) * 140;
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#f59e0b"
                          className="hover:r-6 transition-all cursor-pointer"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="8"
                          fill="white"
                          fillOpacity="0.3"
                          className="opacity-0 hover:opacity-100 transition-opacity"
                        />
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>
        </div>
        <div className="grid grid-cols-7 gap-1 mt-4">
          {stats.revenueData.map((d: any, i: number) => (
            <div key={i} className="text-center">
              <span className="text-xs text-slate-500 font-medium">
                {
                  new Date(d.date).toLocaleDateString(undefined, {
                    weekday: "short",
                  })[0]
                }
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium">Min AOV</p>
            <p className="text-sm font-bold text-amber-600">
              $
              {Math.min(
                ...stats.revenueData.map((d: any) => {
                  const orders =
                    stats.recentOrders.filter(
                      (o: any) =>
                        new Date(o.date).toDateString() ===
                        new Date(d.date).toDateString(),
                    ).length || 1;
                  return d.revenue / orders;
                }),
              ).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium">Avg AOV</p>
            <p className="text-sm font-bold text-amber-600">
              ${(stats.totalRevenue / stats.totalOrders).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium">Max AOV</p>
            <p className="text-sm font-bold text-amber-600">
              $
              {Math.max(
                ...stats.revenueData.map((d: any) => {
                  const orders =
                    stats.recentOrders.filter(
                      (o: any) =>
                        new Date(o.date).toDateString() ===
                        new Date(d.date).toDateString(),
                    ).length || 1;
                  return d.revenue / orders;
                }),
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AverageOrderValueChart;
