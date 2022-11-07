const Blog = require("./../models/Blog");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const multer = require("multer");

const multerStroge = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    //cb(null, `user-${Date.now()}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("wrong file format upload"), false);
  }
};
const upload = multer({
  storage: multerStroge,
  fileFilter: multerFilter,
});

exports.uploadBanner = upload.single("photo");

exports.postBlog = catchAsyncError(async (req, res, next) => {
  const file = {
    ...req.body,
    photo: req.file.filename,
  };

  const blog = await Blog.create(file);

  if (!blog) {
    new ErrorHandler("No post will created", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});
exports.getAllBlog = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.find();

  if (!blog) {
    new ErrorHandler("No Blog Found, Try Again..", 404);
  }

  res.status(200).json({
    status: "success",
    numberofblog: blog.length,
    data: {
      blog,
    },
  });
});
exports.getPerticularBlog = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    new ErrorHandler("No Blog Found, Try Again..", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.updateBlog = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) {
    return next(new ErrorHandler("No document find with this Id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});
exports.deleteOne = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    return next(
      new ErrorHandler("There is No document found with this id", 404)
    );
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
