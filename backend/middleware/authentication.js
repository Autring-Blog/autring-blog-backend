const catchAsyncError = require("./catchAsyncError");
const ErrorHandler = require('../utils/Errorhandler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');




exports.isUserAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    // console.log(token);

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    next();

});

exports.authorizeRoles = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role:${req.user.role} is not allowed to aceess this resource`, 403)
            )
        }
        next();
    };
};