const express = require("express");
const router = express.Router();
const { registerUser, loginUser, googleLogin, sendOTP, verifyOTP, resetPassword, uploadImage } = require("../controllers/authController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/google-login", googleLogin);

router.post("/send-otp", sendOTP); 

router.post("/verify-otp", verifyOTP); 

router.post("/reset-password", resetPassword);

router.post("/upload-image", uploadImage)

module.exports = router;
