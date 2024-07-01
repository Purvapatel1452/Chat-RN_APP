const express = require("express");
const {
  userDetails,
  groupDetails,
} = require("../controllers/message-controller");
const authMiddleware = require("../middleware/authMiddleware");

const msgRouter = express.Router();
console.log("MSSGGGSSSS")
msgRouter.use(authMiddleware);


// msgRouter.post("/sendMessages", messagess);

msgRouter.get("/user/:userId", userDetails);

msgRouter.get("/group/:groupId", groupDetails);

// msgRouter.post("/messages", chatMessages);


module.exports = msgRouter;



