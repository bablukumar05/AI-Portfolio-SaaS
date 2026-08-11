const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");
const Project = require("./models/Project");
const Blog = require("./models/Blog");
const Portfolio = require("./models/Portfolio");

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database. Seeding data...");

    const email = "hello@aiportfolio.com";
    const password = "password123";

    // 1. Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = new User({
        name: "Alex Developer",
        email,
        password: hashedPassword,
        role: "user",
        bio: "Senior Full Stack Engineer specializing in AI & React",
        profileViews: 1245,
        isVerified: true
      });
      await user.save();
      console.log(`Created new user: ${email} (Password: ${password})`);
    } else {
      console.log(`Found existing user: ${email}`);
    }

    const userId = user._id;

    // 2. Clear old data for this user to avoid duplicates
    await Project.deleteMany({ userId });
    await Blog.deleteMany({ userId });
    await Portfolio.deleteMany({ userId });

    // 3. Seed Projects
    const projects = [
      {
        userId,
        title: "Nexus - AI Task Manager",
        description: "A fully responsive, AI-driven task management dashboard that predicts your daily workflow and prioritizes tasks using NLP.",
        category: "Full Stack",
        status: "Live",
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
        githubLink: "https://github.com",
        liveLink: "https://example.com",
        technologies: ["React", "Node.js", "OpenAI API", "Tailwind CSS"],
        features: ["AI Task Prioritization", "Real-time Collaboration", "Dark Mode"],
        views: 342,
        likes: 89
      },
      {
        userId,
        title: "CryptoFlow - Web3 Wallet",
        description: "A sleek, secure Web3 wallet dashboard supporting multiple blockchains, real-time gas tracking, and NFT portfolio management.",
        category: "Web3",
        status: "Live",
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f4aec4a?q=80&w=1000&auto=format&fit=crop",
        githubLink: "https://github.com",
        liveLink: "https://example.com",
        technologies: ["Next.js", "Ethers.js", "Solidity", "Framer Motion"],
        features: ["Multi-chain Support", "NFT Gallery", "Hardware Wallet Integration"],
        views: 890,
        likes: 215
      },
      {
        userId,
        title: "E-Commerce SaaS Boilerplate",
        description: "A high-performance e-commerce starter kit with Stripe integration, headless CMS support, and edge caching.",
        category: "E-Commerce",
        status: "Development",
        featured: false,
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop",
        githubLink: "https://github.com",
        liveLink: "https://example.com",
        technologies: ["Vue.js", "Nuxt", "Stripe", "PostgreSQL"],
        features: ["One-click Checkout", "Dynamic SEO", "Inventory Sync"],
        views: 156,
        likes: 42
      }
    ];
    await Project.insertMany(projects);
    console.log("Seeded 3 Projects");

    // 4. Seed Blogs
    const blogs = [
      {
        userId,
        title: "Why React Server Components are the Future",
        slug: "react-server-components-future",
        content: `<h2>The Paradigm Shift</h2><p>React Server Components (RSC) represent one of the most significant shifts in how we build React applications since Hooks. By moving component rendering to the server, we can dramatically reduce bundle sizes and improve performance.</p><h3>Key Benefits</h3><ul><li>Zero bundle size impact</li><li>Direct database access</li><li>Automatic code splitting</li></ul><p>It's time to rethink how we structure our applications for the next generation of the web.</p>`,
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
        tags: ["React", "Performance", "WebDev"],
        category: "Frontend",
        views: 1205,
        likes: 340,
        metaTitle: "React Server Components Explained",
        metaDescription: "A deep dive into why React Server Components are changing the web."
      },
      {
        userId,
        title: "Mastering Tailwind CSS Grid Layouts",
        slug: "mastering-tailwind-css-grid",
        content: `<h2>Beyond Flexbox</h2><p>While Flexbox is great for 1D layouts, CSS Grid is the undisputed champion of 2D layouts. Tailwind CSS makes utilizing Grid incredibly intuitive.</p><pre><code>&lt;div class="grid grid-cols-1 md:grid-cols-3 gap-6"&gt;\n  &lt;Card /&gt;\n  &lt;Card /&gt;\n  &lt;Card /&gt;\n&lt;/div&gt;</code></pre><p>With just a few utility classes, you can build complex responsive dashboards that look great on any device.</p>`,
        imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1000&auto=format&fit=crop",
        tags: ["Tailwind", "CSS", "Design"],
        category: "UI/UX",
        views: 890,
        likes: 125,
        metaTitle: "Tailwind CSS Grid Tutorial",
        metaDescription: "Learn how to build complex responsive layouts with Tailwind CSS Grid."
      }
    ];
    await Blog.insertMany(blogs);
    console.log("Seeded 2 Blogs");

    // 5. Seed Portfolio Config
    const portfolio = new Portfolio({
      userId,
      title: "Alex - Developer Portfolio",
      design: { theme: "dark", font: "Inter" },
      sections: [
        {
          id: "hero-1",
          type: "Hero",
          data: {
            heading: "Hi, I'm <br /> <span class='text-gradient'>Alex</span>",
            subheading: "Full Stack Engineer",
            description: "I build exceptional digital experiences combining beautiful design with robust backend architecture.",
            primaryButton: "View Projects",
            secondaryButton: "Contact Me"
          }
        },
        {
          id: "about-1",
          type: "About",
          data: {
            title: "About Me",
            subtitle: "My Journey",
            description1: "With over 5 years of experience in web development, I specialize in building scalable SaaS products.",
            description2: "When I'm not coding, you can find me exploring new coffee shops or reading about AI advancements.",
            skillsTitle: "Core Technologies",
            skillsList: "React, Node.js, TypeScript, Next.js, MongoDB, Tailwind CSS"
          }
        }
      ]
    });
    await portfolio.save();
    console.log("Seeded Portfolio Config");

    console.log("✅ Seeding complete!");
    console.log(`-----------------------------------`);
    console.log(`Login Email: ${email}`);
    console.log(`Login Password: ${password}`);
    console.log(`-----------------------------------`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDatabase();
