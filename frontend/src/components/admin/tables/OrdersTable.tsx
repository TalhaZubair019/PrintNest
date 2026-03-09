import { useState, useMemo, useEffect } from "react";
import {
  Eye,
  Trash2,
  User,
  Filter,
  FilterX,
  ClipboardList,
  Calendar,
} from "lucide-react";
import { Order } from "@/app/admin/types";

interface OrdersTableProps {
  allOrders: Order[];
  handleStatusChange: (orderId: string, newStatus: string) => void;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  setOrderDeleteConfirm: React.Dispatch<React.SetStateAction<Order | null>>;
  orderPage: number;
  setOrderPage: React.Dispatch<React.SetStateAction<number>>;
  users?: { id: string; name: string; email?: string }[];
  updatingOrderId?: string | null;
}

const OrdersTable = ({
  allOrders,
  handleStatusChange,
  setSelectedOrder,
  setOrderDeleteConfirm,
  orderPage,
  setOrderPage,
  users = [],
  updatingOrderId,
}: OrdersTableProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const ITEMS_PER_PAGE = 5;

  const nameFrequencies = useMemo(() => {
    const freqs: Record<string, number> = {};
    users.forEach((u) => {
      freqs[u.name] = (freqs[u.name] || 0) + 1;
    });
    return freqs;
  }, [users]);

  const hasDeletedAccounts = useMemo(() => {
    const userIds = new Set(users.map((u) => u.id));
    return allOrders.some((o) => !userIds.has(o.userId));
  }, [allOrders, users]);

  const filteredOrders = useMemo(() => {
    const userIds = new Set(users.map((u) => u.id));
    return allOrders.filter((order) => {
      let userMatch = false;
      if (selectedUserId === "all") {
        userMatch = true;
      } else if (selectedUserId === "deleted") {
        userMatch = !userIds.has(order.userId);
      } else {
        userMatch = order.userId === selectedUserId;
      }

      const statusMatch =
        selectedStatus === "all" || order.status === selectedStatus;

      let dateMatch = true;
      if (selectedDateRange !== "all") {
        const orderDate = new Date(order.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (selectedDateRange === "week") {
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          dateMatch = orderDate >= lastWeek && orderDate <= today;
        } else if (selectedDateRange === "month") {
          const lastMonth = new Date(today);
          lastMonth.setDate(today.getDate() - 30);
          dateMatch = orderDate >= lastMonth && orderDate <= today;
        } else if (selectedDateRange === "current-month") {
          const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1,
          );
          dateMatch = orderDate >= startOfMonth && orderDate <= today;
        } else if (selectedDateRange === "custom" && customStart && customEnd) {
          const start = new Date(customStart);
          start.setHours(0, 0, 0, 0);
          const end = new Date(customEnd);
          end.setHours(23, 59, 59, 999);
          dateMatch = orderDate >= start && orderDate <= end;
        }
      }

      return userMatch && statusMatch && dateMatch;
    });
  }, [
    allOrders,
    selectedUserId,
    selectedStatus,
    selectedDateRange,
    customStart,
    customEnd,
    users,
  ]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * ITEMS_PER_PAGE,
    orderPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setOrderPage(1);
  }, [
    selectedUserId,
    selectedStatus,
    selectedDateRange,
    customStart,
    customEnd,
    setOrderPage,
  ]);

  return (
    <div
      key="orders"
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300"
    >
      <div className="p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Order Management
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Track and manage customer shipments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-purple-100">
              {filteredOrders.length} Showing
            </span>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
              {allOrders.length} Total
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
              <option value="all">All Customers</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                  {u.name && nameFrequencies[u.name] > 1 && u.email
                    ? ` (${u.email})`
                    : ""}
                </option>
              ))}
              {hasDeletedAccounts && (
                <option value="deleted" className="text-red-500 font-bold">
                  Deleted Accounts
                </option>
              )}
            </select>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Filter size={16} />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-slate-700 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Shipped">Shipped</option>
              <option value="Arrived in Country">Arrived in Country</option>
              <option value="Arrived in City">Arrived in City</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Calendar size={16} />
            </div>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-slate-700 font-medium"
            >
              <option value="all">Total Timeline</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="current-month">Current Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {(selectedUserId !== "all" ||
            selectedStatus !== "all" ||
            selectedDateRange !== "all") && (
            <button
              onClick={() => {
                setSelectedUserId("all");
                setSelectedStatus("all");
                setSelectedDateRange("all");
                setCustomStart("");
                setCustomEnd("");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
            >
              <FilterX size={16} />
              Clear
            </button>
          )}
        </div>

        {selectedDateRange === "custom" && (
          <div className="flex flex-wrap items-center gap-3 pt-2 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                From
              </label>
              <input
                type="date"
                value={customStart}
                max={customEnd || undefined}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                To
              </label>
              <input
                type="date"
                value={customEnd}
                min={customStart || undefined}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
              />
            </div>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Order Info</th>
              <th className="px-8 py-4">Customer</th>
              <th className="px-8 py-4">Total</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedOrders?.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-bold text-slate-700">
                      #{o.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(o.date).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  {o.customer?.name ? (
                    <>
                      <div className="text-sm text-slate-700 font-medium">
                        {o.customer.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {o.customer.email}
                      </div>
                    </>
                  ) : (
                    <span className="text-sm text-red-600 font-medium italic">
                      Deleted Account
                    </span>
                  )}
                </td>
                <td className="px-8 py-5 font-bold text-sm">{o.total}</td>
                <td className="px-8 py-5">
                  <div className="relative group min-w-[140px]">
                    <select
                      value={o.status}
                      disabled={updatingOrderId === o.id}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`w-full text-xs font-bold py-1.5 border rounded-lg px-3 focus:outline-none transition-all ring-offset-1 focus:ring-2 appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                        o.status === "Pending"
                          ? "bg-amber-50 text-amber-600 border-amber-200 focus:ring-amber-500/20"
                          : o.status === "Accepted"
                            ? "bg-blue-50 text-blue-600 border-blue-200 focus:ring-blue-500/20"
                            : o.status === "Shipped"
                              ? "bg-indigo-50 text-indigo-600 border-indigo-200 focus:ring-indigo-500/20"
                              : o.status === "Arrived in Country"
                                ? "bg-violet-50 text-violet-600 border-violet-200 focus:ring-violet-500/20"
                                : o.status === "Arrived in City"
                                  ? "bg-pink-50 text-pink-600 border-pink-200 focus:ring-pink-500/20"
                                  : o.status === "Out for Delivery"
                                    ? "bg-orange-50 text-orange-600 border-orange-200 focus:ring-orange-500/20"
                                    : o.status === "Delivered"
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-200 focus:ring-emerald-500/20"
                                      : "bg-red-50 text-red-600 border-red-200 focus:ring-red-500/20"
                      } ${updatingOrderId === o.id ? "animate-pulse" : ""}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Arrived in Country">
                        Arrived in Country
                      </option>
                      <option value="Arrived in City">Arrived in City</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {updatingOrderId === o.id && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 px-3 py-1.5 rounded-lg hover:bg-purple-600"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      onClick={() => setOrderDeleteConfirm(o)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-8 py-4 border-t bg-slate-50">
          <button
            disabled={orderPage === 1}
            onClick={() => setOrderPage((p) => p - 1)}
            className="px-4 py-2 text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500 font-medium">
            Page {orderPage} of {totalPages}
          </span>
          <button
            disabled={orderPage === totalPages || totalPages === 0}
            onClick={() => setOrderPage((p) => p + 1)}
            className="px-4 py-2 text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
