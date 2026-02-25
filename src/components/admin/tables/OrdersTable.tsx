import React from "react";
import { Eye, Trash2 } from "lucide-react";
import { Order } from "@/app/admin/types";

interface OrdersTableProps {
  paginatedOrders: Order[];
  handleStatusChange: (orderId: string, newStatus: string) => void;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  setOrderDeleteConfirm: React.Dispatch<React.SetStateAction<Order | null>>;
  orderPage: number;
  setOrderPage: React.Dispatch<React.SetStateAction<number>>;
  totalOrderPages: number;
}

const OrdersTable = ({
  paginatedOrders,
  handleStatusChange,
  setSelectedOrder,
  setOrderDeleteConfirm,
  orderPage,
  setOrderPage,
  totalOrderPages,
}: OrdersTableProps) => {
  return (
    <div
      key="orders"
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300"
    >
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xl font-bold">Order Management</h3>
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
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="bg-transparent text-sm font-bold py-1 border rounded px-2 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
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
            Page {orderPage} of {totalOrderPages}
          </span>
          <button
            disabled={orderPage === totalOrderPages || totalOrderPages === 0}
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
