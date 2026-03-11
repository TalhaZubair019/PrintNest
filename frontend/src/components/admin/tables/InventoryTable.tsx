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
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Product Info</th>
              <th className="px-4 py-4">SKU</th>
              <th className="px-4 py-4">Total Stock</th>
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
                  badge = <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">🔴 Out of Stock</span>;
                } else if (stock <= threshold) {
                  badge = <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">🟡 Low Stock</span>;
                } else {
                  badge = <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">🟢 In Stock</span>;
                }

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg border overflow-hidden relative bg-white shrink-0">
                          {p.image ? (
                            <Image src={p.image} alt={p.title} fill className="object-contain p-1" unoptimized />
                          ) : (
                            <Package className="w-full h-full p-2 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800 line-clamp-1">{p.title}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">{p.category || "Uncategorized"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-600 font-mono">{p.sku || `PROD-${p.id}`}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
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
        
        <div className="flex items-center justify-between px-8 py-4 border-t bg-slate-50">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
