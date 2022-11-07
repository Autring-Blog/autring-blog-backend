const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  id: {
    type: String,
  },
  category: {
    type: String,
    default: "google",
  },
});

//EXPORT
const GoogleUser = mongoose.model("GoogleUser", UserSchema);
module.exports = GoogleUser;
