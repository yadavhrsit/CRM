const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Please enter a username"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Please enter your mobile number"],
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    status: {
      type: String,
      enum: ["enabled", "disabled"],
      default: "enabled",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("username") || this.isNew) return next();

  this.username = this.username.toLowerCase();

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
