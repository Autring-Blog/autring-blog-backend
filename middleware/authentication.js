const catchAsyncError = require("./catchAsyncError");
const ErrorHandler = require("./../utils/errorHandler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.isUserAuthenticated = catchAsyncError(async (req, res, next) => {
  let token;
  if (req.cookies.autringblogtoken) {
    token = req.cookies.autringblogtoken;
  }
  // else if (
  //   req.headers.authorization ||
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // }

  if (!token) {
    return next(new ErrorHandler("You dont have a pass to access", 404));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new ErrorHandler("You are not logged in"));
  }
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ErrorHandler("You recently changed Password so login again", 404)
    );
  }
  req.user = freshUser;

  next();
});
exports.checkSocialLogin = (req, res, next) => {
  const isLoggedIn = req.isAuthenticated() && req.user;

  if (!isLoggedIn) {
    return res.status(400).json({
      status: "fail",
      error: "you must Logged in",
    });
  }

  next();
};
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role:${req.user.role} is not allowed to aceess this resource`,
          403
        )
      );
    }
    next();
  };
};
