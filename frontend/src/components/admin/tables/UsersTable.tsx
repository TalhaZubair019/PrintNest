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
  isSuperAdmin: boolean;
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
  isSuperAdmin,
}: UsersTableProps) => {
  return (
    <div
      key="users"
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300"
    >
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xl font-bold">Regular Users</h3>
      </div>
      <div className="lg:hidden divide-y divide-slate-100">
        {paginatedUsers?.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 text-sm italic">
            No users found.
          </div>
        ) : (
          paginatedUsers?.map((u) => (
            <div key={u.id} className="p-4 space-y-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-100 to-blue-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                  {u.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-slate-900 truncate">
                    {u.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                </div>
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

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                {isSuperAdmin && (
                  <button
                    onClick={() => onPromoteToAdmin(u.id, u.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Shield size={14} /> Promote
                  </button>
                )}
                <button
                  onClick={() => setDeleteConfirm(u.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
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
                    <div className="w-10 h-10 shrink-0 rounded-full bg-linear-to-br from-purple-100 to-blue-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                      {u.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{u.name}</p>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
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
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 whitespace-nowrap"
                    >
                      <ShoppingCart size={12} className="text-blue-500" /> Cart
                      ({u.cartCount})
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
                  <div className="flex items-center justify-end gap-2">
                    {isSuperAdmin && (
                      <button
                        onClick={() => onPromoteToAdmin(u.id, u.name)}
                        className="text-slate-400 hover:text-purple-600 p-2.5 rounded-xl hover:bg-purple-50 transition-colors"
                        title="Promote to Admin"
                      >
                        <Shield size={18} />
                      </button>
                    )}
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
      </div>
        <div className="flex items-center justify-between px-4 lg:px-8 py-4 border-t bg-slate-50">
          <button
            disabled={userPage === 1}
            onClick={() => setUserPage((p) => p - 1)}
            className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs lg:text-sm text-slate-500 font-medium">
            Page {userPage} of {totalUserPages}
          </span>
          <button
            disabled={userPage === totalUserPages || totalUserPages === 0}
            onClick={() => setUserPage((p) => p + 1)}
            className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

export default UsersTable;
