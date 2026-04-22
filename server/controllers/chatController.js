const { generateChat } = require("../services/openaiService");

exports.chat = async (req, res, next) => {
  try {
    const reply = await generateChat(req.body.message);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
};