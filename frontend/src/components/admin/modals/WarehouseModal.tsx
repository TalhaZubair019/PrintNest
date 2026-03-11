import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Building2 } from "lucide-react";

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingWarehouse: any | null;
  onSaved: () => void;
  showToast: (message: string, type: "success" | "error") => void;
}

export default function WarehouseModal({
  isOpen,
  onClose,
  editingWarehouse,
  onSaved,
  showToast,
}: WarehouseModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingWarehouse) {
        setName(editingWarehouse.warehouseName || "");
        setLocation(editingWarehouse.location || "");
      } else {
        setName("");
        setLocation("");
      }
    }
  }, [isOpen, editingWarehouse]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isEditing = !!editingWarehouse;
      const url = isEditing
        ? `/api/admin/warehouses/${editingWarehouse.id}`
        : "/api/admin/warehouses";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location }),
      });

      if (res.ok) {
        showToast(
          isEditing ? "Warehouse updated successfully." : "Warehouse created successfully.",
          "success"
        );
        onSaved();
        onClose();
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to save warehouse.", "error");
      }
    } catch (err: any) {
      showToast(err.message || "An error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg border shadow-sm flex items-center justify-center text-purple-600">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {editingWarehouse ? "Edit Warehouse" : "Create Warehouse"}
              </h2>
              <p className="text-xs text-slate-500">
                {editingWarehouse
                  ? "Update warehouse details"
                  : "Add a new storage location"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5 text-slate-600 uppercase tracking-wider">
              Warehouse Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., East Coast Hub"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5 text-slate-600 uppercase tracking-wider">
              Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, NY"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm"
            />
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg mt-4">
            <span className="font-bold shrink-0 mt-0.5">Note:</span>
            <span>If you change the name of an existing warehouse, it will automatically update the records of all mapped products.</span>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {editingWarehouse ? "Save Changes" : "Create Warehouse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
