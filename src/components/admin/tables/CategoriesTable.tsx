import React from "react";
import Image from "next/image";
import { Plus, Tag, Edit, Trash2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface CategoriesTableProps {
  categories: Category[];
  onAdd: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoriesTable = ({
  categories,
  onAdd,
  onEdit,
  onDelete,
}: CategoriesTableProps) => {
  return (
    <div
      key="categories"
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300"
    >
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-xl font-bold">Category Management</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-slate-900 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Category</th>
              <th className="px-8 py-4">Slug</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-8 py-10 text-center text-slate-500 italic"
                >
                  No categories yet. Add your first category.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg border overflow-hidden relative bg-slate-100 shrink-0 flex items-center justify-center">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <Tag className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <p className="font-bold text-sm text-slate-800">
                        {cat.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {cat.slug}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(cat)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit category"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(cat)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesTable;
