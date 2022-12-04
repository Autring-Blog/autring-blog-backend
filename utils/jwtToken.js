//creating token and saving in cookie

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  //options for cookie

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };
  user.password = undefined;
  res.status(statusCode).cookie("autringblogtoken", token, options).json({
    success: true,
    token,
    user,
  });
};
module.exports = sendToken;
