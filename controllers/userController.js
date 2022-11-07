const User = require("../models/User");

const ErrorHandler = require("../utils/errorHandler");
const { promisify } = require("util");
const catchAsyncError = require("../middleware/catchAsyncError");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwtToken");
dotenv.config({ path: "backend/config/config.env" });
const filterObj = (obj, ...alloweFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (alloweFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/****************************************************REGISTER USER ****************************************************************/
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  sendToken(user, 201, res);
});

/*******************************************************************LOGIN ************************************************ */
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  // console.log(user);
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    success = false;
    return res
      .status(400)
      .json({ success, error: "Please Enter correct Credentials" });
  }

  sendToken(user, 200, res);
});
exports.updateMe = catchAsyncError(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new ErrorHandler("this route is not for password update"));
  }
  const filteredBody = filterObj(req.body, "name", "email");
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runvalidators: true,
  });
  sendToken(updateUser, 200, res);
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  // get the user
  const user = await User.findById(req.user.id).select("+password");

  // check posted password is correct

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new ErrorHandler("Your Password is wrong", 404));
  }
  //update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  sendToken(user, 200, res);
});
exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    new ErrorHandler("No Blog Found, Try Again..", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});
