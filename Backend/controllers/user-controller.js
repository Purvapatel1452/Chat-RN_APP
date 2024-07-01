const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const OTPData = require("../models/otpData");
const Expense = require("../models/expense");

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "purvanpatel1452@gmail.com",
    pass: "mmjy ylca gnci ouqv",
  },
});

function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: "purvanpatel1452@gmail.com",
    to: email,
    subject: "OTP Verificaton for Expense Hive",
    text: `${otp} is your One-Time-Password for Expense Hive app Email verification.
        
              Your OTP code is valid for only 2 min.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error in sending mail", error);
      res.status(500).send("Error sending OTP email");
    } else {
      console.log("OTP email sent successfully:", info.response);
      res.send("OTP sent succesfully, please check your email");
    }
  });
}

//creating a Token
const createToken = (userId) => {
  const payload = {
    userId: userId,
  };

  const token = jwt.sign(payload, "Purv@ p@tel", { expiresIn: "1h" });

  return token;
};

//registering user
const registerUser = async (req, res) => {
  const { name, email, mobile, password, fcmToken } = req.body;

  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    return res.status(400).json({ message: "User alredy exist" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  //create new user

  const newUser = await User({
    name,
    email,
    mobile,
    password: encryptedPassword,
    fcmToken
  });

  //save the user to the db

  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User registered Successfully" });
    })
    .catch((err) => {
      console.log("error in registering", err);
      res.status(500).json({ message: "Error in registering" });
    });
};

//verify Mobile no through OTP

const sendOtp = async (req, res) => {
  const { email } = req.body;

  const existingOtpData = await OTPData.findOne({ email });

  if (existingOtpData && existingOtpData.expiryTime > new Date()) {
    console.log("ALREady");

    return res
      .status(400)
      .send(
        "An Otp is already sent to this email. Please wait before requesting another OTP"
      );
  }

  const otp = generateOtp();
  const expiryTime = new Date(Date.now() + 2 * 60 * 1000);

  await OTPData.findOneAndUpdate(
    { email },
    { otp, expiryTime },
    { upsert: true }
  );

  sendOtpEmail(email, otp);

  res.send("OTP sent successfully, please check your email");
};

const verifyOtp = async (req, res) => {
  console.log("veofy");
  const { email, otp } = req.body;

  const otpData = await OTPData.findOne({ email });

  if (!otpData || otpData.expiryTime < new Date()) {
    return res
      .status(400)
      .send("OTP expired or not found. Please request a new OTP");
  }

  if (otpData.otp !== otp) {
    return res.status(400).send("Invalid OTP");
  }

  await OTPData.deleteOne({ email });

  res.send("OTP verified successfully");
};

//login user
const loginUser = async (req, res) => {
  console.log("hii");
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "email and password both are required" });
  }

  await User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        console.log("ERR");
        return res.status(404).json({ message: "User not Found !!!" });
      }

      if (user.deletedAt) {
        return res.status(401).json({ message: "Account is soft deleted" });
      }

      if (await bcrypt.compare(password, user.password)) {
        const token = createToken(user._id);
        if (res.status(201)) {
          return res.send({ status: "ok", data: token });
        } else {
          return res.status(404).json({ message: "Invalid Password" });
        }
      } else {
        return res.status(404).json({ message: "Invalid Password !!!" });
      }
    })
    .catch((err) => {
      console.log("error in findng the User:", err);

      res.status(500).json({ message: "Internal Server Error" });
    });
};

const uploadImage = async (req, res) => {
  const { userId, imageUrl } = req.body;

  if (!userId || !imageUrl) {
    return res
      .status(400)
      .json({ message: "User ID and image URL are required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.image = imageUrl;
    await user.save();

    res.status(200).json({ message: "Image updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    console.log("++",req.body);
    const {userId}  = req.body;
    console.log("++", userId);
    const details = await User.findById(userId);

    res.status(200).json(details);
  } catch (error) {
    console.log("internal server error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//get all users except the user id that is currently logged in

const getUsers = async (req, res) => {
  try {
    const userId = req.params.userId;

    const currentUser = await User.findById(userId).populate("friends");

    const friendIds = currentUser.friends.map((friend) => friend._id);

    const users = await User.find({
      _id: { $ne: userId, $nin: friendIds },
    });

    res.status(200).json(users);
  } catch (error) {
    console.log("internal server error", error);
    res.status(500).json({ error: "internal server error" });
  }
};

//posting friend request and updating it in the both the users arrays

const friendRequest = async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    const currentUser = await User.findById(currentUserId);

    if (currentUser.sentFriendRequests.includes(selectedUserId)) {
      console.log("ALredy sent");
      return res.status(400).send({ message: "Friend Request already sent" });
    } else if (currentUser.friends.includes(selectedUserId)) {
      console.log("ALredy friend");
      return res.status(400).send({ message: "Already a Friend !!!" });
    }

    //updating recepient's friendRequestArray
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequests: currentUserId },
    });

    //updating sender's sentRequest Array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (err) {
    console.log("error in sending Request", err);
    res.sendStatus(500);
  }
};

//endpoint to show all friend requests of the particular user

const friendRequestList = async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);

  try {
    const user = await User.findById(userId)
      .populate("friendRequests", "name email image")
      .lean();

    const friendRequests = user.friendRequests;

    res.status(200).json(friendRequests);
  } catch (err) {
    console.log("ERROR HANDLING", err);

    res.status(500).json({ message: "errror in retrieving" });
  }
};

//endpoints to accept the friend requests and to navigate to the chat directly

const acceptFriendRequest = async (req, res) => {
  try {
    console.log("R");
    const { senderId, recepientId } = req.body;
    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    sender.friends.push(recepientId);
    recepient.friends.push(senderId);

    recepient.friendRequests = recepient.friendRequests.filter((request) => {
      request.toString() != senderId.toString();
    });

    sender.sentFriendRequests = sender.sentFriendRequests.filter((request) => {
      request.toString() != recepientId.toString();
    });

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "friend request accepted successfully" });
  } catch (err) {
    console.log("Errror in retrievinfg request", err);
    res.status(500).json({ message: "Error not fount any request" });
  }
};

//endpoint to get all friends of the logged in user

const friends = async (req, res) => {
  try {
    console.log("E");
    const { userId } = req.params;
    console.log(userId);
    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );

    const acceptedFriends = user.friends;

    res.status(200).json(acceptedFriends);
  } catch (err) {
    console.log("Error in retrieving friends", err);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

const friendsPaymentStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("friends");

    const acceptedFriends = user.friends;
    const friendsWithPendingPaytmets = [];

    for (const friend of acceptedFriends) {
      const expenses = await Expense.find({
        $or: [
          {
            payerId: userId,
            "payments.participant": friend._id,
            "payments.paid": false,
          },
          {
            payerId: friend._id,
            "payments.participant": userId,
            "payments.paid": false,
          },
        ],
      });

      let friendOwesMe = 0;
      let iOweFriend = 0;

      expenses.forEach((expense) => {
        expense.payments.forEach((payment) => {
          if (
            payment.participant._id.toString() === friend._id.toString() &&
            expense.payerId._id.toString() === userId &&
            !payment.paid
          ) {
            friendOwesMe += payment.amount;
          } else if (
            payment.participant._id.toString() === userId &&
            expense.payerId._id.toString() === friend._id.toString() &&
            !payment.paid
          ) {
            iOweFriend += payment.amount;
          }
        });
      });

      friendsWithPendingPaytmets.push({
        friendId: friend._id,
        friendOwesMe,
        iOweFriend,
      });
    }

    res.status(200).json(friendsWithPendingPaytmets);
  } catch (error) {
    console.log("Error in internal server", error);
    res.status(500).json({ error: "internal server error" });
  }
};

// Update user profile
const editProfile = async (req, res) => {
  const { userId, name, mobile } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.mobile = mobile || user.mobile;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const softDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.markAsDeleted();
    await user.save();

    res.status(200).json({ message: "User account has been soft deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const recoverUser = async (req, res) => {
  try {
    console.log("RECOVER");
    const { email, password } = req.body;
    console.log(email, password, "DD");
    const user = await User.findOne({ email });
    console.log(user, "++");

    if (!user || !user.isDeleted) {
      return res.status(404).json({ message: "User not found or not deleted" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(isPasswordValid, "PASSWORD VALID");

    const deletionDate = new Date(user.deletedAt);
    const currentDate = new Date();
    const daysDifference = Math.floor(
      (currentDate - deletionDate) / (1000 * 60 * 60 * 24)
    );
    console.log(daysDifference, "PASSWORD VALID");

    if (daysDifference > 30) {
      return res.status(400).json({ message: "Recovery period has expired" });
    }

    user.recover();
    await user.save();

    res.status(200).json({ message: "User account has been recovered" });
  } catch (error) {
    console.log(error, "ERROR");
    res.status(500).json({ message: "Server error", error });
  }
};

// Permanently delete users past recovery period
const deleteExpiredUsers = async () => {
  try {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 30);

    await User.deleteMany({
      isDeleted: true,
      deletedAt: { $lt: expirationDate },
    });

    console.log("Expired users have been permanently deleted");
  } catch (error) {
    console.error("Error deleting expired users:", error);
  }
};

const getUserSubscription = async (req, res) => {
  try {
    console.log("getsub");
    const user = await User.findById(req.params.userId);
    console.log(user, "USER");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const setSubscription = async (req, res) => {
  try {
    console.log("SSSUBBBB");
    const { userId, subscriptionType } = req.body;
    console.log(userId, subscriptionType);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    let endDate;

    console.log(today, "TODAT");

    switch (subscriptionType) {
      case "Monthly":
        endDate = new Date(today.setMonth(today.getMonth() + 1));
        break;
      case "Quarterly":
        endDate = new Date(today.setMonth(today.getMonth() + 3));
        break;
      case "Yearly":
        endDate = new Date(today.setFullYear(today.getFullYear() + 1));
        break;
      default:
        return res.status(400).json({ message: "Invalid subscription type" });
    }
    console.log(user, ":::::::");

    user.subscriptionType = subscriptionType;
    user.subscriptionStartDate = new Date();
    user.subscriptionEndDate = endDate;
    console.log(user, "LLLLLLLLLLLLL");

    await user.save();

    res.json({ message: "Subscription updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserDetails,
  getUsers,
  friendRequest,
  friendRequestList,
  acceptFriendRequest,
  friends,
  friendsPaymentStatus,
  sendOtp,
  verifyOtp,
  uploadImage,
  editProfile,
  softDeleteUser,
  recoverUser,
  deleteExpiredUsers,
  getUserSubscription,
  setSubscription,
};
