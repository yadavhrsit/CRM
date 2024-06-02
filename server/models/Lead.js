const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    name: String,
    email: String,
    mobile: String,
    query: String,
    status: {
      type: String,
      enum: ["open", "won", "loss"],
      default: "open",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // assignedTo: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
    followUps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FollowUp",
      },
    ],
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
