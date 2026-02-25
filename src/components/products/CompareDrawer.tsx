"use client";
import { useState } from "react";
import Image from "next/image";
import {
  X,
  Settings,
  ShoppingCart,
  Printer,
  Share2,
  Plus as PlusIcon,
} from "lucide-react";

function CompareDrawer({
  isOpen,
  compareItems,
  allProducts,
  onClose,
  onRemoveItem,
  onAddItem,
  onAddToCart,
}: any) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-60 bg-white animate-in slide-in-from-bottom duration-300 flex flex-col">
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 lg:px-12 bg-white">
        <div className="flex items-center gap-2 text-slate-800 font-bold tracking-widest text-sm uppercase">
          <Settings size={18} />
          <span>Settings</span>
        </div>
        <div className="flex-1 flex justify-around px-12">
          {compareItems.map((item: any) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className="font-bold text-slate-900 uppercase text-xs lg:text-sm">
                {item.title}
              </span>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-xs text-slate-400 underline hover:text-red-500"
              >
                remove
              </button>
            </div>
          ))}
          {[...Array(3 - compareItems.length)].map((_, i) => (
            <div key={i} className="hidden md:block w-32"></div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={24} className="text-slate-500" />
        </button>
      </div>
      <div className="grow overflow-y-auto bg-[#FAFAFA] p-4 lg:p-12">
        <div className="max-w-7xl mx-auto bg-white shadow-sm border border-slate-100 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 border-b border-slate-100 min-h-50">
            <div className="col-span-1 p-6 flex items-center text-slate-500 font-medium">
              Image
            </div>
            {compareItems.map((item: any) => (
              <div
                key={item.id}
                className="col-span-1 p-6 border-l border-slate-100 bg-white flex items-center justify-center"
              >
                <div className="relative w-32 h-32">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
            {[...Array(3 - compareItems.length)].map((_, i) => (
              <div
                key={i}
                className="col-span-1 border-l border-slate-100 bg-slate-50/50"
              ></div>
            ))}
          </div>
          <div className="grid grid-cols-4 border-b border-slate-100 min-h-20">
            <div className="col-span-1 p-6 flex items-center text-slate-500 font-medium">
              Price
            </div>
            {compareItems.map((item: any) => (
              <div
                key={item.id}
                className="col-span-1 p-6 border-l border-slate-100 bg-white flex items-center text-lg font-bold text-slate-900"
              >
                {item.price}
              </div>
            ))}
            {[...Array(3 - compareItems.length)].map((_, i) => (
              <div
                key={i}
                className="col-span-1 border-l border-slate-100 bg-slate-50/50"
              ></div>
            ))}
          </div>
          <div className="grid grid-cols-4 border-b border-slate-100 min-h-25">
            <div className="col-span-1 p-6 flex items-center text-slate-500 font-medium">
              Add to cart
            </div>
            {compareItems.map((item: any) => (
              <div
                key={item.id}
                className="col-span-1 p-6 border-l border-slate-100 bg-white flex items-center"
              >
                <button
                  onClick={() => onAddToCart(item, 1)}
                  className="px-6 py-2 bg-linear-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-full shadow-lg text-sm flex gap-2 items-center"
                >
                  <ShoppingCart size={14} /> Add to cart
                </button>
              </div>
            ))}
            {[...Array(3 - compareItems.length)].map((_, i) => (
              <div
                key={i}
                className="col-span-1 border-l border-slate-100 bg-slate-50/50"
              ></div>
            ))}
          </div>
          <div className="grid grid-cols-4 min-h-37.5">
            <div className="col-span-1 p-6 text-slate-500 font-medium">
              Description
            </div>
            {compareItems.map((item: any) => (
              <div
                key={item.id}
                className="col-span-1 p-6 border-l border-slate-100 text-sm text-slate-600 leading-relaxed"
              >
                Pellentesque habitant morbi tristique senectus et netus et
                malesuada fames ac turpis egestas.
              </div>
            ))}
            {[...Array(3 - compareItems.length)].map((_, i) => (
              <div
                key={i}
                className="col-span-1 border-l border-slate-100 bg-slate-50/50"
              ></div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-20 bg-[#1E293B] flex items-center justify-between px-6 lg:px-12 text-white relative">
        <div className="flex gap-4">
          <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center transition-colors">
            <Printer size={18} />
          </button>
          <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center transition-colors">
            <Share2 size={18} />
          </button>
          <button
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${isPickerOpen ? "bg-blue-500 text-white" : "bg-slate-700 hover:bg-slate-600"}`}
          >
            <PlusIcon size={18} />
          </button>
        </div>
        {isPickerOpen && (
          <div className="absolute bottom-24 left-6 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-2">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wide">
              Add Product
            </div>
            <div className="max-h-60 overflow-y-auto">
              {allProducts
                .filter(
                  (p: any) => !compareItems.find((c: any) => c.id === p.id),
                )
                .map((product: any) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      onAddItem(product);
                      setIsPickerOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div className="relative w-10 h-10 bg-white rounded border border-slate-100">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {product.title}
                      </p>
                      <p className="text-xs text-blue-500">{product.price}</p>
                    </div>
                    <PlusIcon size={14} className="ml-auto text-slate-400" />
                  </button>
                ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-4">
          {compareItems.map((item: any) => (
            <div
              key={item.id}
              className="w-10 h-12 relative bg-white rounded overflow-hidden border border-slate-600"
            >
              <Image
                src={item.image}
                alt="thumb"
                fill
                className="object-cover"
              />
            </div>
          ))}
          <div className="flex items-center h-10 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold rounded overflow-hidden cursor-pointer transition-colors">
            <span className="px-6 flex items-center h-full text-sm">
              COMPARE
            </span>
            <button
              onClick={onClose}
              className="h-full px-3 bg-black/20 hover:bg-black/30 border-l border-white/20"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareDrawer;
