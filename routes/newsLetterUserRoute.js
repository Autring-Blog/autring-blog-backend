const express = require("express");
const newsLetterUserController = require("../controllers/newsLetterUserController");

const router = express.Router();

router.post("/newsletteruser", newsLetterUserController.postYourName);

module.exports = router;
