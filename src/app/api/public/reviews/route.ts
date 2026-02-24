import { NextResponse } from "next/server";
import { connectDB, ReviewModel } from "@/app/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  try {
    await connectDB();
    let query = {};
    if (productId) {
      query = { productId: productId.toString() };
    }
    
    const reviews = await ReviewModel.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Fetch reviews error:", error);
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

    await connectDB();
    const savedReview = await ReviewModel.create({
      ...review,
      productId: productId.toString()
    });

    return NextResponse.json(savedReview, { status: 201 });
  } catch (error) {
    console.error("Save review error:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}