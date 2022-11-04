const express = require('express');
const { createBlog, getAllBlogs, getBlogDetails, updateBlog, deleteBlog } = require('../controllers/blogController');
const { isUserAuthenticated, authorizeRoles } = require('../middleware/authentication');
const router = express.Router();




router.route("/admin/createBlog").post(isUserAuthenticated, authorizeRoles("admin"), createBlog);
router.route("/blogs").get(isUserAuthenticated, getAllBlogs);
router.route("/blogs/:id").get(isUserAuthenticated, getBlogDetails).put(isUserAuthenticated, updateBlog).delete(isUserAuthenticated, deleteBlog)
module.exports = router
