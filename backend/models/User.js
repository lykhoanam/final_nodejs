const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: false },
    province: { type: String, required: false },
    district: { type: String, required: false },
    ward: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    imageUrl: { type: String, default: "" },
    otp: { type: String, default: null }, 
    otpExpiresAt: { type: Date, default: null }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
