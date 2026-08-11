const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateChatStream = async function* (messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("xxxx")) {
    throw new Error("OpenAI API Key is missing or invalid. Please configure your .env file.");
  }

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
    stream: true,
  });

  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta?.content) {
      yield chunk.choices[0].delta.content;
    }
  }
};

exports.generateResume = async (data) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("xxxx")) {
    throw new Error("OpenAI API Key is missing or invalid. Please configure your .env file.");
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

exports.generateSEOTags = async (portfolioData) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("xxxx")) {
    console.warn("⚠️ OpenAI API Key is missing. Using DEMO fallback for SEO tags.");
    return {
      title: "Full Stack Developer Portfolio | Innovative Web Solutions",
      description: "Explore the professional portfolio of a passionate developer specializing in MERN stack, UI/UX design, and AI integrations.",
      keywords: "developer, portfolio, react, nodejs, fullstack, innovator"
    };
  }

  const prompt = `You are an SEO expert. Based on the following portfolio content, generate a highly optimized SEO Title, Meta Description, and a list of target Keywords.
  Portfolio Data:
  ${JSON.stringify(portfolioData)}
  
  Return ONLY a valid JSON object:
  {
    "title": "...",
    "description": "...",
    "keywords": "keyword1, keyword2, keyword3"
  }`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

exports.analyzeResume = async (resumeText) => {
  const prompt = `You are an expert HR and Career Coach. Analyze the following resume text and provide:
  1. Strengths
  2. Areas for improvement
  3. Skill gaps for a modern tech role
  4. Overall score (1-10)
  
  Resume Text:
  ${resumeText}
  
  Return ONLY a valid JSON object:
  {
    "strengths": ["..."],
    "improvements": ["..."],
    "skillGaps": ["..."],
    "score": 0
  }`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

exports.reviewPortfolio = async (portfolioData) => {
  const prompt = `You are a Senior Design and Technical Reviewer. Review the following portfolio data and provide:
  1. Design feedback
  2. Content clarity feedback
  3. Professionalism assessment
  4. Suggested additions
  
  Portfolio Data:
  ${JSON.stringify(portfolioData)}
  
  Return ONLY a valid JSON object:
  {
    "designFeedback": "...",
    "contentFeedback": "...",
    "professionalism": "...",
    "suggestions": ["..."]
  }`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

exports.generateInterviewQuestions = async (portfolioData) => {
  const prompt = `You are a Senior Technical Interviewer. Based on the following portfolio data, generate 5 challenging technical interview questions.
  1. Questions should target the specific projects and skills mentioned.
  2. For each question, provide a "Model Answer" and "Key Concepts to Mention".
  
  Portfolio: ${JSON.stringify(portfolioData)}
  
  Return ONLY a valid JSON object:
  {
    "questions": [
      {
        "question": "...",
        "modelAnswer": "...",
        "keyConcepts": ["..."]
      }
    ]
  }`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

exports.translatePortfolio = async (portfolioData, targetLanguage) => {
  const prompt = `Translate the following professional portfolio data into ${targetLanguage}.
  1. Maintain the professional tone and technical accuracy.
  2. Keep all keys the same, only translate the values.
  
  Data: ${JSON.stringify(portfolioData)}
  
  Return only the JSON object.`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

exports.generateVideoPortfolioScript = async (portfolioData) => {
  const prompt = `You are a scriptwriter for high-end tech commercials. Create a 30-45 second script for a "Portfolio Video Intro" based on this data:
  ${JSON.stringify(portfolioData)}
  
  Format it with:
  1. [Scene Description]
  2. [Voiceover Text]
  3. [Visual Overlay Text]
  
  Make it punchy, professional, and personality-driven.
  Return only a JSON object: { "script": [ { "scene": "...", "vo": "...", "visual": "..." } ] }`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

exports.generateFullPortfolio = async (resumeText) => {
  const prompt = `You are an expert Portfolio Architect. Based on the following resume, generate a complete portfolio structure.
  1. Analyze experience level and industry.
  2. Select the best design theme (cyberpunk, minimal, professional, vibrant).
  3. Generate content for Hero, About, Projects, and Skills sections.
  
  Resume: ${resumeText}
  
  Return ONLY a valid JSON object:
  {
    "design": { "theme": "...", "font": "..." },
    "sections": [
      { "type": "hero", "data": { "title": "...", "subtitle": "..." } },
      { "type": "about", "data": { "content": "..." } },
      { "type": "projects", "data": { "projects": [...] } },
      { "type": "skills", "data": { "skills": [...] } }
    ]
  }`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

exports.suggestDesign = async (industry, experienceLevel) => {
  const prompt = `Suggest a professional portfolio design (theme, font, primary color) for a ${experienceLevel} in the ${industry} industry.
  
  Return ONLY a JSON object:
  {
    "theme": "...",
    "font": "...",
    "primaryColor": "...",
    "layoutSuggestion": "..."
  }`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

exports.generateCareerAdvice = async (skills, targetRole) => {
  const prompt = `Analyze these skills: ${skills.join(", ")}.
  Provide advice for reaching a ${targetRole} role. 
  Include skill gaps, suggested certifications, and job search keywords.
  
  Return ONLY a JSON object:
  {
    "skillGaps": ["..."],
    "certifications": ["..."],
    "keywords": ["..."],
    "advice": "..."
  }`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};
