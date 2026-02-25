"use client";

import { useState, useMemo } from "react";
import { Star, Trash2, User, Package, Filter, FilterX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Toast from "@/components/products/Toast";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  productId: number;
}

interface Product {
  id: number;
  title: string;
  image: string;
}

interface AdminReviewListProps {
  onReviewDeleted?: () => void;
  reviews: Review[];
  products: Product[];
  users?: { id: string; name: string }[];
}

export default function AdminReviewList({
  onReviewDeleted,
  reviews,
  products,
  users = [],
}: AdminReviewListProps) {
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({
    show: false,
    message: "",
    type: "add",
  });

  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const [selectedProductId, setSelectedProductId] = useState<string>("all");

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const userMatch =
        selectedUserId === "all" || review.userId === selectedUserId;
      const productMatch =
        selectedProductId === "all" ||
        review.productId.toString() === selectedProductId;
      return userMatch && productMatch;
    });
  }, [reviews, selectedUserId, selectedProductId]);

  const uniqueUsersInReviews = useMemo(() => {
    const userMap = new Map();
    reviews.forEach((r) => {
      if (!userMap.has(r.userId)) {
        userMap.set(r.userId, r.userName);
      }
    });
    return Array.from(userMap.entries()).map(([id, name]) => ({ id, name }));
  }, [reviews]);

  const getProductDetails = (productId: number) => {
    return products.find((p) => p.id === productId);
  };

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/public/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("Review deleted successfully", "remove");
        if (onReviewDeleted) onReviewDeleted();
      } else {
        showToast("Failed to delete review", "remove");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      showToast("Error connecting to server", "remove");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Review Management
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage and filter customer feedback
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-purple-100">
              {filteredReviews.length} Showing
            </span>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
              {reviews.length} Total
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <User size={16} />
            </div>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-slate-700 font-medium"
            >
              <option value="all">All Users</option>
              {(users.length > 0 ? users : uniqueUsersInReviews).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Package size={16} />
            </div>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-slate-700 font-medium"
            >
              <option value="all">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id.toString()}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {(selectedUserId !== "all" || selectedProductId !== "all") && (
            <button
              onClick={() => {
                setSelectedUserId("all");
                setSelectedProductId("all");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <FilterX size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">User</th>
              <th className="px-6 py-4 font-bold">Product</th>
              <th className="px-6 py-4 font-bold">Rating</th>
              <th className="px-6 py-4 font-bold">Comment</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredReviews.map((review) => {
              const product = getProductDetails(review.productId);
              return (
                <tr
                  key={review.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                        {review.userName?.[0]?.toUpperCase()}
                      </div>
                      <div className="font-bold text-slate-900">
                        {review.userName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product ? (
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                          {product.title}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs">
                        Unknown Product
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < review.rating
                              ? "fill-current"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 line-clamp-2 max-w-[200px]">
                      {review.comment}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">
                    {review.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredReviews.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
              <Filter size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No reviews found
            </h3>
            <p className="text-slate-500 mt-1 max-w-xs mx-auto">
              No reviews match your current filter selection. Try adjusting your
              filters.
            </p>
            <button
              onClick={() => {
                setSelectedUserId("all");
                setSelectedProductId("all");
              }}
              className="mt-6 text-sm font-bold text-purple-600 hover:text-purple-700"
            >
              Clear all filters
            </button>
          </div>
        )}
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
