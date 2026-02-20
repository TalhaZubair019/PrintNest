"use client";

import AdminReviewList from "../components/tables/AdminReviewList";

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reviews Management</h1>
      </div>
      <AdminReviewList />
    </div>
  );
}
