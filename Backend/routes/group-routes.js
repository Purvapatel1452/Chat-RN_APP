const express = require("express");
const {
  createGroup,
  getAllGroups,
  fetchGroupPaymentStatus,
  uploadGroupImage,
  editGroupDetails,
} = require("../controllers/group-controller");
const authMiddleware = require("../middleware/authMiddleware");

const groupRouter = express.Router();

groupRouter.use(authMiddleware); 


groupRouter.post("/createGroup", createGroup);

groupRouter.get("/groups/:userId", getAllGroups);

groupRouter.get('/groupPaymentStatus/:userId', fetchGroupPaymentStatus);

groupRouter.post('/uploadGroupImage', uploadGroupImage);

groupRouter.put('/editGroup/:groupId', editGroupDetails);

module.exports = groupRouter;





