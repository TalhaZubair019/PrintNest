"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronDown, ShoppingBag, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishListSlice";
import { RootState } from "@/redux/Store";
import Toast from "@/components/products/Toast";
import db from "@/data/db.json";

interface Category {
  id: number;
  title: string;
  image: string;
  link: string;
}

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  badge?: string | null;
  printText?: string;
  oldPrice?: string | null;
  category?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({ show: false, message: "", type: "add" });

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoriesSource = db.categories.categories;
        const foundCategory = categoriesSource.find(
          (cat: Category) =>
            cat.title.toLowerCase().replace(/\s+/g, "-") === slug,
        );

        setCategory(foundCategory || null);

        if (foundCategory) {
          const response = await fetch("/api/public/content?section=products");
          if (response.ok) {
            const data = await response.json();
            const allProducts: Product[] = data.products || [];
            const keyword = foundCategory.title.toLowerCase().replace(/s$/, "");

            let filtered = allProducts.filter((product) =>
              product.title.toLowerCase().includes(keyword),
            );
            if (filtered.length === 0) {
              filtered = allProducts.slice(0, 4);
            }

            setCategoryProducts(filtered);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryData();
    }
  }, [slug]);

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleAddToCart = (product: Product) => {
    const priceVal = parseFloat(product.price.replace(/[^0-9.]/g, ""));

    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        price: priceVal,
        image: product.image,
        quantity: 1,
      }),
    );
    showToast(`Added "${product.title}" to cart!`, "add");
  };

  const handleToggleWishlist = (product: Product) => {
    const isWishlisted = wishlistItems.some((item) => item.id === product.id);
    const priceVal = parseFloat(product.price.replace(/[^0-9.]/g, ""));

    dispatch(
      toggleWishlist({
        id: product.id,
        title: product.title,
        price: priceVal,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-slate-800 font-bold text-xl">
          Category not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-32">
      <div className="w-full flex flex-col items-center justify-center pt-100 pb-16 px-4 relative">
        <div className="absolute inset-0 bg-linear-to-b from-amber-50/50 via-teal-50/30 to-white z-10 mix-blend-multiply" />
        <div className="absolute top-0 left-0 w-full h-150 z-0 pointer-events-none">
          <Image
            src={db.categories.backgroundImage}
            alt="Background"
            fill
            className="object-cover opacity-80"
            priority
          />
        </div>

        <div className="relative z-20 flex flex-col items-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 text-center">
            Category: {category.title}
          </h1>
          <div className="relative group">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-50/50 px-6 py-2 rounded-md">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                {db.categories.breadcrumbs.home}
              </Link>
              <div className="flex text-blue-400">
                <ChevronRight size={12} strokeWidth={2.5} />
                <ChevronRight size={12} className="-ml-1.5" strokeWidth={2.5} />
              </div>
              <Link
                href="/shop"
                className="hover:text-blue-600 transition-colors"
              >
                {db.categories.breadcrumbs.current}
              </Link>
              <div className="flex text-blue-400">
                <ChevronRight size={12} strokeWidth={2.5} />
                <ChevronRight size={12} className="-ml-1.5" strokeWidth={2.5} />
              </div>
              <span className="text-slate-900">{category.title}</span>
            </div>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-linear-to-r from-blue-500 via-purple-500 to-teal-400"></div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 rounded-full px-8 py-4 mt-12 mb-12 shadow-sm">
          <p className="text-slate-500 font-medium text-sm mb-2 sm:mb-0">
            Showing {categoryProducts.length} Results
          </p>

          <div className="relative">
            <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-full text-sm font-semibold focus:outline-none focus:border-blue-400 cursor-pointer">
              <option>Default Sorting</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-3 text-slate-500 pointer-events-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoryProducts.map((product) => (
            <SimpleProductCard
              key={product.id}
              product={product}
              isInCart={cartItems.some((item: any) => item.id === product.id)}
              onAddToCart={() => handleAddToCart(product)}
              isWishlisted={wishlistItems.some(
                (item) => item.id === product.id,
              )}
              onToggleWishlist={() => handleToggleWishlist(product)}
            />
          ))}

          {categoryProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="text-lg">No products found for {category.title}.</p>
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
function SimpleProductCard({
  product,
  onAddToCart,
  isInCart,
  isWishlisted,
  onToggleWishlist,
}: {
  product: Product;
  onAddToCart: () => void;
  isInCart: boolean;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  return (
    <div className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative">
      {product.badge && (
        <span
          className={`absolute top-4 left-4 z-20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-sm ${
            product.badge === "New" ? "bg-blue-500" : "bg-red-500"
          }`}
        >
          {product.badge}
        </span>
      )}

      <button
        onClick={onToggleWishlist}
        className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all duration-300 ${
          isWishlisted
            ? "bg-red-50 text-red-500"
            : "bg-white text-slate-400 hover:bg-red-50 hover:text-red-500"
        }`}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      <div className="relative h-72 bg-[#F6F7FB] flex items-center justify-center p-6 group-hover:bg-[#ebf0f7] transition-colors">
        <div className="relative w-full h-full">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              No Image
            </div>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/5">
          {isInCart ? (
            <>
              <button
                onClick={onAddToCart}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#8B5CF6] to-[#2DD4BF] text-white text-xs font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                <ShoppingBag size={14} fill="currentColor" />
                Add Again
              </button>
              <Link
                href="/cart"
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#8B5CF6] to-[#2DD4BF] text-white text-xs font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                View cart
              </Link>
            </>
          ) : (
            <button
              onClick={onAddToCart}
              className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-[#8B5CF6] to-[#2DD4BF] text-white text-sm font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <ShoppingBag size={16} fill="currentColor" />
              Add to cart
            </button>
          )}
        </div>
      </div>

      <div className="p-4 text-center bg-white">
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
    </div>
  );
}
