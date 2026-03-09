const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    province: { type: String },
    postcode: { type: String },
    country: { type: String },
    cart: { type: Array, default: [] },
    wishlist: { type: Array, default: [] },
    savedCards: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, required: true },
    total: { type: Number, required: true },
    items: { type: Array, required: true },
    customer: { type: Object },
    trackingNumber: { type: String, default: "Pending" },
    trackingUrl: { type: String, default: "" },
    trackingHistory: {
      type: [
        {
          status: { type: String, required: true },
          message: { type: String, required: true },
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: String, required: true },
    oldPrice: { type: String, default: null },
    image: { type: String, required: true },
    badge: { type: String, default: null },
    printText: { type: String, default: "We print with" },
    category: { type: String, default: null },
  },
  { timestamps: true },
);

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    productId: { type: Number, required: true },
    userId: { type: String },
    userName: { type: String },
    userImage: { type: String },
    rating: { type: Number, required: true },
    comment: { type: String },
    date: { type: String },
    isEdited: { type: Boolean, default: false },
    previousReview: { type: Object, default: null },
  },
  { timestamps: true },
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: null },
  },
  { timestamps: true },
);

const UserModel = mongoose.models?.User || mongoose.model("User", userSchema);
const OrderModel =
  mongoose.models?.Order || mongoose.model("Order", orderSchema);
const ProductModel =
  mongoose.models?.Product || mongoose.model("Product", productSchema);
const ReviewModel =
  mongoose.models?.Review || mongoose.model("Review", reviewSchema);
const CategoryModel =
  mongoose.models?.Category || mongoose.model("Category", categorySchema);

module.exports = {
  UserModel,
  OrderModel,
  ProductModel,
  ReviewModel,
  CategoryModel,
};
