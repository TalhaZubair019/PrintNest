import React from "react";
import { Shield, Trash2, Crown, UserPlus, ShieldOff } from "lucide-react";
import { UserData } from "@/app/admin/types";

interface AdminsTableProps {
  paginatedAdmins: UserData[];
  setDeleteConfirm: React.Dispatch<React.SetStateAction<string | null>>;
  onRevokeAdmin: (userId: string, userName: string) => void;
  adminPage: number;
  setAdminPage: React.Dispatch<React.SetStateAction<number>>;
  totalAdminPages: number;
  onAddAdmin: () => void;
}

const AdminsTable = ({
  paginatedAdmins,
  setDeleteConfirm,
  onRevokeAdmin,
  adminPage,
  setAdminPage,
  totalAdminPages,
  onAddAdmin,
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
          <button
            onClick={onAddAdmin}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md shadow-purple-200"
          >
            <UserPlus size={16} />
            Add Admin
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Administrator</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedAdmins.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
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
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      <Crown size={11} />
                      Administrator
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-8 py-4 border-t bg-slate-50">
          <button
            disabled={adminPage === 1}
            onClick={() => setAdminPage((p) => p - 1)}
            className="px-4 py-2 text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500 font-medium">
            Page {adminPage} of {totalAdminPages}
          </span>
          <button
            disabled={adminPage === totalAdminPages || totalAdminPages === 0}
            onClick={() => setAdminPage((p) => p + 1)}
            className="px-4 py-2 text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminsTable;
