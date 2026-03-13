import React, { useState } from "react";
import { Package, MapPin, Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import WarehouseAssignModal from "../modals/WarehouseAssignModal";

interface WarehouseItem {
  productId: number;
  title: string;
  sku: string;
  stock: number;
}

interface WarehouseData {
  id?: string;
  _id?: string;
  warehouseName: string;
  location: string;
  items: WarehouseItem[];
  totalItemsInWarehouse: number;
}

interface WarehousesTableProps {
  warehouseData: WarehouseData[];
  onRefresh: () => void;
  showToast: (message: string, type: "success" | "error") => void;
  onEdit: (warehouse: WarehouseData) => void;
  onDelete: (warehouse: WarehouseData) => void;
  onCreate: () => void;
}

const getStockBadge = (stockQuantity: number) => {
  if (stockQuantity === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 font-bold text-xs rounded-full ring-1 ring-red-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        Out of Stock
      </span>
    );
  } else if (stockQuantity <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 font-bold text-xs rounded-full ring-1 ring-amber-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Low Stock
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-full ring-1 ring-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        In Stock
      </span>
    );
  }
};

export default function WarehousesTable({
  warehouseData,
  onRefresh,
  showToast,
  onEdit,
  onDelete,
  onCreate,
}: WarehousesTableProps) {
  const [assignModalState, setAssignModalState] = useState<{
    isOpen: boolean;
    warehouseName: string;
    location: string;
  } | null>(null);
  if (!warehouseData || warehouseData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col items-center justify-center p-12">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Package className="text-slate-300" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          No Warehouses Found
        </h3>
        <p className="text-slate-500 text-sm text-center max-w-sm">
          You haven't created any warehouses yet. Add your first storage
          location below.
        </p>
        <button
          onClick={onCreate}
          className="mt-6 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          <Plus size={16} /> Create Warehouse
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-end mb-4">
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          <Plus size={16} /> Create Warehouse
        </button>
      </div>

      {warehouseData.map((warehouse, index) => (
        <div
          key={warehouse._id || warehouse.id || index}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="bg-slate-50 px-4 lg:px-6 py-4 lg:py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base lg:text-lg font-bold text-slate-900 truncate">
                  {warehouse.warehouseName}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs lg:text-sm text-slate-500 font-medium truncate">
                <MapPin size={14} className="shrink-0" />
                <span className="truncate">{warehouse.location}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(warehouse.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 p-1 text-purple-600 hover:bg-purple-50 rounded-md transition-colors inline-flex items-center gap-1 shrink-0"
                  title="View on Google Maps"
                >
                  <ExternalLink size={12} />
                  <span className="text-[10px]">Open Map</span>
                </a>
              </div>
              <button
                onClick={() =>
                  setAssignModalState({
                    isOpen: true,
                    warehouseName: warehouse.warehouseName,
                    location: warehouse.location,
                  })
                }
                className="inline-flex items-center gap-1.5 bg-purple-100/50 hover:bg-purple-100 text-purple-700 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg text-[10px] lg:text-xs font-bold transition-colors mt-2 ring-1 ring-purple-200 whitespace-nowrap"
              >
                <Plus size={12} /> Add Products
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="bg-white px-3 lg:px-4 py-1.5 lg:py-2 border border-slate-200 rounded-xl shadow-sm whitespace-nowrap">
                <span className="text-[10px] lg:text-sm font-bold text-slate-400 mr-2">
                  Inventory:
                </span>
                <span className="text-base lg:text-lg font-extrabold text-purple-600">
                  {warehouse.totalItemsInWarehouse}
                </span>
              </div>
              <div className="flex items-center gap-1 lg:gap-2">
                <button
                  onClick={() => onEdit(warehouse)}
                  className="p-1.5 lg:p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                  title="Edit Warehouse"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDelete(warehouse)}
                  className="p-1.5 lg:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  title="Delete Warehouse"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
          <div className="lg:hidden divide-y divide-slate-100 border-t border-slate-100">
            {warehouse.items.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm italic">
                No products in this warehouse.
              </div>
            ) : (
              warehouse.items.map((item, itemIdx) => (
                <div key={itemIdx} className="p-4 space-y-3 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{item.title}</h4>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">SKU: {item.sku || `PROD-${item.productId}`}</p>
                    </div>
                    {getStockBadge(item.stock)}
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span>Local Stock</span>
                    <span className="text-slate-900">{item.stock} units</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Product Item</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Local Stock</th>
                  <th className="p-4 pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 font-medium divide-y divide-slate-100">
                {warehouse.items.map((item, itemIdx) => (
                  <tr
                    key={itemIdx}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-sm text-slate-900">
                          {item.title}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200">
                        {item.sku || `PROD-${item.productId}`}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-700">
                        {item.stock}
                      </span>
                    </td>
                    <td className="p-4 pr-6">{getStockBadge(item.stock)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {assignModalState?.isOpen && (
        <WarehouseAssignModal
          warehouseName={assignModalState.warehouseName}
          location={assignModalState.location}
          onClose={() => setAssignModalState(null)}
          onSuccess={() => {
            setAssignModalState(null);
            onRefresh();
            showToast(
              "Successfully assigned products to warehouse.",
              "success",
            );
          }}
        />
      )}
    </div>
  );
}
