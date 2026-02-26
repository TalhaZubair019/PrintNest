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
} from "lucide-react";
import { UserData } from "@/app/admin/types";

interface AdminSidebarProps {
  user: { name: string; email?: string } | null | any;
  activeTab:
    | "overview"
    | "users"
    | "admins"
    | "orders"
    | "products"
    | "reviews";
  setActiveTab: React.Dispatch<
    React.SetStateAction<
      "overview" | "users" | "admins" | "orders" | "products" | "reviews"
    >
  >;
  stats: any;
}

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all mb-1 relative overflow-hidden group ${
      active
        ? "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-300/50"
        : "text-slate-600 hover:bg-linear-to-r hover:from-slate-50 hover:to-purple-50/30"
    }`}
  >
    {!active && (
      <span className="absolute inset-0 bg-linear-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    )}
    <span
      className={active ? "" : "group-hover:scale-110 transition-transform"}
    >
      {icon}
    </span>
    <span className="relative z-10">{label}</span>
    {active && (
      <span className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />
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
    <div className="lg:w-1/4 shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-slate-900 line-clamp-1">
              {user?.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">Administrator</p>
          </div>
        </div>
        <nav className="p-2">
          <NavButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={<LayoutDashboard size={18} />}
            label="Overview"
          />
          <NavButton
            active={activeTab === "products"}
            onClick={() => setActiveTab("products")}
            icon={<Package size={18} />}
            label={`Products (${stats.products.length})`}
          />
          <NavButton
            active={activeTab === "reviews"}
            onClick={() => setActiveTab("reviews")}
            icon={<MessageSquare size={18} />}
            label={`Reviews (${stats.totalReviews})`}
          />
          <NavButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            icon={<Users size={18} />}
            label={`Users (${stats.users?.filter((u: any) => !u.isAdmin).length ?? 0})`}
          />
          <NavButton
            active={activeTab === "admins"}
            onClick={() => setActiveTab("admins")}
            icon={<Shield size={18} />}
            label={`Admins (${stats.users?.filter((u: any) => u.isAdmin).length ?? 0})`}
          />
          <NavButton
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
            icon={<ClipboardList size={18} />}
            label={`Orders (${stats.totalOrders})`}
          />
          <Link
            href="/account"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl mb-1 transition-colors"
          >
            <UserIcon size={18} /> Switch to User View
          </Link>
          <Link
            href="/api/auth/logout"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl mt-2 transition-colors"
          >
            <LogOut size={18} /> Logout
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
