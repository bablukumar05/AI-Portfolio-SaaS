const { generateChatStream } = require("../services/openaiService");
const Portfolio = require("../models/Portfolio");

exports.chat = async (req, res, next) => {
  try {
    const { messages } = req.body;

    // Fetch user portfolio context if logged in
    let context = "";
    if (req.user) {
      const portfolio = await Portfolio.findOne({ userId: req.user.id });
      if (portfolio) {
        context = `The user's portfolio contains these sections: ${JSON.stringify(portfolio.sections)}. 
        Use this information to answer questions about their work, skills, and background. 
        Keep your tone professional and helpful as a career assistant.`;
      }
    }

    // Prepend system message with context
    const systemMessage = {
      role: "system",
      content: `You are an AI Portfolio Assistant. ${context}`
    };

    const messagesWithContext = [systemMessage, ...messages];

    // Set headers for SSE (Server-Sent Events) or chunked transfer
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Get the stream generator
    const stream = await generateChatStream(messagesWithContext);

    for await (const chunk of stream) {
      // Write each chunk as an SSE message
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Chat streaming error:", err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
};