const NewsLetterUser = require("./../models/newsLetterUser");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.postYourName = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  const newsuser = await NewsLetterUser.create({
    name,
    email,
  });
  if (!newsuser) {
    return next(new ErrorHandler("something went wrong", 404));
  }
  res.status(200).json({
    user: {
      newsuser,
    },
  });
});
