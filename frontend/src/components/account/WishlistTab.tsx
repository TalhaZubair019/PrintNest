"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

interface WishlistTabProps {
  wishlistItems: any[];
  setQuickViewProduct: (product: any) => void;
}

const WishlistTab: React.FC<WishlistTabProps> = ({
  wishlistItems,
  setQuickViewProduct,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-xl font-bold text-slate-900 mb-6">My Wishlist</h3>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Heart size={48} className="mx-auto mb-3 opacity-20" />
          <p>No items in wishlist yet.</p>
          <Link
            href="/shop"
            className="text-purple-600 font-bold hover:underline mt-2 inline-block"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-md transition-all"
            >
              <div className="h-16 w-16 bg-slate-50 rounded-lg relative overflow-hidden shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-purple-600 font-medium text-sm">
                  {item.price}
                </p>
              </div>
              <button
                onClick={() => setQuickViewProduct(item)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-purple-600 transition-colors"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
