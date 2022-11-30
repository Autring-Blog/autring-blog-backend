const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
dotenv.config({ path: "backend/config/config.env" });

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name"],
    maxlength: [30, "Name cannot exceed 30 character "],
    minlength: [3, "Name needs to be atleast 3 character "],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter correct email"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password Should be minimum 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Please confirm your password",
    },
  },
  phone: {
    type: Number,
  },

  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
});
UserSchema.methods.changedPasswordAfter = function (JwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JwtTimeStamp < changedTimeStamp;
  }
  return false;
};
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//EXPORT
const User = mongoose.model("User", UserSchema);
module.exports = User;
