export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  userId: string;
  items: OrderItem[];
  customer?: {
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  paymentMethod?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  cartCount: number;
  wishlistCount: number;
  cart?: any[];
  wishlist?: any[];
  createdAt?: string;
  isAdmin?: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  users: UserData[];
  products: any[];
  topProducts: any[];
  revenueData: any[];
  ratingDistribution: Record<string, number>;
  topReviewedProducts: { name: string; image: string; count: number }[];
  totalReviews: number;
  productSentiment: {
    name: string;
    image: string;
    good: number;
    bad: number;
    neutral: number;
    total: number;
  }[];
}
