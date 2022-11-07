const express = require("express");
const userController = require("../controllers/userController");
const authenticated = require("./../middleware/authentication");
const router = express.Router();

router.post("/signup", userController.registerUser);
router.post("/login", userController.loginUser);
//router.get("/getablog/:id", googleAuth.checkLogin, blogController.getBlog);

router
  .get(
    "/getalluser",
    authenticated.isUserAuthenticated,
    userController.getAllUser
  )
  .patch(
    "/updateme",
    authenticated.isUserAuthenticated,
    userController.updateMe
  )
  .patch(
    "/updatepassword",
    authenticated.isUserAuthenticated,
    userController.updatePassword
  );
module.exports = router;
