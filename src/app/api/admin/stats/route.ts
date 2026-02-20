import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUsers, getAllOrders, getProducts, getReviews } from "@/app/lib/db";

const SECRET_KEY = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.EMAIL_USER;

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, SECRET_KEY!) as { email: string };
    if (decoded.email !== ADMIN_EMAIL) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await getUsers();
    const orders = await getAllOrders();
    const products = await getProducts();

    const totalUsers = users.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (acc, order) => acc + (order.total || 0),
      0,
    );

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    let rangeStart: Date;
    let rangeEnd: Date;

    if (startDateParam && endDateParam) {
      rangeStart = new Date(startDateParam);
      rangeEnd = new Date(endDateParam);
      rangeEnd.setHours(23, 59, 59, 999);
    } else {
      rangeEnd = new Date();
      rangeStart = new Date();
      rangeStart.setDate(rangeStart.getDate() - 6);
    }
    const dayRange: Date[] = [];
    const cursor = new Date(rangeStart);
    cursor.setHours(0, 0, 0, 0);
    while (cursor <= rangeEnd) {
      dayRange.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    const revenueData = dayRange.map(d => {
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.date);
        return orderDate.getDate() === d.getDate() &&
               orderDate.getMonth() === d.getMonth() &&
               orderDate.getFullYear() === d.getFullYear();
      });
      return {
        date: d.toISOString(),
        revenue: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      };
    });

    const productSales: Record<string, any> = {};
    orders.forEach(order => {
      order.items?.forEach(item => {
         if (!productSales[item.name]) {
           productSales[item.name] = { name: item.name, quantity: 0, revenue: 0, image: item.image };
         }
         productSales[item.name].quantity += item.quantity;
         productSales[item.name].revenue += item.totalPrice;
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((order) => {
        const customer = users.find((user) => user.id === order.userId);
        return {
          ...order,
          customer: customer ? {
            name: customer.name,
            email: customer.email,
            address: customer.address,
            city: customer.city,
            country: customer.country,
          } : null,
        };
      });
      
    const usersWithDetails = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        cartCount: user.cart?.length || 0,
        wishlistCount: user.wishlist?.length || 0,
      };
    });

    const reviews = await getReviews();
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r: any) => {
      if (r.rating >= 1 && r.rating <= 5) {
        // @ts-ignore
        ratingDistribution[r.rating]++;
      }
    });

    const reviewCounts: Record<string, number> = {};
    reviews.forEach((r: any) => {
      const pid = r.productId;
      reviewCounts[pid] = (reviewCounts[pid] || 0) + 1;
    });

    const topReviewedProducts = Object.entries(reviewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([productId, count]) => {
        const product = products.find((p: any) => p.id === parseInt(productId));
        return {
          name: product?.title || `Product ${productId}`,
          image: product?.image || "",
          count,
        };
      });

    const sentimentMap: Record<string, { good: number; bad: number; neutral: number }> = {};
    reviews.forEach((r: any) => {
      const pid = r.productId;
      if (!sentimentMap[pid]) {
        sentimentMap[pid] = { good: 0, bad: 0, neutral: 0 };
      }
      if (r.rating >= 4) sentimentMap[pid].good++;
      else if (r.rating <= 2) sentimentMap[pid].bad++;
      else sentimentMap[pid].neutral++;
    });

    const productSentiment = Object.entries(sentimentMap)
      .map(([productId, counts]) => {
         const product = products.find((p: any) => p.id === parseInt(productId));
         return {
           name: product?.title || `Product ${productId}`,
           image: product?.image || "",
           ...counts,
           total: counts.good + counts.bad + counts.neutral
         };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      users: usersWithDetails,
      revenueData,
      topProducts,
      products,
      ratingDistribution,
      topReviewedProducts,
      totalReviews: reviews.length,
      productSentiment,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { message: "Internal Error" },
      { status: 500 },
    );
  }
}