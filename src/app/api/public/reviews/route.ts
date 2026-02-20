import { NextResponse } from "next/server";
import { getReviews, addReview } from "@/app/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  try {
    const allReviews = await getReviews();
    
    if (productId) {
      const productReviews = allReviews.filter(
        (review: any) => review.productId.toString() === productId.toString()
      );
      return NextResponse.json(productReviews);
    }
    
    return NextResponse.json(allReviews);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, review } = body;

    if (!productId || !review) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const newReview = { ...review, productId };
    const savedReview = await addReview(newReview);

    return NextResponse.json(savedReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}