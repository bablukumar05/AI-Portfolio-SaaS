const Message = require("../models/Message");
const nodemailer = require("nodemailer");

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: "Please fill in all fields." });
    }

    // 1. Save message to Database
    const newMessage = await Message.create({ name, email, message });

    // 2. Setup Nodemailer Transporter
    let transporter;

    // Use environment variables if provided, otherwise use Ethereal for testing
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: "gmail", // Assuming Gmail, configure as needed
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Generate test account automatically
      console.log("No EMAIL_USER found in .env. Falling back to Ethereal Email for testing.");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    // 3. Send Email
    const mailOptions = {
      from: `"${name}" <${email}>`, // sender address
      to: process.env.EMAIL_USER || "youremail@example.com", // receiver
      subject: `New Portfolio Message from ${name}`, // Subject line
      text: message, // plain text body
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `, // html body
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    
    // If using Ethereal, log the preview URL
    if (!process.env.EMAIL_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    res.status(200).json({ msg: "Message sent successfully!", data: newMessage });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ msg: "Failed to send message. Please try again later." });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch messages" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ msg: "Message not found" });
    res.json({ msg: "Message deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete message" });
  }
};

