import React, { useState } from "react";
import { X, Tag } from "lucide-react";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: Category | null;
  onSaved: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

const CategoryModal = ({
  isOpen,
  onClose,
  editingCategory,
  onSaved,
  showToast,
}: CategoryModalProps) => {
  const [name, setName] = useState(editingCategory?.name || "");
  const [image, setImage] = useState(editingCategory?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setName(editingCategory?.name || "");
    setImage(editingCategory?.image || "");
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const previewSlug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory._id}`
        : `/api/admin/categories`;

      const res = await fetch(url, {
        method: editingCategory ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          image: image.trim() || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(
          editingCategory ? "Category updated." : "Category created.",
          "success",
        );
        onSaved();
        onClose();
      } else {
        showToast(data.message || "Failed to save category.", "error");
      }
    } catch {
      showToast("Error saving category.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-black">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold mb-1.5 text-slate-700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., T-Shirts"
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
            {name.trim() && (
              <p className="text-xs text-slate-400 mt-1">
                Slug:{" "}
                <span className="font-mono text-slate-600">{previewSlug}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5 text-slate-700">
              Image URL{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/category-image.webp"
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
            {image && (
              <div className="mt-3 w-20 h-20 rounded-xl border overflow-hidden relative bg-slate-100">
                <Image
                  src={image}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            {!image && (
              <div className="mt-3 w-20 h-20 rounded-xl border bg-slate-50 flex items-center justify-center">
                <Tag className="w-8 h-8 text-slate-300" />
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 font-bold rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
