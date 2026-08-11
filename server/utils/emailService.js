const nodemailer = require("nodemailer");
const logger = require("./logger");

const sendOTPEmail = async (email, otp) => {
  // If SMTP credentials are not configured (e.g. in dev), print OTP to console and succeed.
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.info("-----------------------------------------");
    logger.info(`[DEV MODE] Verification OTP for ${email}: ${otp}`);
    logger.info("-----------------------------------------");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"AI Portfolio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; rounded: 10px;">
        <h2 style="color: #4A90E2; text-align: center;">Verify Your Email</h2>
        <p>Your one-time password (OTP) for AI Portfolio is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${otp}</span>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 AI Portfolio SaaS. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};

const sendPasswordResetOTPEmail = async (email, otp) => {
  // If SMTP credentials are not configured (e.g. in dev), print OTP to console and succeed.
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.info("-----------------------------------------");
    logger.info(`[DEV MODE] Password Reset OTP for ${email}: ${otp}`);
    logger.info("-----------------------------------------");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"AI Portfolio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password - AI Portfolio OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #6366F1; text-align: center;">Reset Your Password</h2>
        <p>You requested to reset your password for your AI Portfolio account. Your verification code (OTP) is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${otp}</span>
        </div>
        <p>This OTP will expire in 10 minutes. If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 AI Portfolio SaaS. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset OTP email");
  }
};

module.exports = { sendOTPEmail, sendPasswordResetOTPEmail };
