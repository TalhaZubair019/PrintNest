import { NextResponse } from "next/server";

// Base URL for PayPal Sandbox API
const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com";

export async function POST(req: Request) {
  try {
    const { totalAmount, orderId } = await req.json();

    // 1. Get an OAuth2 Access Token
    const authString = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const authResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.text();
      console.error("PayPal Auth Failed:", errorData);
      throw new Error(`Failed to authenticate with PayPal: ${authResponse.status}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // 2. Create an Order using the Orders V2 API
    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderId,
            description: "PrintNest Products",
            amount: {
              currency_code: "USD", // Ensure currency matches your pricing
              value: totalAmount.toFixed(2),
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              brand_name: "PrintNest",
              user_action: "PAY_NOW",
              // We return the user back to the thank-you screen if successful
              return_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?order=${orderId}`,
              // If they cancel payment, return them to checkout
              cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=paypal_cancelled`,
            },
          },
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text();
      console.error("PayPal Order Failed:", errorData);
      throw new Error(`Failed to create PayPal order: ${orderResponse.status}`);
    }

    const orderData = await orderResponse.json();

    // 3. Find the exact HATEOAS link for the user to approve the payment.
    const approveLink = orderData.links.find(
      (link: any) => link.rel === "payer-action"
    );

    if (approveLink && approveLink.href) {
      return NextResponse.json({ url: approveLink.href });
    } else {
      throw new Error("Could not find the PayPal approve link in the response.");
    }
  } catch (error: any) {
    console.error("PayPal checkout route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
