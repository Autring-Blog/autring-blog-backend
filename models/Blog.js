const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  photo: [String],
  mainHeading: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  inPhotoTitle: {
    type: String,
  },
  paragraphDescription: {
    type: String,
  },
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
