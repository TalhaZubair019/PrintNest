"use client";

import { Provider } from "react-redux";
import { store } from "@/app/redux/Store";
import { useEffect } from "react";
import { initializeCart } from "@/app/redux/CartSlice";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedCart = localStorage.getItem("cartState");
    if (savedCart) {
      try {
        store.dispatch(initializeCart(JSON.parse(savedCart)));
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
