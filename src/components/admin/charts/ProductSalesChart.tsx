import React from "react";
import { DashboardStats } from "@/app/admin/types";

interface ProductSalesChartProps {
  stats: DashboardStats;
}

const ProductSalesChart = ({ stats }: ProductSalesChartProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-500">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        Product Sales Performance
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-300" />
      </h3>
      <div className="space-y-4">
        {stats.topProducts.length > 0 ? (
          stats.topProducts.slice(0, 5).map((product: any, i: number) => {
            const maxSales = Math.max(
              ...stats.topProducts.map((p: any) => p.quantity || 0),
            );
            const percentage =
              maxSales > 0 ? (product.quantity / maxSales) * 100 : 0;
            return (
              <div key={i} className="space-y-2 group">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 truncate group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </span>
                  <span className="font-bold text-purple-600 group-hover:scale-110 transition-transform">
                    {product.quantity} sold
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-linear-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out group-hover:from-purple-600 group-hover:to-blue-600 shadow-sm"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-4">
            No sales data available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductSalesChart;
