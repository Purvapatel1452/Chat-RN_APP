const Group = require("../models/group");
const Message = require("../models/message");
const User = require("../models/user");

// const messagess = async (req, res) => {
//   try {
//     console.log("POOOOO")
//     const {
//       senderId,
//       recepientId,
//       groupId,
//       messageType,
//       messageText,
//       imageUrl,
//     } = req.body;

//     const newMessage = new Message({
//       senderId,
//       recepientId,
//       groupId,
//       messageType,
//       message: messageText,
//       timestamp: new Date(),
//       imageUrl: imageUrl,
//     });

//     await newMessage.save();
//     res.status(200).json(newMessage);
//   } catch (err) {
//     console.log("error in posting msg", err);
//     res.status(500).json({ message: "internal server error" });
//   }
// };

//endpoints to get user details in chat header bar

const userDetails = async (req, res) => {
  try {
    console.log("POOOOO")
    const { userId } = req.params;

    const user = await User.findById(userId);

    res.json(user);
  } catch (err) {
    console.log("error in retrieving user details", err);

    res.status(500).json({ message: "internal server error" });
  }
};

//endpoints to get group details in chat header bar

const groupDetails = async (req, res) => {
  try {
    console.log("POOOOO")
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("members");

    res.json(group);
  } catch (err) {
    console.log("error in retrieving user details", err);

    res.status(500).json({ message: "internal server error" });
  }
};

//endpoints to fetch messages between the users in chatroom

// const chatMessages = async (req, res) => {
//   try {
//     console.log("POOOOO")
//     console.log("qq");
//     const { senderId, recepientId, groupId } = req.body;

//     let messages;

//     if (groupId) {
//       console.log("G");
//       messages = await Message.find({ groupId }).populate(
//         "senderId",
//         "_id name"
//       );
//     } else if (senderId && recepientId) {
//       console.log("R");

//       messages = await Message.find({
//         $or: [
//           { senderId: senderId, recepientId: recepientId },
//           { senderId: recepientId, recepientId: senderId },
//         ],
//       }).populate("senderId", "_id name");
//     } else {
//       return res.status(400).json({
//         message: "Either groupId or senderId and recepientId must be provided",
//       });
//     }

//     res.json(messages);
//   } catch (err) {
//     console.log("error in retrieving messages", err);

//     res.status(500).json({ message: "internal server error" });
//   }
// };

module.exports = {
  userDetails,
  groupDetails,
};
