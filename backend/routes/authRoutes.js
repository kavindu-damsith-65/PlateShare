const express = require("express");
const { signUp, signIn, sendCode, verifyCode, passresetVerifyCode, resetPassword} = require("../controllers/authController");
const {authMiddleware} = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/signup", signUp);
router.post("/signin", signIn);

router.post('/send-code', sendCode);
router.post('/verify-code', verifyCode);
router.post('/passreset-verify-code', passresetVerifyCode);
router.post('/reset-password', authMiddleware,resetPassword);


module.exports = router;
