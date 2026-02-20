import React from "react";
import Image from "next/image";
import { X, ClipboardList, Users, MapPin, Package } from "lucide-react";
import { Order } from "@/app/admin/types";
import StatusBadge from "../ui/StatusBadge";

interface OrderModalProps {
  selectedOrder: Order | null;
  onClose: () => void;
}

const OrderModal = ({ selectedOrder, onClose }: OrderModalProps) => {
  if (!selectedOrder) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <ClipboardList size={22} />
            </div>
            <div>
              <h3 className="font-black text-lg">
                Order #{selectedOrder.id.slice(-8).toUpperCase()}
              </h3>
              <p className="text-xs text-slate-500">
                {new Date(selectedOrder.date).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-8">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                Status
              </p>
              <StatusBadge status={selectedOrder.status} />
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                Total Amount
              </p>
              <p className="text-2xl font-bold">{selectedOrder.total}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase">
                <Users size={16} className="text-purple-500" /> Customer Details
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Name</span>
                  {selectedOrder.customer?.name ? (
                    <span className="font-medium">
                      {selectedOrder.customer.name}
                    </span>
                  ) : (
                    <span className="text-red-600 italic">Deleted Account</span>
                  )}
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium">
                    {selectedOrder.customer?.email || "—"}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase">
                <MapPin size={16} className="text-purple-500" /> Shipping Info
              </h4>
              <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-600 leading-relaxed border">
                {selectedOrder.customer?.address ? (
                  <>
                    {selectedOrder.customer.address}
                    <br />
                    {selectedOrder.customer.city},{" "}
                    {selectedOrder.customer.country}
                  </>
                ) : (
                  <span className="italic text-slate-400">
                    No shipping address provided
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            <h4 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase">
              <Package size={16} className="text-purple-500" /> Order Items (
              {selectedOrder.items.length})
            </h4>
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-md relative overflow-hidden">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt=""
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {item.price}
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        {item.totalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
