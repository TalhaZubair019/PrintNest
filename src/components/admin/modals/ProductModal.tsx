import React, { useRef } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: any;
  productForm: {
    title: string;
    price: string;
    oldPrice: string;
    image: string;
    badge: string;
  };
  setProductForm: React.Dispatch<
    React.SetStateAction<{
      title: string;
      price: string;
      oldPrice: string;
      image: string;
      badge: string;
    }>
  >;
  handleSaveProduct: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  // New props for file handling
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const ProductModal = ({
  isOpen,
  onClose,
  editingProduct,
  productForm,
  setProductForm,
  handleSaveProduct,
  isSubmitting,
  imageFile,
  setImageFile,
}: ProductModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Create a fake URL for immediate preview
      setProductForm({ ...productForm, image: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-black">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSaveProduct} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold mb-1.5 text-slate-700">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={productForm.title}
              onChange={(e) =>
                setProductForm({ ...productForm, title: e.target.value })
              }
              placeholder="e.g., Premium Cotton T-Shirt"
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1.5 text-slate-700">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
                placeholder="0.00"
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-slate-700">
                Old Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={productForm.oldPrice}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    oldPrice: e.target.value,
                  })
                }
                placeholder="0.00"
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>

          {/* Modified Image Upload Section */}
          <div>
            <label className="block text-sm font-bold mb-1.5 text-slate-700">
              Product Image <span className="text-red-500">*</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="flex gap-4 items-start">
              <div className="w-24 h-24 bg-slate-100 rounded-xl border flex items-center justify-center relative overflow-hidden shrink-0">
                {productForm.image ? (
                  <Image
                    src={productForm.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <ImageIcon className="text-slate-400" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={16} /> Choose Image
                </button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400 font-bold">
                      OR URL
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => {
                    setImageFile(null);
                    setProductForm({ ...productForm, image: e.target.value });
                  }}
                  placeholder="https://example.com/image.png"
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5 text-slate-700">
              Badge
            </label>
            <input
              type="text"
              value={productForm.badge}
              onChange={(e) =>
                setProductForm({ ...productForm, badge: e.target.value })
              }
              placeholder="e.g., Sale, New, Hot"
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <div className="pt-4 flex gap-3">
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
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
