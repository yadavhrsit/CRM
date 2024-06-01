const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    followDate: {
      type: Date,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
      maxlength: 700,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

const FollowUp = mongoose.model("FollowUp", followUpSchema);

module.exports = FollowUp;
