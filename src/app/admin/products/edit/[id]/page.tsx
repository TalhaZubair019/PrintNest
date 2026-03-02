"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Save,
} from "lucide-react";
import db from "@/data/db.json";
interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    oldPrice: "",
    image: "",
    badge: "",
    category: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/products/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.product) {
            const p = data.product;
            setProductForm({
              title: p.title || "",
              description: p.description || "",
              price: p.price ? p.price.replace("$", "") : "",
              oldPrice: p.oldPrice ? p.oldPrice.replace("$", "") : "",
              image: p.image || "",
              badge: p.badge || "",
              category: p.category || "",
            });
          }
        })
        .catch((error) => console.error("Error fetching product:", error))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setProductForm((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleGenerateDescription = async () => {
    if (!productForm.title) {
      alert("Please enter a product title first.");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/admin/ai-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: productForm.title,
          category: productForm.category || "",
        }),
      });
      const data = await res.json();
      if (data.description) {
        setProductForm((prev) => ({ ...prev, description: data.description }));
      } else if (data.error) {
        alert(data.error);
      }
    } catch {
      alert("Could not generate description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = productForm.image.trim();

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      if (!imageUrl) {
        alert("Please provide a product image (upload a file or enter a URL).");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title: productForm.title,
        description: productForm.description,
        price: `$${parseFloat(productForm.price).toFixed(2)}`,
        oldPrice: productForm.oldPrice
          ? `$${parseFloat(productForm.oldPrice).toFixed(2)}`
          : null,
        image: imageUrl,
        badge: productForm.badge || null,
        printText: "We print with",
        category: productForm.category || null,
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to save product: ${errData.message ?? res.statusText}`);
      }
    } catch (error: any) {
      alert(`Error saving product: ${error?.message ?? "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen font-sans flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/20 to-slate-50 font-sans">
      <div className="relative w-full h-175 z-0">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-b from-amber-50/50 via-teal-50/30 to-white z-10 mix-blend-multiply" />
          <Image
            src={db.shop.backgroundImage}
            alt="Background"
            fill
            className="object-fill opacity-80"
            priority
            unoptimized
          />
          <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-white to-transparent z-20" />
        </div>
        <div className="relative z-10 pt-80 flex flex-col items-center justify-center pb-10">
          <h1 className="text-6xl font-bold text-slate-900 tracking-tight mb-4 capitalize">
            Edit Product
          </h1>
          <div className="h-1.5 w-20 bg-linear-to-r from-purple-500 to-teal-400 rounded-full mb-10" />
          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link
              href="/admin/dashboard"
              className="hover:text-purple-600 transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight size={14} />
            <span className="text-slate-900">Edit Product</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-5">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <label className="block text-sm font-bold mb-2 text-slate-700">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={productForm.title}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="e.g., Premium Cotton T-Shirt"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-slate-800 transition-all"
                />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <label className="block text-sm font-bold mb-2 text-slate-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-white transition-all"
                >
                  <option value="" disabled>
                    Select a Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Description
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating || !productForm.title}
                    className="text-xs flex items-center gap-1.5 bg-linear-to-r from-purple-600 to-violet-600 text-white px-3 py-1.5 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-40 shadow-sm shadow-purple-200"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={11} className="animate-spin" />{" "}
                        Writing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={11} /> AI Generate
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter a product description or click AI Generate to create one from the title and category..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none text-sm text-slate-700 transition-all"
                />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-4">
                  Pricing
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-slate-500 uppercase tracking-wide">
                      Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-slate-500 uppercase tracking-wide">
                      Old Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={productForm.oldPrice}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          oldPrice: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <label className="block text-sm font-bold mb-2 text-slate-700">
                  Badge{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={productForm.badge}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      badge: e.target.value,
                    }))
                  }
                  placeholder="e.g., Sale, New, Hot"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <label className="block text-sm font-bold mb-3 text-slate-700">
                  Product Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all group mb-4"
                >
                  {productForm.image ? (
                    <Image
                      src={productForm.image}
                      alt="Preview"
                      fill
                      className="object-contain p-3"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-purple-500 transition-colors">
                      <Upload size={32} strokeWidth={1.5} />
                      <span className="text-xs font-medium">
                        Click to upload
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  <Upload size={15} /> Choose File
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-xs text-slate-400">
                      or paste URL
                    </span>
                  </div>
                </div>

                <input
                  type="text"
                  value={imageFile ? "" : productForm.image}
                  onChange={(e) => {
                    setImageFile(null);
                    setProductForm((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }));
                  }}
                  placeholder="https://example.com/image.png"
                  className="w-full mt-3 px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 bg-linear-to-r from-purple-600 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity shadow-lg shadow-purple-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save Product
                    </>
                  )}
                </button>
                <Link
                  href="/admin/dashboard"
                  className="w-full px-4 py-3 bg-slate-100 font-bold rounded-xl hover:bg-slate-200 text-center transition-colors text-slate-700 text-sm flex items-center justify-center"
                >
                  Cancel
                </Link>
              </div>
              <div className="bg-linear-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100 p-5">
                <p className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">
                  ✦ Tips
                </p>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <li>• Use a square image for best results</li>
                  <li>• Add a badge like "New" or "Sale" to highlight deals</li>
                  <li>• Type a title first to use AI description generation</li>
                  <li>• Set an old price to show a discount</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
