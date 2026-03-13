"use client";

import React from "react";
import { Package, Heart, ShoppingCart } from "lucide-react";
import StatCard from "./StatCard";

interface DashboardTabProps {
  user: any;
  ordersCount: number;
  wishlistCount: number;
  cartCount: number;
  setActiveTab: (tab: string) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({
  user,
  ordersCount,
  wishlistCount,
  cartCount,
  setActiveTab,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Orders"
          value={ordersCount.toString()}
          icon={<Package className="text-blue-500" />}
          bg="bg-blue-50"
        />
        <StatCard
          label="Wishlist Items"
          value={wishlistCount.toString()}
          icon={<Heart className="text-pink-500" />}
          bg="bg-pink-50"
        />
        <StatCard
          label="Cart Items"
          value={cartCount.toString()}
          icon={<ShoppingCart className="text-orange-500" />}
          bg="bg-orange-50"
        />
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-4">
          Hello, {user?.name}!
        </h3>
        <p className="text-slate-500">
          From your account dashboard you can view your{" "}
          <button
            onClick={() => setActiveTab("orders")}
            className="text-purple-600 hover:underline"
          >
            recent orders
          </button>
          ,{" "}
          <button
            onClick={() => setActiveTab("cart")}
            className="text-purple-600 hover:underline"
          >
            items in cart
          </button>
          ,{" "}
          <button
            onClick={() => setActiveTab("wishlist")}
            className="text-purple-600 hover:underline"
          >
            items in wishlist
          </button>
          {" and "}edit your{" "}
          <button
            onClick={() => setActiveTab("profile")}
            className="text-purple-600 hover:underline"
          >
            account details
          </button>
          .
        </p>
      </div>
    </div>
  );
};

export default DashboardTab;
