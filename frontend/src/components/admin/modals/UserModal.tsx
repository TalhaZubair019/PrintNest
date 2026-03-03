import React from "react";
import Image from "next/image";
import { X, ShoppingCart, Heart, Package } from "lucide-react";
import { UserData } from "@/app/admin/types";

interface UserModalProps {
  selectedUser: UserData | null;
  onClose: () => void;
  viewType: "cart" | "wishlist" | "both";
}

const UserModal = ({ selectedUser, onClose, viewType }: UserModalProps) => {
  if (!selectedUser) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="p-5 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {selectedUser.name}&apos;s{" "}
              {viewType === "cart" ? "Cart" : "Wishlist"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedUser.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          {(viewType === "cart"
            ? selectedUser.cart
            : selectedUser.wishlist
          )?.map((item: any, i: number) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all group"
            >
              <div className="w-14 h-14 bg-white rounded-xl border border-slate-100 shrink-0 relative overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name || item.title || ""}
                    fill
                    className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-200"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={18} className="text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {item.name || item.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {viewType === "cart" && `Qty: ${item.quantity} × `}
                  {item.price}
                </p>
              </div>
              {viewType === "cart" && (
                <p className="font-bold text-sm text-purple-600 shrink-0">
                  {item.totalPrice}
                </p>
              )}
            </div>
          ))}
          {(viewType === "cart" ? selectedUser.cart : selectedUser.wishlist)
            ?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              {viewType === "cart" ? (
                <ShoppingCart size={36} className="mb-2 text-slate-200" />
              ) : (
                <Heart size={36} className="mb-2 text-slate-200" />
              )}
              <p className="text-sm italic">No items found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;
