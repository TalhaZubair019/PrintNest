"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/CartSlice";
import { toggleWishlist } from "@/redux/WishListSlice";
import { RootState } from "@/redux/Store";
import Toast from "@/components/products/Toast";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  description?: string;
  category?: string;
  reviews?: Review[];
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "add" | "remove";
  }>({
    show: false,
    message: "",
    type: "add",
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const response = await fetch("/api/public/content?section=products");
        const data = await response.json();

        const foundProduct = data.products.find(
          (p: Product) => p.title.toLowerCase().replace(/\s+/g, "-") === slug,
        );

        setProduct(foundProduct || null);

        if (foundProduct) {
          const reviewsResponse = await fetch(
            `/api/public/reviews?productId=${foundProduct.id}`,
          );
          if (reviewsResponse.ok) {
            const fetchedReviews = await reviewsResponse.json();
            setReviews(fetchedReviews);
          } else {
            setReviews(foundProduct?.reviews || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product or reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductAndReviews();
    }
  }, [slug]);

  const showToast = (message: string, type: "add" | "remove") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const priceNumber = parseFloat(
      product.price.toString().replace(/[^0-9.]/g, ""),
    );
    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        price: priceNumber,
        image: product.image,
        quantity,
      }),
    );
    showToast(`Added ${quantity} ${product.title} to cart!`, "add");
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const priceNumber = parseFloat(
      product.price.toString().replace(/[^0-9.]/g, ""),
    );
    const wasInWishlist = wishlistItems.some((item) => item.id === product.id);
    dispatch(
      toggleWishlist({
        id: product.id,
        title: product.title,
        price: priceNumber,
        image: product.image,
      }),
    );
    if (wasInWishlist) {
      showToast(`${product.title} removed from wishlist`, "remove");
    } else {
      showToast(`${product.title} added to wishlist!`, "add");
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setComment(review.comment);
    window.scrollTo({
      top: document.getElementById("review-form")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/public/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
        showToast("Review deleted successfully", "remove");
        if (editingReviewId === reviewId) {
          setEditingReviewId(null);
          setComment("");
          setRating(5);
        }
      } else {
        showToast("Failed to delete review", "remove");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      showToast("Error connecting to server", "remove");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || !product) return;

    const reviewData = {
      userId: user.id,
      userName: user.name || "Customer",
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      let response;
      if (editingReviewId) {
        response = await fetch(`/api/public/reviews/${editingReviewId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ review: reviewData }),
        });
      } else {
        response = await fetch("/api/public/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            review: { ...reviewData, id: Date.now().toString() },
          }),
        });
      }

      if (response.ok) {
        const savedReview = await response.json();
        if (editingReviewId) {
          setReviews(
            reviews.map((r) => (r.id === editingReviewId ? savedReview : r)),
          );
          showToast("Review updated successfully!", "add");
        } else {
          setReviews([savedReview, ...reviews]);
          showToast("Review submitted successfully!", "add");
        }
        setComment("");
        setRating(5);
        setEditingReviewId(null);
      } else {
        showToast("Failed to save review.", "remove");
      }
    } catch (error) {
      console.error("Error saving review:", error);
      showToast("Error connecting to server.", "remove");
    }
  };

  if (loading) {
    return (
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 text-center">Loading...</div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <Link href="/shop" className="text-blue-500 hover:underline">
            Return to shop
          </Link>
        </div>
      </section>
    );
  }

  const isInWishlist = wishlistItems.some((item) => item.id === product.id);
  const averageRating = reviews.length
    ? (
        reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-800">
      <div className="absolute top-0 left-0 w-full h-175 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-amber-50/50 via-teal-50/30 to-white z-10 mix-blend-multiply" />
        <Image
          src="https://themexriver.com/wp/printnest/wp-content/uploads/2026/01/breadcrumb-bg.webp"
          alt="Product Background"
          fill
          className="object-fill opacity-80"
          priority
        />
        <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-white to-transparent z-20" />
      </div>

      <div className="relative z-10 pt-80">
        <div className="w-full pb-10 flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold text-slate-900 tracking-tight mb-4 text-center px-4">
            {product.title}
          </h1>
          <div className="h-1.5 w-20 bg-linear-to-r from-purple-500 to-teal-400 rounded-full mb-10" />
          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <div className="flex text-purple-400">
              <ChevronRight size={14} strokeWidth={2.5} />
            </div>
            <Link
              href="/shop"
              className="hover:text-purple-600 transition-colors"
            >
              Shop
            </Link>
            <div className="flex text-purple-400">
              <ChevronRight size={14} strokeWidth={2.5} />
            </div>
            <span className="text-slate-900 truncate max-w-[200px]">
              {product.title}
            </span>
          </div>
        </div>

        <section className="max-w-6xl mx-auto px-4 pb-16 mt-12">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-black mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.round(Number(averageRating))
                          ? "fill-current"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({reviews.length}{" "}
                  {reviews.length === 1 ? "Review" : "Reviews"})
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-blue-600">
                    {product.price}
                  </span>
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded">
                  In Stock
                </span>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">
                {product.description ||
                  "Premium quality product perfect for your needs. Customizable and high-quality printing."}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <label className="font-semibold text-black">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-lg font-semibold text-purple-600">
                    Total: $
                    {(
                      parseFloat(
                        product.price.toString().replace(/[^0-9.]/g, ""),
                      ) * quantity
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-full hover:shadow-lg transition-all"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`px-6 py-3 font-bold rounded-full transition-all ${isInWishlist ? "bg-red-500 text-white hover:bg-red-600" : "border-2 border-gray-300 text-black hover:border-red-500"}`}
                  >
                    {isInWishlist ? "♥ Wishlist" : "♡ Wishlist"}
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-600 border-t pt-8">
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span className="font-semibold">PROD-{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-semibold">
                    {product.category || "Featured"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-black mb-10">
              Customer Reviews
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="order-2 md:order-1">
                <h3 className="text-xl font-bold mb-6" id="review-form">
                  {editingReviewId ? "Edit Your Review" : "Write a Review"}
                </h3>
                {!isAuthenticated ? (
                  <div className="bg-blue-50/50 p-8 rounded-2xl text-center border border-blue-100">
                    <p className="mb-4 text-blue-900 font-medium">
                      You must be logged in to leave a review.
                    </p>
                    <Link
                      href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "")}`}
                      className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition shadow-sm hover:shadow-md"
                    >
                      Log In to Review
                    </Link>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmitReview}
                    className="space-y-5 bg-gray-50 p-8 rounded-2xl"
                  >
                    <div>
                      <label className="block font-semibold mb-3 text-slate-800">
                        Overall Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              size={28}
                              className={
                                (hoveredStar || rating) >= star
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-3 text-slate-800">
                        Your Review
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="What did you like or dislike about this product?"
                      />
                    </div>
                    <div className="flex gap-4">
                      {editingReviewId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReviewId(null);
                            setComment("");
                            setRating(5);
                          }}
                          className="flex-1 px-6 py-4 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-all shadow-md"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 px-6 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md"
                      >
                        {editingReviewId ? "Update Review" : "Submit Review"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="order-1 md:order-2">
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-xl font-bold">
                    {reviews.length}{" "}
                    {reviews.length === 1 ? "Review" : "Reviews"}
                  </h3>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full text-sm font-semibold text-yellow-800">
                      <Star
                        size={14}
                        className="fill-current text-yellow-500"
                      />
                      {averageRating} Average
                    </div>
                  )}
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-12 px-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Star size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className={`bg-white p-6 rounded-2xl border shadow-xs transition-all ${editingReviewId === review.id ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-100"}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-semibold text-slate-900">
                            {review.userName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {review.date}
                          </div>
                        </div>
                        <div className="flex mb-4 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm mb-4">
                          {review.comment}
                        </p>
                        {user && user.id === review.userId && (
                          <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-gray-50">
                            <button
                              onClick={() => handleEdit(review)}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="text-sm font-medium text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
