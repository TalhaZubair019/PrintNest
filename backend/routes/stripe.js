const express = require("express");
const Stripe = require("stripe");
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/checkout", async (req, res) => {
  try {
    const { items, customerEmail, orderId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required." });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },

        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      client_reference_id: orderId,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
