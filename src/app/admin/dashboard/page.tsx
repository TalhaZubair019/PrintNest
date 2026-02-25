"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/Store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  ShoppingBag,
  DollarSign,
  ChevronRight,
  Search,
  X,
  CheckCircle,
} from "lucide-react";
import AdminReviewList from "../components/tables/AdminReviewList";
import db from "@/app/data/db.json";
import { DashboardStats, UserData, Order } from "@/app/admin/types";
import StatCard from "../components/ui/StatCard";
import RevenueChart from "../components/charts/RevenueChart";
import OrderStatusChart from "../components/charts/OrderStatusChart";
import AverageOrderValueChart from "../components/charts/AverageOrderValueChart";
import ReviewRatingChart from "../components/charts/ReviewRatingChart";
import SentimentChart from "../components/charts/SentimentChart";
import ProductSalesChart from "../components/charts/ProductSalesChart";
import CategorySalesChart from "../components/charts/CategorySalesChart";
import OrderVelocityChart from "../components/charts/OrderVelocityChart";
import TopSellingProducts from "../components/lists/TopSellingProducts";
import TopReviewedProducts from "../components/lists/TopReviewedProducts";
import ProductsTable from "../components/tables/ProductsTable";
import UsersTable from "../components/tables/UsersTable";
import OrdersTable from "../components/tables/OrdersTable";
import ProductModal from "../components/modals/ProductModal";
import UserModal from "../components/modals/UserModal";
import OrderModal from "../components/modals/OrderModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import AdminSidebar from "../components/layout/AdminSidebar";

