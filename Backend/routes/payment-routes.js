const express = require("express");
const {

  stripeIntent,
  stripWebhook,
  upiWebhook,
  paymentIntent,
} = require("../controllers/payment-controller");
const authMiddleware = require("../middleware/authMiddleware");

const paymentRouter = express.Router();

paymentRouter.use(express.json());


paymentRouter.post("/intents", authMiddleware, stripeIntent);

paymentRouter.post("/stripe/webhook", stripWebhook);


paymentRouter.post('/create-payment-intent',paymentIntent )

module.exports = paymentRouter;











