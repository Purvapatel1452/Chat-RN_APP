
const stripe = require("stripe")("sk_test_51P6pcYSCdNlkqtTKEbkko3R7u9AU05pNEw9TKpeAtiEze3NmZlsWaun94sEQehiPPdlUouvIJ5d2thhp2527uaaJ00WSnKy45N");

const stripeIntent = async (req, res) => {
  console.log("patyment",process.env.STRIPE_SECRET_KEY);

  try {
    const { amount } = req.body;
    console.log(amount, "PP");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "INR",
      // payment_method:'pm_card_visa',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log(paymentIntent, "PPAA");

    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (e) {
    console.log("eoro", e);
    res.status(400).json({
      error: e.message,
    });
  }
};

const stripWebhook = async (req, res) => {
  console.log("WEBHOOK");
  const event = req.body;
  // console.log(event.type);
  let responsePayload = "";
  // console.log("RR", event.data.object);

  // Handle the payment_intent.succeeded event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    // console.log("RRee", event.data.object);

    console.log("PaymentIntent was successful", paymentIntent);
  }
  if (event.type === "charge.succeeded") {
    console.log("Charge", event.data.object.receipt_url);
    responsePayload = event.data.object.receipt_url;
  }
  console.log("TT", event.data.object.amount);
  res.json({ received: true, data: responsePayload });
};

const upiWebhook = async (req, res) => {
  console.log("WEBHOO");

  const event = req.body;
  console.log("EVENt", event, "+++");

  if (event.status === "SUCCESS") {
    console.log("Payment was successfull", event);
  } else {
    console.log("Payment failed", event);
  }

  res.json({ received: true });
};

module.exports = {
  stripeIntent,
  stripWebhook,
  upiWebhook,
};
