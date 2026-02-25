"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { toggleWishlist, WishlistItem } from "@/redux/WishListSlice";
import { ChevronRight, ShoppingCart, Trash2 } from "lucide-react";
import db from "@/data/db.json";
import Toast from "@/components/products/Toast";
import Loading from "@/components/ui/Loading";
const pageConfig = {
  backgroundImage: db.cart.backgroundImage,
  breadcrumbs: {
    home: "Home",
    current: "Wishlist",
  },
  columns: {
    product: "Product Name",
    price: "Unit Price",
    status: "Stock Status",
    action: "Action",
  },
  emptyState: {
    message: "Your wishlist is currently empty.",
    buttonText: "Return to Shop",
    redirectUrl: "/shop",
  },
};

export default function WishlistPage() {
  const wishlistItems = useSelector((state: any) => state.wishlist.items);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({
    show: false,
    message: "",
    type: "add",
  });

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-800">
      <div className="absolute top-0 left-0 w-full h-175 z-0 pointer-events-none">
        <Image
          src={pageConfig.backgroundImage}
          alt="Hero Background"
          fill
          className="object-fill opacity-100"
          priority
        />
        <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-white to-transparent" />
      </div>

      <div className="relative z-10 pt-40">
        <WishlistHeader />

        <div className="max-w-7xl mx-auto mt-30 px-4 lg:px-8 pb-32">
          {wishlistItems.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <div className="grid grid-cols-1 gap-16 items-start">
              <div className="w-full">
                <div className="hidden md:flex justify-between border-b border-slate-200 pb-4 mb-8">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest w-1/2">
                    {pageConfig.columns.product}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest w-1/6">
                    {pageConfig.columns.price}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest w-1/6">
                    {pageConfig.columns.status}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest w-1/6 text-right">
                    {pageConfig.columns.action}
                  </span>
                </div>
                <div className="space-y-12">
                  {wishlistItems.map((item: WishlistItem) => (
                    <WishlistItemComponent
                      key={item.id}
                      item={item}
                      onToast={showToast}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

function WishlistHeader() {
  return (
    <div className="w-full pb-20 mt-50 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-slate-900 tracking-tight mb-4">
        {pageConfig.breadcrumbs.current}
      </h1>
      <div className="h-1.5 w-20 bg-linear-to-r from-purple-500 to-teal-400 rounded-full mb-10"></div>
      <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          {pageConfig.breadcrumbs.home}
        </Link>
        <div className="flex text-blue-400">
          <ChevronRight size={14} strokeWidth={2.5} />
          <ChevronRight size={14} className="-ml-2" strokeWidth={2.5} />
        </div>
        <span className="text-slate-900">{pageConfig.breadcrumbs.current}</span>
      </div>
    </div>
  );
}

function EmptyWishlist() {
  return (
    <div className="text-center py-32 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
      <h2 className="text-2xl font-bold text-slate-400 mb-6">
        {pageConfig.emptyState.message}
      </h2>
      <Link
        href={pageConfig.emptyState.redirectUrl}
        className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
      >
        {pageConfig.emptyState.buttonText}
      </Link>
    </div>
  );
}

function WishlistItemComponent({
  item,
  onToast,
}: {
  item: WishlistItem;
  onToast: (msg: string, type: "add" | "remove") => void;
}) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const priceVal =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
        : item.price;

    dispatch(
      addToCart({
        id: item.id.toString(),
        name: item.title,
        price: priceVal,
        image: item.image,
        quantity: 1,
      }),
    );
    onToast(`Added "${item.title}" to cart successfully!`, "add");
  };

  const handleRemove = () => {
    dispatch(toggleWishlist(item));
    onToast(`Removed "${item.title}" from wishlist.`, "remove");
  };

  return (
    <div className="group">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex items-center gap-6 w-full md:w-1/2">
          <div className="relative w-24 h-24 bg-white border border-slate-100 rounded-xl overflow-hidden shrink-0 shadow-sm">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain p-2"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                No Img
              </div>
            )}
          </div>
          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">
              Product
            </h3>
            <p className="font-bold text-slate-900 text-lg">{item.title}</p>
          </div>
        </div>
        <div className="w-full md:w-1/6 flex justify-between md:block">
          <span className="md:hidden text-slate-500 font-medium">Price: </span>
          <span className="text-slate-900 font-bold text-lg">
            $
            {typeof item.price === "number"
              ? item.price.toFixed(2)
              : item.price}
          </span>
        </div>
        <div className="w-full md:w-1/6 flex justify-between md:block">
          <span className="md:hidden text-slate-500 font-medium">Status: </span>
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
            In Stock
          </span>
        </div>
        <div className="w-full md:w-1/6 flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            <ShoppingCart size={16} />
            <span className="hidden lg:inline">Add to Cart</span>
          </button>

          <button
            onClick={handleRemove}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
            title="Remove from wishlist"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="h-px w-full bg-slate-100 mt-8"></div>
    </div>
  );
}

