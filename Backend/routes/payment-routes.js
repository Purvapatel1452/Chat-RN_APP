const express = require("express");
const {

  stripeIntent,
  stripWebhook,
  upiWebhook,
} = require("../controllers/payment-controller");
const authMiddleware = require("../middleware/authMiddleware");

const paymentRouter = express.Router();

paymentRouter.use(express.json());


paymentRouter.post("/intents", authMiddleware, stripeIntent);

paymentRouter.post("/stripe/webhook", stripWebhook);

paymentRouter.post("/upi-webhook", upiWebhook); 

module.exports = paymentRouter;











