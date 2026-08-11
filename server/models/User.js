const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "employee"], default: "user" },
    subscriptionPlan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
    profilePicture: { type: String },
    bio: { type: String },
    profileViews: { type: Number, default: 0 },
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    resetPasswordOtp: { type: String },
    resetPasswordOtpExpires: { type: Date },
    twoFactorSecret: { type: String },
    isTwoFactorEnabled: { type: Boolean, default: false },
    lastLogin: { type: Date },
    activeDevices: [{
      deviceId: { type: String },
      browser: { type: String },
      os: { type: String },
      lastActive: { type: Date }
    }],
    apiKey: { type: String, unique: true, sparse: true },
    apiSecret: { type: String },
    securityLog: [{
      ip: { type: String },
      timestamp: { type: Date, default: Date.now }
    }],
    referralToken: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
