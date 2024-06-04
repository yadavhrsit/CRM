const mongoose = require("mongoose");
const validator = require("validator");

const leadSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    query: {
      type: String,
      required: [true, "Query is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "won", "lost"],
      default: "open",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "AddedBy is required"],
    },
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
