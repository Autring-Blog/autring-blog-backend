const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
  }),
  (req, res) => {
    res.status(200).json({
      status: "success",
      message: "okk",
    });
    console.log("google called us back");
  }
);

router.get("/auth/logout", (req, res) => {
  req.logout();
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });

  return res.redirect("/");
});

router.get("/failure", (req, res) => {
  return res.send("something went wrong");
});

module.exports = router;
