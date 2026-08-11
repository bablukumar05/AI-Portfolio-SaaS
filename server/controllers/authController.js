const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const { logActivity } = require("../utils/activityLogger");
const { sendOTPEmail, sendPasswordResetOTPEmail } = require("../utils/emailService");
const { v4: uuidv4 } = require("uuid");

exports.generateAPIKey = async (req, res, next) => {
  try {
    const apiKey = uuidv4();
    const apiSecret = uuidv4(); // In reality, you'd hash this or use a different strategy

    await User.findByIdAndUpdate(req.user.id, {
      apiKey,
      apiSecret
    });

    res.json({ success: true, apiKey, apiSecret });
  } catch (err) { next(err); }
};

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res, next) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

    const hashed = await bcrypt.hash(req.body.password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      name: req.body.name,
      email,
      password: hashed,
      otp,
      otpExpires,
      isVerified: false
    });

    await user.save();

    try {
      // Send OTP via email
      await sendOTPEmail(user.email, otp);
    } catch (emailErr) {
      // Rollback database record if verification email fails to send
      await User.deleteOne({ _id: user._id });
      throw emailErr;
    }

    res.json({
      msg: "OTP sent to your email. Please verify to complete signup.",
      email: user.email
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    const otp = req.body.otp;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.isVerified) return res.status(400).json({ msg: "Email is already verified" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    await logActivity(user._id, "Email Verified", "Auth", user._id, "User successfully verified their email.");

    res.json({
      msg: "Email verified successfully. You can now login.",
      token: generateToken(user._id)
    });
  } catch (err) {
    next(err);
  }
};

exports.resendOTP = async (req, res, next) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.isVerified) return res.status(400).json({ msg: "Email is already verified" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(user.email, otp);

    res.json({ msg: "New OTP sent to your email." });
  } catch (err) {
    next(err);
  }
};

const { authenticator } = require("otplib");
const qrcode = require("qrcode");

// ... (previous helper functions)

exports.enable2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const secret = authenticator.generateSecret();
    const otpauthPath = authenticator.keyuri(user.email, "AI-Portfolio-SaaS", secret);

    user.twoFactorSecret = secret;
    await user.save();

    const qrCodeUrl = await qrcode.toDataURL(otpauthPath);
    res.json({ qrCodeUrl, secret });
  } catch (err) { next(err); }
};

exports.verify2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id);

    const isValid = authenticator.check(token, user.twoFactorSecret);
    if (!isValid) return res.status(400).json({ msg: "Invalid 2FA token" });

    user.isTwoFactorEnabled = true;
    await user.save();

    res.json({ msg: "2FA enabled successfully" });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(401).json({ msg: "Invalid credentials" });

    if (!user.isVerified) {
      // ... (existing verification logic)
      return res.status(403).json({ msg: "Email not verified", unverified: true, email: user.email });
    }

    // Check if 2FA is enabled
    if (user.isTwoFactorEnabled) {
      return res.json({
        msg: "2FA required",
        twoFactorRequired: true,
        userId: user._id
      });
    }

    user.lastLogin = new Date();
    await user.save();

    await logActivity(user._id, "User Login", "Auth", user._id, "User logged into the system.");
    res.json({ token: generateToken(user._id) });
  } catch (err) { next(err); }
};

exports.verify2FALogin = async (req, res, next) => {
  try {
    const { userId, token } = req.body;
    const user = await User.findById(userId);

    const isValid = authenticator.check(token, user.twoFactorSecret);
    if (!isValid) return res.status(400).json({ msg: "Invalid 2FA token" });

    user.lastLogin = new Date();
    await user.save();

    res.json({ token: generateToken(user._id) });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.profilePicture !== undefined) user.profilePicture = req.body.profilePicture;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();

    await logActivity(user._id, "Profile Updated", "User", user._id, "User modified their profile settings.");

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User with this email address was not found" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpires;
    await user.save();

    await sendPasswordResetOTPEmail(user.email, otp);

    res.json({ msg: "Password reset OTP sent to your email." });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    const { otp, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp || !user.resetPasswordOtpExpires || user.resetPasswordOtpExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    await logActivity(user._id, "Password Reset", "Auth", user._id, "User successfully reset their password via OTP.");

    res.json({ msg: "Password reset successfully. You can now login with your new password." });
  } catch (err) {
    next(err);
  }
};
