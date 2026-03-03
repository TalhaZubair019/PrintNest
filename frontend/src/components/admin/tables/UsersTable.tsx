import React from "react";
import { ShoppingCart, Heart, Trash2, Shield } from "lucide-react";
import { UserData } from "@/app/admin/types";

interface UsersTableProps {
  paginatedUsers: UserData[];
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  setViewType: React.Dispatch<
    React.SetStateAction<"cart" | "wishlist" | "both">
  >;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<string | null>>;
  onPromoteToAdmin: (userId: string, userName: string) => void;
  userPage: number;
  setUserPage: React.Dispatch<React.SetStateAction<number>>;
  totalUserPages: number;
}

const UsersTable = ({
  paginatedUsers,
  setSelectedUser,
  setViewType,
  setDeleteConfirm,
  onPromoteToAdmin,
  userPage,
  setUserPage,
  totalUserPages,
}: UsersTableProps) => {
  return (
    <div
      key="users"
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300"
    >
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xl font-bold">Regular Users</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">User</th>
              <th className="px-8 py-4">Storage</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedUsers?.map((u) => (
              <tr
                key={u.id}
                className="group hover:bg-slate-50/80 transition-all duration-200"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-100 to-blue-100 flex items-center justify-center text-purple-700 font-bold">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setViewType("cart");
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200"
                    >
                      <ShoppingCart size={14} className="text-blue-500" /> Cart
                      ({u.cartCount})
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setViewType("wishlist");
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200"
                    >
                      <Heart size={14} className="text-red-500" /> Wishlist (
                      {u.wishlistCount})
                    </button>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onPromoteToAdmin(u.id, u.name)}
                      className="text-slate-400 hover:text-purple-600 p-2.5 rounded-xl hover:bg-purple-50 transition-colors"
                      title="Promote to Admin"
                    >
                      <Shield size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(u.id)}
                      className="text-slate-400 hover:text-red-600 p-2.5 rounded-xl hover:bg-red-50 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-8 py-4 border-t bg-slate-50">
          <button
            disabled={userPage === 1}
            onClick={() => setUserPage((p) => p - 1)}
            className="px-4 py-2 text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500 font-medium">
            Page {userPage} of {totalUserPages}
          </span>
          <button
            disabled={userPage === totalUserPages || totalUserPages === 0}
            onClick={() => setUserPage((p) => p + 1)}
            className="px-4 py-2 text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
