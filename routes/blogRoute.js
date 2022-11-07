const express = require("express");
const blogController = require("../controllers/blogController");
const authenticated = require("../middleware/authentication");

const router = express.Router();

router
  .get(
    "/getallblog",
    authenticated.isUserAuthenticated,
    authenticated.authorizeRoles("admin"),
    blogController.getAllBlog
  )
  .post(
    "/postablog",
    authenticated.isUserAuthenticated,
    authenticated.authorizeRoles("admin"),
    blogController.uploadBanner,
    blogController.postBlog
  );

router
  .get(
    "/getablog/:id",
    authenticated.isUserAuthenticated,
    blogController.getPerticularBlog
  )
  .patch(
    "/updateblog/:id",
    authenticated.isUserAuthenticated,
    authenticated.authorizeRoles("admin"),
    blogController.updateBlog
  );
router.delete(
  "/deleteblog/:id",
  authenticated.isUserAuthenticated,
  authenticated.authorizeRoles("admin"),
  blogController.deleteOne
);
///social protected Route
router.get(
  "/getblog/:id",
  authenticated.checkSocialLogin,
  blogController.getPerticularBlog
);

module.exports = router;
