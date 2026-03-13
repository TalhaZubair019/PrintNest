import React, { useState } from "react";
import Image from "next/image";
import { Package, Edit2 } from "lucide-react";

interface InventoryTableProps {
  products: any[];
  onAdjustStock: (product: any) => void;
}

export default function InventoryTable({ products, onAdjustStock }: InventoryTableProps) {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil((products?.length || 0) / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = (products || []).slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Inventory Management</h3>
          <p className="text-sm text-slate-500 mt-1">Track and adjust stock levels across warehouses</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-purple-100">
            {products?.length || 0} Products
          </span>
        </div>
      </div>
      <div className="lg:hidden divide-y divide-slate-100">
        {paginatedProducts.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500 italic">
            No products found.
          </div>
        ) : (
          paginatedProducts.map((p) => {
            const stock = p.stockQuantity || 0;
            const threshold = p.lowStockThreshold || 5;
            
            let statusBadge = null;
            if (stock <= 0) {
              statusBadge = <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold border border-red-100">Out of Stock</span>;
            } else if (stock <= threshold) {
              statusBadge = <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100">Low Stock</span>;
            } else {
              statusBadge = <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100">In Stock</span>;
            }

            return (
              <div key={p.id} className="p-4 space-y-3 hover:bg-slate-50 transition-colors">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl border border-slate-100 overflow-hidden relative bg-white shrink-0">
                    {p.image ? (
                      <Image src={p.image} alt={p.title} fill className="object-contain p-2" unoptimized />
                    ) : (
                      <Package className="w-full h-full p-4 text-slate-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{p.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{p.category || "Uncategorized"}</p>
                    <div className="mt-2 text-[10px] font-mono text-slate-400">
                      SKU: {p.sku || `PROD-${String(p.id).slice(-6).toUpperCase()}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Stock Count</span>
                    <span className="text-sm font-bold text-slate-800">{stock} units</span>
                  </div>
                  {statusBadge}
                </div>

                <button
                  onClick={() => onAdjustStock(p)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all shadow-sm"
                >
                  <Edit2 size={14} /> Adjust Inventory
                </button>
              </div>
            );
          })
        )}
      </div>
      <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Product Info</th>
              <th className="px-8 py-4">SKU</th>
              <th className="px-8 py-4">Total Stock</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-slate-500 italic">
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p) => {
                const stock = p.stockQuantity || 0;
                const threshold = p.lowStockThreshold || 5;
                
                let badge = null;
                if (stock <= 0) {
                  badge = <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">🔴 Out of Stock</span>;
                } else if (stock <= threshold) {
                  badge = <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">🟡 Low Stock</span>;
                } else {
                  badge = <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">🟢 In Stock</span>;
                }

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border overflow-hidden relative bg-white shrink-0">
                          {p.image ? (
                            <Image src={p.image} alt={p.title} fill className="object-contain p-1" unoptimized />
                          ) : (
                            <Package className="w-full h-full p-3 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-800 truncate">{p.title}</p>
                          <p className="text-xs text-slate-500 truncate">{p.category || "Uncategorized"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm text-slate-600 font-mono">{p.sku || `PROD-${p.id}`}</span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-bold text-sm text-slate-800">{stock}</span>
                        {badge}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => onAdjustStock(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-xs font-bold rounded-lg transition-colors border border-slate-200 hover:border-purple-200 shadow-sm"
                      >
                        <Edit2 size={14} /> Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
                <div className="flex items-center justify-between px-4 lg:px-8 py-4 border-t bg-slate-50">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs lg:text-sm text-slate-500 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => p + 1)}
            className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  }
