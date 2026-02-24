"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Toast from "@/app/components/products/Toast";

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
}

export default function AdminReviewList({
  onReviewDeleted,
  reviews,
  products,
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">All Reviews</h2>
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
          {reviews.length} Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Rating</th>
              <th className="px-6 py-4 font-semibold">Review</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.map((review) => {
              const product = getProductDetails(review.productId);
              return (
                <tr
                  key={review.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {review.userName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product ? (
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                          {product.title}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">
                        Unknown Product
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-yellow-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating ? "fill-current" : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                      {review.comment}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {review.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {reviews.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No reviews found.
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
