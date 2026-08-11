const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded." });
    }

    if (!process.env.CLOUD_NAME || process.env.CLOUD_NAME.includes('your_') || !process.env.API_KEY || process.env.API_KEY.includes('your_')) {
      // Mock upload for development when Cloudinary is not configured: convert buffer to base64
      console.log("Mocking Cloudinary Upload due to dummy credentials. Returning base64.");
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const mimeType = req.file.mimetype;
      return res.json({ url: `data:${mimeType};base64,${b64}` });
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