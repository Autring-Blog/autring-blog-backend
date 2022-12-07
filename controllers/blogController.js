const Blog = require("./../models/Blog");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const multer = require("multer");
const multerS3 = require("multer-s3");
//const aws = require("aws-sdk");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
  ContentType: "image/jpeg",
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "photo-upload-banner",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      //const ext = file.mimetype.split("/")[1];
      cb(null, `user-${req.user.id}-${Date.now()}.jpeg`);
    },
  }),
});

exports.uploadBanner = upload.array("photo", 3);
exports.postBlog = catchAsyncError(async (req, res, next) => {
  const image = [...req.files];
  const url = image.map(
    (el) => `https://photo-upload-banner.s3.us-east-1.amazonaws.com/${el.key}`
  );

  const file = {
    ...req.body,
    photo: url,
  };
  // console.log(file);
  const blog = await Blog.create(file);

  if (!blog) {
    return next(new ErrorHandler("No post will created", 404));
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
    return next(new ErrorHandler("No Blog Found, Try Again..", 404));
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
    return next(new ErrorHandler("No Blog Found, Try Again..", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.updateBlog = catchAsyncError(async (req, res, next) => {
  const file = {
    ...req.body,
  };

  const blog = await Blog.findByIdAndUpdate(req.params.id, file, {
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
exports.updateBlogPhoto = catchAsyncError(async (req, res, next) => {
  const image = [...req.files];
  const url = image.map(
    (el) => `https://photo-upload-banner.s3.us-east-1.amazonaws.com/${el.key}`
  );

  const file = {
    photo: url,
  };

  const blog = await Blog.findByIdAndUpdate(req.params.id, file, {
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
