import React from "react";
import Image from "next/image";
import { Plus, Tag, Edit, Trash2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string | null;
  itemCount?: number;
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
      <div className="lg:hidden divide-y divide-slate-100">
        {categories.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500 italic">
            No categories found.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-16 h-16 rounded-xl border border-slate-100 overflow-hidden relative bg-slate-100 shrink-0 flex items-center justify-center">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <Tag className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 truncate">{cat.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-slate-500">{cat.slug}</span>
                  <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold">
                    {cat.itemCount || 0} items
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(cat)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(cat)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left font-sans">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Category</th>
              <th className="px-8 py-4">Slug</th>
              <th className="px-8 py-4">Total Items</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-8 py-10 text-center text-slate-500 italic"
                >
                  No categories yet. Add your first category.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg border overflow-hidden relative bg-slate-100 shrink-0 flex items-center justify-center text-slate-300">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <Tag size={20} />
                        )}
                      </div>
                      <p className="font-bold text-sm text-slate-800">
                        {cat.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-slate-600">
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {cat.slug}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-bold text-slate-700">
                    {cat.itemCount || 0}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(cat)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-100 bg-white"
                        title="Edit category"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(cat)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-100 bg-white"
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
