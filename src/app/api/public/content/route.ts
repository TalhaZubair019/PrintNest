import { NextResponse } from "next/server";
import db from "@/app/data/db.json";
import { getProducts } from "@/app/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");

    if (section === "products") {
      const shopProducts = await getProducts();
      const dbProducts = db.products.products || [];
      
      const allProducts = [...shopProducts, ...dbProducts];
      const uniqueProducts = Array.from(
        new Map(allProducts.map((product) => [product.id, product])).values()
      );

      const combinedProducts = {
        ...db.products,
        products: uniqueProducts
      };
      
      return NextResponse.json(combinedProducts);
    }

    if (section && section in db) {
      return NextResponse.json(db[section as keyof typeof db]);
    }

    return NextResponse.json(db);
  } catch (error) {
    console.error("Content API error:", error);
    return NextResponse.json(
      { message: "Internal Error" },
      { status: 500 }
    );
  }
}
