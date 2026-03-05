"use client";
import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Users,
  ClipboardList,
  User as UserIcon,
  LogOut,
  Shield,
  Tag,
} from "lucide-react";

interface AdminSidebarProps {
  user: { name: string; email?: string } | null | any;
  activeTab:
    | "overview"
    | "users"
    | "admins"
    | "orders"
    | "products"
    | "reviews"
    | "categories";
  setActiveTab: React.Dispatch<
    React.SetStateAction<
      | "overview"
      | "users"
      | "admins"
      | "orders"
      | "products"
      | "reviews"
      | "categories"
    >
  >;
  stats: any;
}

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all mb-1 relative group ${
      active
        ? "text-purple-400"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
    }`}
  >
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r" />
    )}
    <span
      className={`${active ? "text-purple-400" : "group-hover:scale-110 transition-transform"}`}
    >
      {React.cloneElement(icon, { size: 20 })}
    </span>
    <span className="truncate transition-opacity duration-300">{label}</span>

    {active && (
      <span className="absolute right-4 w-1.5 h-1.5 bg-purple-400 rounded-full" />
    )}
  </button>
);

const AdminSidebar = ({
  user,
  activeTab,
  setActiveTab,
  stats,
}: AdminSidebarProps) => {
  return (
    <div className="transition-all duration-300 ease-in-out shrink-0 sticky top-6 h-[calc(100vh-48px)] bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 flex-col overflow-hidden scrollbar-hide z-40 w-64 hidden lg:flex">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50 mb-4 h-24">
        <div className="h-10 w-10 min-w-[40px] rounded-full bg-purple-600 border border-purple-500/20 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-600/20">
          {user?.name?.[0]?.toUpperCase() || "A"}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white truncate">
            {user?.name || "Admin User"}
          </p>
          <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">
            Administrator
          </p>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1 scrollbar-hide overflow-y-auto overflow-x-hidden">
        <NavButton
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
          icon={<LayoutDashboard />}
          label="Overview"
        />
        <NavButton
          active={activeTab === "products"}
          onClick={() => setActiveTab("products")}
          icon={<Package />}
          label={`Products (${stats?.products?.length ?? 0})`}
        />
        <NavButton
          active={activeTab === "reviews"}
          onClick={() => setActiveTab("reviews")}
          icon={<MessageSquare />}
          label={`Reviews (${stats?.totalReviews ?? 0})`}
        />
        <NavButton
          active={activeTab === "users"}
          onClick={() => setActiveTab("users")}
          icon={<Users />}
          label={`Users (${stats?.users?.filter((u: any) => !u.isAdmin).length ?? 0})`}
        />
        <NavButton
          active={activeTab === "admins"}
          onClick={() => setActiveTab("admins")}
          icon={<Shield />}
          label={`Admins (${stats?.users?.filter((u: any) => u.isAdmin).length ?? 0})`}
        />
        <NavButton
          active={activeTab === "orders"}
          onClick={() => setActiveTab("orders")}
          icon={<ClipboardList />}
          label={`Orders (${stats?.totalOrders ?? 0})`}
        />
        <NavButton
          active={activeTab === "categories"}
          onClick={() => setActiveTab("categories")}
          icon={<Tag />}
          label={`Categories (${stats?.categories?.length ?? 0})`}
        />
      </nav>
      <div className="p-4 border-t border-slate-800/50 mt-auto">
        <div className="space-y-1">
          <Link
            href="/account"
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors w-full"
            title="Switch to User View"
          >
            <UserIcon size={16} />
            <span>Switch to User View</span>
          </Link>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/api/auth/logout";
              }
            }}
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors w-full"
            title="Logout"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