const PageHeader = ({ title, breadcrumb }: any) => (
  <div className="relative w-full h-175 z-0">
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div className="absolute inset-0 bg-linear-to-b from-amber-50/50 via-teal-50/30 to-white z-10 mix-blend-multiply" />
      <Image
        src={db.shop.backgroundImage}
        alt="Background"
        fill
        className="object-fill opacity-80"
        priority
        unoptimized
      />
      <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-white to-transparent z-20" />
    </div>

    <div className="relative z-10 pt-80 flex flex-col items-center justify-center pb-10">
      <h1 className="text-6xl font-bold text-slate-900 tracking-tight mb-4 capitalize">
        {title}
      </h1>
      <div className="h-1.5 w-20 bg-linear-to-r from-purple-500 to-teal-400 rounded-full mb-10"></div>
      <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
        <Link href="/" className="hover:text-purple-600 transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-900">{breadcrumb}</span>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "orders" | "products" | "reviews"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewType, setViewType] = useState<"cart" | "wishlist" | "both">(
    "both",
  );
  const ITEMS_PER_PAGE = 5;
  const [userPage, setUserPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    oldPrice: "",
    image: "",
    badge: "",
  });
  const [productDeleteConfirm, setProductDeleteConfirm] = useState<any>(null);
  const [orderDeleteConfirm, setOrderDeleteConfirm] = useState<Order | null>(
    null,
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [revenueFilter, setRevenueFilter] = useState<
    "week" | "month" | "current-month" | "custom"
  >("week");
  const [showRevenueDropdown, setShowRevenueDropdown] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [filteredRevenueData, setFilteredRevenueData] = useState<any[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user && !user.isAdmin) {
      router.push("/account");
      return;
    }
    if (user?.isAdmin) {
      fetchStats();
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    const contentArea = document.getElementById("admin-content-area");
    if (contentArea) {
      contentArea.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setFilteredRevenueData(data.revenueData);
      }
    } catch (error) {
      console.error("Failed to fetch admin stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueData = async (startDate: string, endDate: string) => {
    setRevenueLoading(true);
    try {
      const res = await fetch(
        `/api/admin/stats?startDate=${startDate}&endDate=${endDate}`,
      );
      if (res.ok) {
        const data = await res.json();
        setFilteredRevenueData(data.revenueData);
      }
    } catch (error) {
      console.error("Failed to fetch revenue data");
    } finally {
      setRevenueLoading(false);
    }
  };

  const applyRevenueFilter = (
    filter: "week" | "month" | "current-month" | "custom",
    start?: string,
    end?: string,
  ) => {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    if (filter === "week") {
      const s = new Date(today);
      s.setDate(s.getDate() - 6);
      fetchRevenueData(fmt(s), fmt(today));
    } else if (filter === "month") {
      const s = new Date(today);
      s.setDate(s.getDate() - 29);
      fetchRevenueData(fmt(s), fmt(today));
    } else if (filter === "current-month") {
      const s = new Date(today.getFullYear(), today.getMonth(), 1);
      fetchRevenueData(fmt(s), fmt(today));
    } else if (filter === "custom" && start && end) {
      fetchRevenueData(start, end);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchStats();
        setDeleteConfirm(null);
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      alert("Error deleting user");
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchStats();
        showToast(
          `Order status updated to "${newStatus}". Customer has been notified via email.`,
          "success",
        );
      } else {
        showToast("Failed to update order status.", "error");
      }
    } catch (error) {
      showToast("Error updating status.", "error");
    }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: "",
      price: "",
      oldPrice: "",
      image: "",
      badge: "",
    });
    setIsProductModalOpen(true);
  };
  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title || "",
      price: product.price?.toString().replace("$", "") || "",
      oldPrice: product.oldPrice?.toString().replace("$", "") || "",
      image: product.image || "",
      badge: product.badge || "",
    });
    setIsProductModalOpen(true);
  };
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newProductData = {
      title: productForm.title,
      price: `$${parseFloat(productForm.price).toFixed(2)}`,
      oldPrice: productForm.oldPrice
        ? `$${parseFloat(productForm.oldPrice).toFixed(2)}`
        : null,
      image: productForm.image,
      badge: productForm.badge || null,
      printText: "We print with",
    };
    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : `/api/admin/products`;
      const res = await fetch(url, {
        method: editingProduct ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProductData),
      });
      if (res.ok) {
        await fetchStats();
        setIsProductModalOpen(false);
      } else {
        alert("Failed to save product");
      }
    } catch (error) {
      alert("Error saving product");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchStats();
        setProductDeleteConfirm(null);
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      alert("Error deleting product");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchStats();
        setOrderDeleteConfirm(null);
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      alert("Error deleting order");
    }
  };

  const filteredUsers = stats?.users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const paginatedUsers = filteredUsers?.slice(
    (userPage - 1) * ITEMS_PER_PAGE,
    userPage * ITEMS_PER_PAGE,
  );
  const totalUserPages =
    Math.ceil((filteredUsers?.length || 0) / ITEMS_PER_PAGE) || 1;

  const filteredOrders = stats?.recentOrders.filter(
    (o) =>
      o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.status?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const paginatedOrders = filteredOrders?.slice(
    (orderPage - 1) * ITEMS_PER_PAGE,
    orderPage * ITEMS_PER_PAGE,
  );
  const totalOrderPages =
    Math.ceil((filteredOrders?.length || 0) / ITEMS_PER_PAGE) || 1;

  const filteredProducts = stats?.products.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const paginatedProducts = filteredProducts?.slice(
    (productPage - 1) * ITEMS_PER_PAGE,
    productPage * ITEMS_PER_PAGE,
  );
  const totalProductPages =
    Math.ceil((filteredProducts?.length || 0) / ITEMS_PER_PAGE) || 1;

  const filteredReviews = stats?.reviews.filter(
    (r) =>
      r.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isAuthLoading || loading || !stats) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/20 to-slate-50 font-sans">
        <PageHeader title="Admin Panel" breadcrumb="Dashboard" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-32 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/20 to-slate-50 font-sans text-slate-800">
      <PageHeader title="Admin Panel" breadcrumb="Dashboard" />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            stats={stats}
          />

          <div id="admin-content-area" className="lg:flex-1">
            {["users", "orders", "products", "reviews"].includes(activeTab) && (
              <div className="mb-6">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition duration-300" />
                  <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 group-focus-within:border-purple-400 transition-all duration-300">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors duration-300"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder={`Search ${activeTab}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-transparent rounded-xl focus:outline-none text-slate-800 placeholder:text-slate-400"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <X size={16} className="text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "overview" && (
              <div
                key="overview"
                className="space-y-6 animate-in fade-in duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="text-purple-600 bg-purple-600"
                  />
                  <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    color="text-blue-600 bg-blue-600"
                  />
                  <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="text-teal-600 bg-teal-600"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <RevenueChart
                    filteredRevenueData={filteredRevenueData}
                    showRevenueDropdown={showRevenueDropdown}
                    setShowRevenueDropdown={setShowRevenueDropdown}
                    revenueFilter={revenueFilter}
                    setRevenueFilter={setRevenueFilter}
                    applyRevenueFilter={applyRevenueFilter}
                    customStart={customStart}
                    setCustomStart={setCustomStart}
                    customEnd={customEnd}
                    setCustomEnd={setCustomEnd}
                    revenueLoading={revenueLoading}
                  />
                  <TopSellingProducts stats={stats} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <OrderStatusChart stats={stats} />
                  <AverageOrderValueChart stats={stats} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <OrderVelocityChart stats={stats} />
                  <CategorySalesChart stats={stats} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ReviewRatingChart stats={stats} />
                  <TopReviewedProducts stats={stats} />
                </div>

                <SentimentChart stats={stats} />
                <ProductSalesChart stats={stats} />
              </div>
            )}
            {activeTab === "products" && (
              <ProductsTable
                paginatedProducts={paginatedProducts || []}
                openAddProduct={openAddProduct}
                openEditProduct={openEditProduct}
                setProductDeleteConfirm={setProductDeleteConfirm}
                productPage={productPage}
                setProductPage={setProductPage}
                totalProductPages={totalProductPages}
              />
            )}
            {activeTab === "reviews" && (
              <AdminReviewList
                onReviewDeleted={fetchStats}
                reviews={filteredReviews || []}
                products={stats.products}
              />
            )}
            {activeTab === "users" && (
              <UsersTable
                paginatedUsers={paginatedUsers || []}
                setSelectedUser={setSelectedUser}
                setViewType={setViewType}
                setDeleteConfirm={setDeleteConfirm}
                userPage={userPage}
                setUserPage={setUserPage}
                totalUserPages={totalUserPages}
              />
            )}
            {activeTab === "orders" && (
              <OrdersTable
                paginatedOrders={paginatedOrders || []}
                handleStatusChange={handleStatusChange}
                setSelectedOrder={setSelectedOrder}
                setOrderDeleteConfirm={setOrderDeleteConfirm}
                orderPage={orderPage}
                setOrderPage={setOrderPage}
                totalOrderPages={totalOrderPages}
              />
            )}
          </div>
        </div>
      </div>
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300 max-w-sm ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} className="shrink-0" />
          ) : (
            <X size={18} className="shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 opacity-70 hover:opacity-100 transition-opacity shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProduct={editingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        handleSaveProduct={handleSaveProduct}
        isSubmitting={isSubmitting}
      />
      <UserModal
        selectedUser={selectedUser}
        onClose={() => setSelectedUser(null)}
        viewType={viewType}
      />
      <OrderModal
        selectedOrder={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
      <DeleteConfirmationModal
        isOpen={!!productDeleteConfirm}
        onClose={() => setProductDeleteConfirm(null)}
        onConfirm={() =>
          productDeleteConfirm && handleDeleteProduct(productDeleteConfirm.id)
        }
        title="Delete Product?"
        message={`Remove "${productDeleteConfirm?.title}" from store?`}
      />
      <DeleteConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDeleteUser(deleteConfirm)}
        title="Delete User?"
        message="This action cannot be undone."
      />
      <DeleteConfirmationModal
        isOpen={!!orderDeleteConfirm}
        onClose={() => setOrderDeleteConfirm(null)}
        onConfirm={() =>
          orderDeleteConfirm && handleDeleteOrder(orderDeleteConfirm.id)
        }
        title="Delete Order?"
        message={
          <>
            Order{" "}
            <span className="font-mono font-bold">
              #{orderDeleteConfirm?.id?.slice(-8).toUpperCase()}
            </span>
          </>
        }
        warning="This will permanently remove this order and update all graphs and statistics."
      />
    </div>
  );
}
