const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
dotenv.config({ path: 'backend/config/config.env' });



const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your Name"],
        maxlength: [30, "Name cannot exceed 30 character "],
        minlength: [3, "Name needs to be atleast 3 character "]
    },
    email: {
        type: String,
        required: [true, "Please enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter correct email"]
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password Should be minimum 8 characters"],
        select: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

UserSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}




//EXPORT
const User = mongoose.model('user', UserSchema);
module.exports = User