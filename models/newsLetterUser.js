const mongoose = require("mongoose");
const validator = require("validator");
const newsLetterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter correct email"],
  },
  content: {
    type: String,
  },
});

const NewsLetterUser = mongoose.model("NewsLetter", newsLetterSchema);
module.exports = NewsLetterUser;
