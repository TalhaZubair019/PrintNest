"use client";
import { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";

function QuickViewModal({ product, onClose, onAddToCart }: any) {
  const [quantity, setQuantity] = useState(1);
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-4xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        <div className="lg:w-1/2 bg-slate-50 p-10 flex items-center justify-center">
          <div className="relative w-full h-64 lg:h-96">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">
            {product.title}
          </h2>
          <p className="text-2xl font-bold text-blue-600 mb-6">
            {product.price}
          </p>
          <p className="text-slate-500 leading-relaxed mb-8">
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas.
          </p>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-slate-500 hover:text-blue-600"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold text-slate-900 w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-slate-500 hover:text-blue-600"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
              className="px-8 py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
