"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setAuthLoaded } from "@/redux/AuthSlice";
import { initializeCart } from "@/redux/CartSlice";
import { initializeWishlist } from "@/redux/WishListSlice";
import { RootState } from "@/redux/Store";

function AuthInitializer() {
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);
  const wishlist = useSelector((state: RootState) => state.wishlist);
  const auth = useSelector((state: RootState) => state.auth);

  const [isLoaded, setIsLoaded] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          dispatch(loginSuccess({ user: data.user, token: "active" }));

          if (data.user.cart && Array.isArray(data.user.cart)) {
            const totalQty = data.user.cart.reduce(
              (acc: number, item: any) => acc + (item.quantity || 1),
              0,
            );
            const totalAmt = data.user.cart.reduce(
              (acc: number, item: any) =>
                acc + item.price * (item.quantity || 1),
              0,
            );

            dispatch(
              initializeCart({
                cartItems: data.user.cart,
                totalQuantity: totalQty,
                totalAmount: totalAmt,
              }),
            );
          }

          if (data.user.wishlist && Array.isArray(data.user.wishlist)) {
            dispatch(initializeWishlist(data.user.wishlist));
          }
        }
      } catch (err) {
        console.error("Session check failed", err);
      } finally {
        setIsLoaded(true);
        dispatch(setAuthLoaded());
      }
    };

    checkSession();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoaded || !auth.isAuthenticated) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const syncData = async () => {
      try {
        await fetch("/api/auth/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: cart.cartItems,
            wishlist: wishlist.items,
          }),
        });
      } catch (error) {
        console.error("Failed to sync data", error);
      }
    };

    const timeoutId = setTimeout(syncData, 1000);
    return () => clearTimeout(timeoutId);
  }, [cart.cartItems, wishlist.items, auth.isAuthenticated, isLoaded]);

  return null;
}

export default AuthInitializer;

