import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye, Heart, Maximize2 } from "lucide-react";
import { useState, useEffect } from "react";

function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onCompare,
  onAddToCart,
}: any) {
  const slug = product.title.toLowerCase().replace(/\s+/g, "-");
  const [isMounted, setIsMounted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const activeWishlist = isMounted && isWishlisted;

  return (
    <Link href={`/product/${slug}`}>
      <div className="relative min-w-70 md:min-w-75 bg-white hover:bg-[#F9FAFF] border border-slate-100 rounded-4xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 snap-center group overflow-hidden">
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out delay-75">
          <button
            onClick={(e) => {
              e.preventDefault();
              onCompare(product);
            }}
            className="w-10 h-10 rounded-full bg-white shadow-md text-slate-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors"
          >
            <Maximize2 size={18} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="w-10 h-10 rounded-full bg-white shadow-md text-slate-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(product.id, product.title);
            }}
            className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all ${
              activeWishlist
                ? "bg-red-500 text-white"
                : "bg-white text-slate-400 hover:bg-blue-500 hover:text-white"
            }`}
          >
            <Heart size={18} fill={activeWishlist ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="mb-4">
          <h4 className="font-bold text-xl text-slate-900 mb-1">
            {product.title}
          </h4>
          <p className="text-sm text-slate-500 font-light">
            {product.printText}
          </p>
        </div>
        <div className="relative h-48 w-full mb-8">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-slate-900">
            {product.price}
          </span>
          {product.badge && (
            <span className="px-4 py-1 rounded-full border border-red-300 text-red-500 text-sm font-semibold bg-white">
              {product.badge}
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (addingToCart) return;
              setAddingToCart(true);
              onAddToCart(product, 1);
              setTimeout(() => setAddingToCart(false), 700);
            }}
            disabled={addingToCart}
            className="w-full h-full bg-linear-to-r from-[#6366F1] to-[#22D3EE] text-white font-bold text-lg flex items-center justify-between px-8 cursor-pointer disabled:opacity-90"
          >
            <span>{addingToCart ? "Adding..." : "Add to cart"}</span>
            {addingToCart ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
