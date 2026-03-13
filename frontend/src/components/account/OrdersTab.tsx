"use client";

import React from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: any[];
}

interface OrdersTabProps {
  orders: Order[];
  setSelectedOrder: (order: Order) => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders, setSelectedOrder }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-900">Order History</h3>
      </div>
      <div className="">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Package size={48} className="mx-auto mb-3 opacity-20" />
            <p>You haven't placed any orders yet.</p>
            <Link
              href="/shop"
              className="text-purple-600 font-bold hover:underline mt-2 inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-purple-600">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">{order.date}</td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        ${order.total.toFixed(2)}
                        <span className="text-xs font-normal text-slate-400 block">
                          {order.items.length} items
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-purple-600 font-bold text-xs uppercase tracking-wide border border-blue-200 hover:border-purple-200 px-3 py-1.5 rounded-full transition-all"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-slate-100">
              {orders.map((order) => (
                <div key={order.id} className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Order ID
                      </p>
                      <p className="font-bold text-purple-600">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Date
                      </p>
                      <p className="text-sm text-slate-600">{order.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Status
                      </p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Total
                      </p>
                      <p className="font-bold text-slate-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all"
                  >
                    View Order Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
