import React from "react";
import {
  Shield,
  Trash2,
  Crown,
  UserPlus,
  ShieldOff,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { UserData } from "@/app/admin/types";

interface AdminsTableProps {
  paginatedAdmins: UserData[];
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  setViewType: React.Dispatch<
    React.SetStateAction<"cart" | "wishlist" | "both">
  >;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<string | null>>;
  onRevokeAdmin: (userId: string, userName: string) => void;
  adminPage: number;
  setAdminPage: React.Dispatch<React.SetStateAction<number>>;
  totalAdminPages: number;
  onAddAdmin: () => void;
  isSuperAdmin: boolean;
}

const AdminsTable = ({
  paginatedAdmins,
  setSelectedUser,
  setViewType,
  setDeleteConfirm,
  onRevokeAdmin,
  adminPage,
  setAdminPage,
  totalAdminPages,
  onAddAdmin,
  isSuperAdmin,
}: AdminsTableProps) => {
  return (
    <div
      key="admins"
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300"
    >
      <div className="p-6 border-b border-slate-100 bg-linear-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Admin Management
              </h3>
              <p className="text-sm text-slate-500">
                {paginatedAdmins.length} administrator
                {paginatedAdmins.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {isSuperAdmin && (
            <button
              onClick={onAddAdmin}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md shadow-purple-200"
            >
              <UserPlus size={16} />
              Add Admin
            </button>
          )}
        </div>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-slate-100">
        {paginatedAdmins.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 text-sm italic">
            No admins found.
          </div>
        ) : (
          paginatedAdmins.map((u) => (
            <div key={u.id} className="p-4 space-y-4 hover:bg-purple-50/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate max-w-[150px]">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{u.email}</p>
                  </div>
                </div>
                {u.adminRole === "super_admin" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                    <Crown size={10} /> Super
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">
                    <Shield size={10} /> Admin
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setViewType("cart");
                  }}
                  className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-100 py-2 rounded-xl hover:bg-white hover:border-blue-200 transition-all"
                >
                  <ShoppingCart size={14} className="text-blue-500" />
                  Cart ({u.cartCount})
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setViewType("wishlist");
                  }}
                  className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-100 py-2 rounded-xl hover:bg-white hover:border-red-200 transition-all"
                >
                  <Heart size={14} className="text-red-500" />
                  Wishlist ({u.wishlistCount})
                </button>
              </div>

              {isSuperAdmin && u.adminRole !== "super_admin" && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => onRevokeAdmin(u.id, u.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <ShieldOff size={14} /> Revoke
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(u.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Administrator</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4">Storage</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedAdmins.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-8 py-12 text-center text-slate-400 text-sm"
                >
                  No admins found.
                </td>
              </tr>
            ) : (
              paginatedAdmins.map((u) => (
                <tr
                  key={u.id}
                  className="group hover:bg-purple-50/40 transition-all duration-200"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {u.adminRole === "super_admin" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full whitespace-nowrap">
                        <Crown size={10} />
                        Super Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full whitespace-nowrap">
                        <Shield size={10} />
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setViewType("cart");
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 whitespace-nowrap"
                      >
                        <ShoppingCart size={12} className="text-blue-500" />{" "}
                        Cart ({u.cartCount})
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setViewType("wishlist");
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 whitespace-nowrap"
                      >
                        <Heart size={12} className="text-red-500" /> Wishlist (
                        {u.wishlistCount})
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {isSuperAdmin && u.adminRole !== "super_admin" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onRevokeAdmin(u.id, u.name)}
                          className="text-slate-400 hover:text-orange-600 p-2.5 rounded-xl hover:bg-orange-50 transition-colors"
                          title="Revoke Admin Access"
                        >
                          <ShieldOff size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(u.id)}
                          className="text-slate-400 hover:text-red-600 p-2.5 rounded-xl hover:bg-red-50 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
        <div className="flex items-center justify-between px-4 lg:px-8 py-4 border-t bg-slate-50">
          <button
            disabled={adminPage === 1}
            onClick={() => setAdminPage((p) => p - 1)}
            className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs lg:text-sm text-slate-500 font-medium">
            Page {adminPage} of {totalAdminPages}
          </span>
          <button
            disabled={adminPage === totalAdminPages || totalAdminPages === 0}
            onClick={() => setAdminPage((p) => p + 1)}
            className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

export default AdminsTable;
