const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateChat = async (message) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("xxxx")) {
    // Artificial delay to simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `*Simulated AI Response:* I received your message "${message}". I am running in mock mode. Please configure a valid OPENAI_API_KEY in your .env file to talk to the real AI!`;
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: message }]
  });

  return response.choices[0].message.content;
};

exports.generateResume = async (data) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("xxxx")) {
    return `# Generated Mock Resume\n\n**Name:** ${data.name}\n\n**Skills:** ${data.skills}\n\n**Projects:** ${data.projects}\n\n*(Add a real OpenAI API key to see the magical formatting happen!)*`;
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Create a professional resume:
        Name: ${data.name}
        Skills: ${data.skills}
        Projects: ${data.projects}`
      }
    ]
  });

  return response.choices[0].message.content;
};