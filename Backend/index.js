const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

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
console.log(process.env.STRIPE_SECRET_KEY)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());

app.use("/chat/user", cors(), router);

app.use("/chat/message", cors(), msgRouter);

app.use("/chat/payments", paymentRouter);

app.use("/chat/group", groupRouter);

app.use("/chat/expense", expenseRouter);

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT} . . . `);
});

mongoose
  .connect("mongodb+srv://purvaptl1452:Purva%401452@try1.akekdhm.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB . . . ");
  })
  .catch((err) => {
    console.log("Error in connecting to MongoDB:", err);
  });



















// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

// const router = require("./routes/user-routes");
// const msgRouter = require("./routes/message-routes");
// const paymentRouter = require("./routes/payment-routes");
// const groupRouter = require("./routes/group-routes");
// const expenseRouter = require("./routes/expense-routes");

// const Stripe = require("stripe");

// const PORT = 8000;

// const app = express();

// app.use(cors());
// const stripe = new Stripe(
//   "sk_test_51P6pcYSCdNlkqtTKEbkko3R7u9AU05pNEw9TKpeAtiEze3NmZlsWaun94sEQehiPPdlUouvIJ5d2thhp2527uaaJ00WSnKy45N"
// );

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(passport.initialize());

// app.use("/chat/user", cors(), router);

// app.use("/chat/message", cors(), msgRouter);

// app.use("/chat/payments", paymentRouter);

// app.use("/chat/group", groupRouter);

// app.use("/chat/expense", expenseRouter);

// app.listen(PORT, () => {
//   console.log(`Listening on the PORT ${PORT} . . . `);
// });

// mongoose
//   .connect("mongodb+srv://purvaptl1452:Purva%401452@try1.akekdhm.mongodb.net/")
//   .then(() => {
//     console.log("Connected to MongoDB . . . ");
//   })
//   .catch((err) => {
//     console.log("Error In connecting to MongoDb : ", err);
//   });
