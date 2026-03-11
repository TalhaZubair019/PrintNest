import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Package,
  Edit,
  Trash2,
  Filter,
  FilterX,
  Tag,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

interface ProductsTableProps {
  allProducts: any[];
  categories: any[];
  setProductDeleteConfirm: (product: any) => void;
  productPage: number;
  setProductPage: React.Dispatch<React.SetStateAction<number>>;
}

const ProductsTable = ({
  allProducts,
  categories,
  setProductDeleteConfirm,
  productPage,
  setProductPage,
}: ProductsTableProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBadge, setSelectedBadge] = useState<string>("all");
  const ITEMS_PER_PAGE = 10;

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      let categoryMatch = false;
      if (selectedCategory === "all") {
        categoryMatch = true;
      } else if (selectedCategory === "uncategorized") {
        categoryMatch = !product.category;
      } else {
        categoryMatch = product.category === selectedCategory;
      }

      let badgeMatch = false;
      const productBadges = product.badges || (product.badge ? [product.badge] : []);
      if (selectedBadge === "all") {
        badgeMatch = true;
      } else if (selectedBadge === "none") {
        badgeMatch = productBadges.length === 0;
      } else {
        badgeMatch = productBadges.includes(selectedBadge);
      }

      return categoryMatch && badgeMatch;
    });
  }, [allProducts, selectedCategory, selectedBadge]);

  const uniqueBadges = useMemo(() => {
    const badgesSet = new Set<string>();
    allProducts.forEach((p) => {
      if (p.badges) {
        p.badges.forEach((b: string) => badgesSet.add(b));
      } else if (p.badge) {
        badgesSet.add(p.badge);
      }
    });
    return Array.from(badgesSet);
  }, [allProducts]);

  const totalProductPages =
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * ITEMS_PER_PAGE,
    productPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setProductPage(1);
  }, [selectedCategory, selectedBadge, setProductPage]);
  return (
    <div
      key="products"
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300"
    >
      <div className="p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Product Management
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Manage your store inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-slate-900 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus size={16} /> Add Product
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-purple-100">
              {filteredProducts.length} Showing
            </span>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
              {allProducts.length} Total
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[150px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Filter size={16} />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-slate-700 font-medium"
              >
                <option value="all">All Categories</option>
                {categories?.map((c) => (
                  <option key={c._id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="uncategorized" className="italic text-slate-500">
                  Uncategorized
                </option>
              </select>
            </div>

            <div className="relative flex-1 min-w-[150px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Tag size={16} />
              </div>
              <select
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none text-slate-700 font-medium"
              >
                <option value="all">All Badges</option>
                {uniqueBadges.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="none" className="italic text-slate-500">
                  No Badge
                </option>
              </select>
            </div>
          </div>

          {(selectedCategory !== "all" || selectedBadge !== "all") && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedBadge("all");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
            >
              <FilterX size={16} />
              Clear
            </button>
          )}
        </div>
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
                          {(p.badges || (p.badge ? [p.badge] : [])).join(
                            ", ",
                          ) || "Standard Item"}
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
                      <Link
                        href={`/admin/products/edit/${p.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex"
                      >
                        <Edit size={16} />
                      </Link>
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
