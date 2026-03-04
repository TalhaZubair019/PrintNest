"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Trash2,
  X,
  LogOut,
  Menu,
} from "lucide-react";
import db from "@data/db.json";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

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
    <header className="absolute top-0 left-0 w-full z-50 font-sans bg-transparent">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 pt-4 sm:pt-6 pb-3 flex items-center justify-between gap-3 relative">
        <Link href="/" className="shrink-0">
          <Image
            src={navbarData.assets.logo.src}
            alt={navbarData.assets.logo.alt}
            width={navbarData.assets.logo.width}
            height={navbarData.assets.logo.height}
            className="h-8 sm:h-10 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden sm:flex flex-1 max-w-3xl mx-4 lg:mx-12">
          <div className="relative group w-full">
            <input
              type="text"
              placeholder={navbarData.search.placeholder}
              className="w-full bg-[#F8FAFC] border border-transparent hover:bg-white focus:bg-white text-slate-600 rounded-full py-3 sm:py-3.5 px-6 sm:px-8 pr-14 outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 shadow-sm text-sm sm:text-base"
            />
            <button className="absolute right-1.5 top-1.5 bg-[#FF6B6B] hover:bg-[#ff5252] text-white p-2 sm:p-2.5 rounded-full transition-colors shadow-md cursor-pointer">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 relative">
          <div
            className="relative"
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <Link
              href="/cart"
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-blue-600 hover:shadow-md transition-all"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {mounted && totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#3B82F6] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#EBF5FF]">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <AnimatePresence>
              {isCartOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-50"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {mounted && isAuthenticated ? (
            <div className="relative group">
              <Link
                href={user?.isAdmin ? "/admin/dashboard" : "/account"}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-blue-600 hover:shadow-md transition-all"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
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
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-blue-600 hover:shadow-md transition-all"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          )}
          <div
            className="relative"
            onMouseEnter={() => setIsWishlistOpen(true)}
            onMouseLeave={() => setIsWishlistOpen(false)}
          >
            <Link
              href="/wishlist"
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-blue-600 hover:shadow-md transition-all"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#EBF5FF]">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <AnimatePresence>
              {isWishlistOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 z-50"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/cart"
            className="relative w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-slate-700"
          >
            <ShoppingCart className="w-4 h-4" />
            {mounted && totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#3B82F6] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {totalQuantity}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-slate-700"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="hidden sm:block container mx-auto px-4 sm:px-8 lg:px-16 py-4">
        <nav>
          <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-8 lg:gap-10">
            {navbarData.navigation.map(
              (item: (typeof navbarData.navigation)[0], index: number) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-[15px] lg:text-[18px] text-[#333333] hover:text-blue-800 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-100 bg-white flex flex-col sm:hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Image
                src={navbarData.assets.logo.src}
                alt={navbarData.assets.logo.alt}
                width={navbarData.assets.logo.width}
                height={navbarData.assets.logo.height}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="relative">
              <input
                type="text"
                placeholder={navbarData.search.placeholder}
                className="w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-full py-3 px-6 pr-14 outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 text-sm"
              />
              <button className="absolute right-1.5 top-1.5 bg-[#FF6B6B] text-white p-2 rounded-full">
                <Search className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 py-6">
            <ul className="space-y-1">
              {navbarData.navigation.map(
                (item: (typeof navbarData.navigation)[0], index: number) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3 px-4 text-lg font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="border-t border-slate-100 px-5 py-5 flex items-center gap-4">
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            {mounted && isAuthenticated ? (
              <>
                <Link
                  href={user?.isAdmin ? "/admin/dashboard" : "/account"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-100 rounded-full"
                >
                  <User className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700 truncate">
                    {user?.name}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full font-medium text-sm"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
