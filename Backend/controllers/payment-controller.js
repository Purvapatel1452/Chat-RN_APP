
require('dotenv').config();

console.log("patyment",process.env.STRIPE_SECRET_KEY,"PAYTM");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

const paymentIntent = async (req, res) => {
  try {
   const {amount}=req.body
   console.log(amount,"GOO123")

    const paymentIntent = await stripe.paymentIntents.create({
      payment_method_types: ["card"],
      amount: 100,
      currency: "INR",
    });
    console.log("2md", res);

    res.status(200).json(paymentIntent);
  } catch (error) {
    res.status(505).send(JSON.stringify(error));
  }
};



module.exports = {
  stripeIntent,
  stripWebhook,
  paymentIntent

};
