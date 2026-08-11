const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const { OpenAI } = require("openai");
const { logActivity } = require("../utils/activityLogger");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// GET ALL BLOGS
exports.getBlogs = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.query.userId) filter.userId = req.query.userId;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;

  const blogs = await Blog.find(filter).sort({ createdAt: -1 });
  res.json(blogs);
});

// GET BLOG BY SLUG OR ID (And Increment Views)
exports.getBlogBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(slug);
  const blog = await Blog.findOne({
    $or: [
      { slug: slug },
      ...(isObjectId ? [{ _id: slug }] : [])
    ]
  });

  if (!blog) {
    return next(new AppError("No blog found with that slug or ID", 404));
  }

  // Increment Views
  blog.views = (blog.views || 0) + 1;
  await blog.save();

  res.json(blog);
});

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
    await logActivity(req.user.id, "Blog Published", "Blog", newBlog._id, `Published new blog post: ${newBlog.title}`);
    res.json(newBlog);
  } catch (err) {
    next(err);
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = req.user.role === "admin" ? { _id: id } : { _id: id, userId: req.user.id };
    const blog = await Blog.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
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
    const query = req.user.role === "admin" ? { _id: id } : { _id: id, userId: req.user.id };
    const blog = await Blog.findOneAndDelete(query);
    if (!blog) return res.status(404).json({ msg: "Blog not found or unauthorized" });
    res.json({ msg: "Blog deleted successfully", id });
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
      return res.status(500).json({ msg: "OpenAI API Key is missing or invalid. Please configure your .env file." });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a professional tech blog writer. Output HTML formatting directly containing h2, h3, p, strong, and pre code blocks. Do not wrap it in markdown block quotes (e.g. no ```html)." },
        { role: "user", content: `Write a comprehensive, engaging, professional blog post about: ${topic}. It must be heavily structured with headers and some code examples.` }
      ],
      model: "gpt-4o-mini",
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
    if (err.status === 401) {
      return res.status(500).json({ msg: "Invalid OpenAI API Key provided. Please check your .env file." });
    }
    res.status(500).json({ msg: "Failed to generate AI content. Please try again." });
  }
};