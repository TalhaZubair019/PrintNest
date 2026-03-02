import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { totalAmount, customer, orderId } = await req.json();
    const payfastApiUrl = "https://ipg.apps.net.pk/Ecommerce/api/Transaction/PostTransaction";
    const payload = {
      MERCHANT_ID: process.env.PAYFAST_MERCHANT_ID,
      SECURED_KEY: process.env.PAYFAST_SECURED_KEY,
      TXNAMT: totalAmount.toString(),
      CUSTOMER_MOBILE_NO: customer.phone,
      CUSTOMER_EMAIL_ADDRESS: customer.email,
      ORDER_ID: orderId,
      TXNDESC: "PrintNest Order",
      SUCCESS_URL: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?order=${orderId}`,
      FAILURE_URL: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=payment_failed`,
      CHECKOUT_URL: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    };

    const response = await fetch(payfastApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data && data.TRANSACTION_URL) {
      return NextResponse.json({ url: data.TRANSACTION_URL });
    } else {
      throw new Error("Failed to generate PayFast token");
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}