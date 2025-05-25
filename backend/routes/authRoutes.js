const express = require("express");
const { signUp, signIn, sendCode, verifyCode} = require("../controllers/authController");

const router = express.Router();
router.post("/signup", signUp);
router.post("/signin", signIn);

router.post('/send-code', sendCode);
router.post('/verify-code', verifyCode);

module.exports = router;
