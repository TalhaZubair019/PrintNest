"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishListSlice";
import { RootState } from "@/redux/Store";
import {
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Heart,
  Eye,
} from "lucide-react";
import db from "@/data/db.json";
import Toast from "@/components/products/Toast";
import QuickViewModal from "@/components/products/QuickViewModal";

const pageConfig = {
  title: "Shop",
  backgroundImage: db.shop.backgroundImage,
};

const ITEMS_PER_PAGE = 16;

export default function ShopPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Default Sorting");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({ show: false, message: "", type: "add" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/public/content?section=products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const sortedProducts = useMemo(() => {
    let prods = [...products];

    switch (sortBy) {
      case "Sort By Price: Low To High":
        return products.sort((a, b) => {
          const priceA = parseFloat(String(a.price).replace(/[^0-9.]/g, ""));
          const priceB = parseFloat(String(b.price).replace(/[^0-9.]/g, ""));
          return priceA - priceB;
        });
      case "Sort By Price: High To Low":
        return products.sort((a, b) => {
          const priceA = parseFloat(String(a.price).replace(/[^0-9.]/g, ""));
          const priceB = parseFloat(String(b.price).replace(/[^0-9.]/g, ""));
          return priceB - priceA;
        });
      case "Sort By Latest":
        return prods.sort((a: any, b: any) => b.id - a.id);
      default:
        return prods;
    }
  }, [products, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleAddToCart = (product: any, quantity = 1) => {
    const priceVal =
      typeof product.price === "string"
        ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
        : product.price;

    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        price: priceVal,
        image: product.image,
        quantity: quantity,
      }),
    );
    showToast(`Added ${quantity} x "${product.title}" to cart!`, "add");
  };

  const handleToggleWishlist = (product: any) => {
    const isWishlisted = wishlistItems.some((item) => item.id === product.id);
    dispatch(
      toggleWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      }),
    );
    showToast(
      isWishlisted
        ? `Removed "${product.title}" from wishlist`
        : `Added "${product.title}" to wishlist`,
      isWishlisted ? "remove" : "add",
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-800">
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <div className="absolute top-0 left-0 w-full h-175 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-amber-50/50 via-teal-50/30 to-white z-10 mix-blend-multiply" />
        <Image
          src={pageConfig.backgroundImage}
          alt="Shop Background"
          fill
          className="object-fill opacity-80"
          priority
        />
        <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-white to-transparent z-20" />
      </div>

      <div className="relative z-10 pt-80">
        <ShopHeader currentPage={currentPage} />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-medium tracking-tight">
              Loading premium products...
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto mt-20 px-4 lg:px-8 pb-32">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 px-6 py-3 bg-white rounded-full border border-slate-200 shadow-sm relative z-30">
              <p className="text-sm font-semibold text-slate-500 pl-2">
                Showing {startIndex + 1}–
                {Math.min(startIndex + ITEMS_PER_PAGE, sortedProducts.length)}{" "}
                Of {sortedProducts.length} Results
              </p>

              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-purple-600 transition-colors px-4 py-2"
                >
                  {sortBy} <ChevronDown size={14} />
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-lg shadow-xl overflow-hidden py-1 z-40">
                    {[
                      "Default Sorting",
                      "Sort By Popularity",
                      "Sort By Average Rating",
                      "Sort By Latest",
                      "Sort By Price: Low To High",
                      "Sort By Price: High To Low",
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setIsSortOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-purple-600 transition-colors ${
                          sortBy === option
                            ? "bg-purple-50 text-purple-600"
                            : "text-slate-600"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentProducts.map((product: any) => (
                <SimpleProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistItems.some(
                    (item) => item.id === product.id,
                  )}
                  isInCart={cartItems.some(
                    (item: any) => item.id === product.id,
                  )}
                  onAddToCart={() => handleAddToCart(product)}
                  onToggleWishlist={() => handleToggleWishlist(product)}
                  onQuickView={() => setQuickViewProduct(product)}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-3">
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-purple-100 hover:text-purple-600 transition-all rotate-180"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all shadow-md ${
                        currentPage === page
                          ? "bg-blue-900 text-white hover:bg-blue-800"
                          : "bg-slate-100 text-slate-500 hover:bg-purple-100 hover:text-purple-600"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-purple-100 hover:text-purple-600 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
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

function ShopHeader({ currentPage }: { currentPage: number }) {
  return (
    <div className="w-full pb-10 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-slate-900 tracking-tight mb-4">
        {pageConfig.title}
      </h1>
      <div className="h-1.5 w-20 bg-linear-to-r from-purple-500 to-teal-400 rounded-full mb-10"></div>
      <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
        <Link href="/" className="hover:text-purple-600 transition-colors">
          Home
        </Link>
        <div className="flex text-purple-400">
          <ChevronRight size={14} strokeWidth={2.5} />
          <ChevronRight size={14} className="-ml-2" strokeWidth={2.5} />
        </div>
        <Link href="/shop" className="hover:text-purple-600 transition-colors">
          Shop
        </Link>
        {currentPage > 1 && (
          <>
            <div className="flex text-purple-400">
              <ChevronRight size={14} strokeWidth={2.5} />
              <ChevronRight size={14} className="-ml-2" strokeWidth={2.5} />
            </div>
            <span className="text-slate-900">Page {currentPage}</span>
          </>
        )}
      </div>
    </div>
  );
}

function SimpleProductCard({
  product,
  onAddToCart,
  isInCart,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
}: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showFilled = mounted && isWishlisted;
  const showInCart = mounted && isInCart;

  return (
    <div className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative">
      <button
        onClick={onToggleWishlist}
        className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all duration-300 ${
          showFilled
            ? "bg-red-50 text-red-500"
            : "bg-white text-slate-400 hover:bg-red-50 hover:text-red-500"
        }`}
        title={showFilled ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={18} fill={showFilled ? "currentColor" : "none"} />
      </button>
      <button
        onClick={onQuickView}
        className="absolute top-16 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full shadow-md bg-white text-slate-400 hover:bg-blue-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
        title="Quick View"
      >
        <Eye size={18} />
      </button>

      <div className="relative h-72 bg-[#F6F7FB] flex items-center justify-center p-6 group-hover:bg-[#ebf0f7] transition-colors">
        <Link
          href={`/product/${product.title.toLowerCase().replace(/\s+/g, "-")}`}
          className="relative w-full h-full block"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/5">
          {showInCart ? (
            <>
              <button
                onClick={() => onAddToCart(product)}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#8B5CF6] to-[#2DD4BF] text-white text-xs font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <ShoppingBag size={14} fill="currentColor" />
                Add Again
              </button>
              <Link
                href="/cart"
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#8B5CF6] to-[#2DD4BF] text-white text-xs font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                View cart
              </Link>
            </>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-[#8B5CF6] to-[#2DD4BF] text-white text-sm font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <ShoppingBag size={16} fill="currentColor" />
              Add to cart
            </button>
          )}
        </div>
      </div>

      <Link
        href={`/product/${product.title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <div className="p-4 text-center bg-white cursor-pointer">
          <h3 className="font-bold text-slate-800 text-lg mb-2 truncate group-hover:text-purple-600 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-bold text-blue-900">
              {product.price}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-red-400 line-through">
                {product.oldPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

