"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Trash2,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import db from "@/data/db.json";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/Store";
import { removeFromCart, clearCart } from "@/redux/CartSlice";
import { toggleWishlist, clearWishlist } from "@/redux/WishListSlice";
import { logout } from "@/redux/AuthSlice";

function Navbar() {
  const navbarData = db.navbar;
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { cartItems, totalQuantity } = useSelector(
    (state: RootState) => state.cart,
  );
  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist,
  );
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      dispatch(logout());
      dispatch(clearCart());
      dispatch(clearWishlist());
      if (typeof window !== "undefined") {
        localStorage.removeItem("cartState");
        localStorage.removeItem("wishlistItems");
      }
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50 font-sans bg-transparent pl-30 pr-30">
      <div className="container mx-auto px-4 pt-6 pb-4 flex flex-col lg:flex-row items-center justify-between gap-6 relative">
        <Link href="/" className="shrink-0">
          <Image
            src={navbarData.assets.logo.src}
            alt={navbarData.assets.logo.alt}
            width={navbarData.assets.logo.width}
            height={navbarData.assets.logo.height}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex-1 max-w-3xl w-full mx-auto lg:mx-12">
          <div className="relative group">
            <input
              type="text"
              placeholder={navbarData.search.placeholder}
              className="w-full bg-[#F8FAFC] border border-transparent hover:bg-white focus:bg-white text-slate-600 rounded-full py-3.5 px-8 pr-14 outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 shadow-sm"
            />
            <button className="absolute right-1.5 top-1.5 bg-[#FF6B6B] hover:bg-[#ff5252] text-white p-2.5 rounded-full transition-colors shadow-md cursor-pointer">
              <Search className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          <div
            className="relative"
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <Link
              href="/cart"
              className="relative w-11 h-11 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-blue-600 hover:shadow-md transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#3B82F6] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#EBF5FF]">
                  {totalQuantity}
                </span>
              )}
            </Link>
            {isCartOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-50">
                <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-800">
                    My Cart ({mounted ? totalQuantity : 0})
                  </span>
                </div>
                {cartItems.length === 0 ? (
                  <p className="text-center text-slate-400 py-6 text-sm">
                    Your cart is empty
                  </p>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-3 custom-scrollbar">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 items-center group"
                      >
                        <div className="relative w-12 h-12 bg-slate-50 border border-slate-100 rounded-md overflow-hidden shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-blue-500 font-semibold">
                            {item.quantity} x ${item.price}
                          </p>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Link
                    href="/cart"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded-lg transition-colors shadow-lg"
                  >
                    View Cart & Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
          {mounted && isAuthenticated ? (
            <div className="relative group">
              <Link
                href={user?.isAdmin ? "/admin/dashboard" : "/account"}
                className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-blue-600 hover:shadow-md transition-all"
              >
                <User className="w-5 h-5" />
              </Link>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="px-3 py-2 text-xs text-slate-500 font-bold border-b border-slate-100 mb-1">
                  Signed in as <br />
                  <span className="text-slate-800 text-sm">{user?.name}</span>
                </div>
                {user?.isAdmin ? (
                  <>
                    <Link
                      href="/admin/dashboard"
                      className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      href="/account"
                      className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      User Dashboard
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/account"
                    className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    My Account
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors mt-1"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-blue-600 hover:shadow-md transition-all"
            >
              <User className="w-5 h-5" />
            </Link>
          )}
          <div
            className="relative"
            onMouseEnter={() => setIsWishlistOpen(true)}
            onMouseLeave={() => setIsWishlistOpen(false)}
          >
            <Link
              href="/wishlist"
              className="relative w-11 h-11 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-blue-600 hover:shadow-md transition-all"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#EBF5FF]">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            {isWishlistOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-50">
                <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-800">
                    Wishlist ({mounted ? wishlistItems.length : 0})
                  </span>
                </div>
                {wishlistItems.length === 0 ? (
                  <p className="text-center text-slate-400 py-6 text-sm">
                    No favorites yet
                  </p>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-3 custom-scrollbar">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 items-center group"
                      >
                        <div className="relative w-10 h-10 bg-slate-50 border border-slate-100 rounded overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-contain p-0.5"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.price}
                          </p>
                        </div>
                        <button
                          onClick={() => dispatch(toggleWishlist(item))}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <nav>
          <ul className="flex flex-wrap items-center justify-center gap-5 md:gap-10">
            {navbarData.navigation.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="text-[18px] text-[#333333] hover:text-blue-800 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

