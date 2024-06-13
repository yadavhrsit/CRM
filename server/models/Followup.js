const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: [true, "Lead is required"],
    },
    followDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return value >= today; // Ensure follow-up date is not in the past
        },
        message: "Follow-up date cannot be in the past",
      },
    },
    remarks: {
      type: String,
      required: [true, "Remarks are required"],
      maxlength: [700, "Remarks cannot exceed 700 characters"],
      minlength: [10, "Remarks must have at least 10 characters"],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Added By is required"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assigned To is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["open", "closed"],
        message: 'Status must be either "open" or "closed"',
      },
      default: "open",
    },
  },
  { timestamps: true }
);

const FollowUp = mongoose.model("FollowUp", followUpSchema);

module.exports = FollowUp;
