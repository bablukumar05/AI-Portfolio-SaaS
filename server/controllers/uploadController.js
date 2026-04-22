const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (req, res, next) => {
  try {
    if (!process.env.CLOUD_NAME || process.env.CLOUD_NAME.includes('your_') || !process.env.API_KEY || process.env.API_KEY.includes('your_')) {
      // Mock upload for development when Cloudinary is not configured
      console.log("Mocking Cloudinary Upload due to dummy credentials.");
      return res.json({ url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded." });
    }
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return res.status(500).json(error);
        res.json({ url: result.secure_url });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    next(err);
  }
};