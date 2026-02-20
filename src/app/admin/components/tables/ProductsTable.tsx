import React from "react";
import Image from "next/image";
import { Plus, Package, Edit, Trash2 } from "lucide-react";

interface ProductsTableProps {
  paginatedProducts: any[];
  openAddProduct: () => void;
  openEditProduct: (product: any) => void;
  setProductDeleteConfirm: (product: any) => void;
  productPage: number;
  setProductPage: React.Dispatch<React.SetStateAction<number>>;
  totalProductPages: number;
}

const ProductsTable = ({
  paginatedProducts,
  openAddProduct,
  openEditProduct,
  setProductDeleteConfirm,
  productPage,
  setProductPage,
  totalProductPages,
}: ProductsTableProps) => {
  return (
    <div
      key="products"
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300"
    >
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-xl font-bold">Product Management</h3>
        <button
          onClick={openAddProduct}
          className="flex items-center gap-2 bg-slate-900 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Product Info</th>
              <th className="px-8 py-4">Price</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedProducts?.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-8 py-10 text-center text-slate-500 italic"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts?.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg border overflow-hidden relative bg-white">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-contain p-1"
                            unoptimized
                          />
                        ) : (
                          <Package className="w-full h-full p-3 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">
                          {p.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {p.badge || "Standard Item"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-800">
                        {p.price}
                      </span>
                      {p.oldPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {p.oldPrice}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditProduct(p)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setProductDeleteConfirm(p)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
        <div className="flex items-center justify-between px-8 py-4 border-t bg-slate-50">
          <button
            disabled={productPage === 1}
            onClick={() => setProductPage((p) => p - 1)}
            className="px-4 py-2 text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500 font-medium">
            Page {productPage} of {totalProductPages}
          </span>
          <button
            disabled={
              productPage === totalProductPages || totalProductPages === 0
            }
            onClick={() => setProductPage((p) => p + 1)}
            className="px-4 py-2 text-sm font-bold bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
