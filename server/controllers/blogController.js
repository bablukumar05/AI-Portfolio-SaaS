const Blog = require("../models/Blog");
const { OpenAI } = require("openai");

// GET ALL BLOGS
exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    next(err);
  }
};

// GET BLOG BY SLUG (And Increment Views)
exports.getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    // Increment Views
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// CREATE BLOG
exports.addBlog = async (req, res, next) => {
  try {
    const newBlog = new Blog({
      ...req.body,
      userId: req.user.id // assuming authMiddleware applies
    });
    // Create base slug if not provided safely
    if (!newBlog.slug) {
      newBlog.slug = newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + "-" + Date.now();
    }
    
    await newBlog.save();
    res.json(newBlog);
  } catch (err) {
    next(err);
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body, { new: true });
    if (!blog) return res.status(404).json({ msg: "Blog not found or unauthorized" });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!blog) return res.status(404).json({ msg: "Blog not found or unauthorized" });
    res.json({ msg: "Blog deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// LIKE BLOG (Toggle logic pseudo)
exports.likeBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    blog.likes += 1;
    await blog.save();
    res.json({ msg: "Liked successfully", likes: blog.likes });
  } catch (err) {
    next(err);
  }
};

// ADD COMMENT
exports.addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    // In our authMiddleware, req.user holds the decoded token (id).
    // The request body should pass "userName" from the frontend if possible.
    const { userName = "Anonymous User" } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    blog.comments.push({ 
       userId: req.user.id, 
       userName: userName,
       text, 
       createdAt: new Date() 
    });
    
    await blog.save();
    
    res.json({ msg: "Comment added", comments: blog.comments });
  } catch (err) {
    next(err);
  }
};

// AI BLOG GENERATOR
exports.generateAIContent = async (req, res, next) => {
  try {
    const { topic } = req.body;
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('xxxxxxxx')) {
      // Mock AI generation for development when OpenAI is not configured
      console.log("Mocking OpenAI Response due to dummy credentials.");
      return res.json({
        title: `Auto-Generated Concept: ${topic}`,
        content: `<h2>Understanding ${topic}</h2><p>This is a simulated blog post because a valid OpenAI API Key has not been configured in the .env file. Once you provide a real key, this tool will generate full comprehensive articles.</p><pre><code>console.log('Mocked AI works!');</code></pre>`,
        tags: ["Mock", "AI"]
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a professional tech blog writer. Output HTML formatting directly containing h2, h3, p, strong, and pre code blocks. Do not wrap it in markdown block quotes (e.g. no ```html)." }, { role: "user", content: `Write a comprehensive, engaging, professional blog post about: ${topic}. It must be heavily structured with headers and some code examples.` }],
      model: "gpt-3.5-turbo",
    });

    const aiContent = completion.choices[0].message.content;
    const tags = [topic.split(" ")[0], "Tech", "AI"];

    res.json({
       title: `Exploring ${topic}: A Deep Dive`,
       content: aiContent,
       tags
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to generate AI content" });
  }
};