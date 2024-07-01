const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    lowerCase: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  mobile: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    default:
      "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg",
  },
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentFriendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  balance: {
    type: Number,
    default: 0,
  },
  subscriptionType: {
    type: String,
    enum: ["Monthly", "Quarterly", "Yearly"],
    default: null,
  },
  subscriptionStartDate: {
    type: Date,
    default: null,
  },
  subscriptionEndDate: {
    type: Date,
    default: null,
  },
  fcmToken:{
    type:String,
    required:true
  }
});

userSchema.methods.markAsDeleted = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
};

userSchema.methods.recover = function () {
  this.isDeleted = false;
  this.deletedAt = null;
};

userSchema.methods.isSubscribed = function () {
  const today = new Date();
  return this.subscriptionEndDate && this.subscriptionEndDate > today;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
