const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const bcrypt = require('bcryptjs');
const sendToken = require('../utils/jwtToken');



/****************************************************REGISTER USER ****************************************************************/
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password
    })
    sendToken(user, 201, res);
})


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
        return res.status(400).json({ success, 'error': "Please Enter correct Credentials" });
    }
    sendToken(user, 200, res);
});

