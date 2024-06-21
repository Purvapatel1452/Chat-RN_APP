const express = require("express");
const {
  userDetails,
  chatMessages,
  groupDetails,
  messagess,
} = require("../controllers/message-controller");
const authMiddleware = require("../middleware/authMiddleware");

const msgRouter = express.Router();

msgRouter.use(authMiddleware);


msgRouter.post("/sendMessages", messagess);

msgRouter.get("/user/:userId", userDetails);

msgRouter.get("/group/:groupId", groupDetails);

msgRouter.post("/messages", chatMessages);


module.exports = msgRouter;



