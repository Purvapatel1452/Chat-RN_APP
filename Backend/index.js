const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("cors");

const router = require("./routes/user-routes");
const msgRouter = require("./routes/message-routes");
const paymentRouter = require("./routes/payment-routes");
const groupRouter = require("./routes/group-routes");
const expenseRouter = require("./routes/expense-routes");

const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
console.log(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/chat/user", router);

app.use("/chat/message", msgRouter);

app.use("/chat/payments", paymentRouter);

app.use("/chat/group", groupRouter);

app.use("/chat/expense", expenseRouter);

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT} . . . `);
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB . . . ");
  })
  .catch((err) => {
    console.log("Error in connecting to MongoDB:", err);
  });
