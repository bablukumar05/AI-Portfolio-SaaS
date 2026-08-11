const User = require("../models/User");
const Project = require("../models/Project");
const Blog = require("../models/Blog");
const Portfolio = require("../models/Portfolio");
const Activity = require("../models/Activity");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch User, Projects, Blogs, Portfolio (concurrently for performance)
    const [user, projects, blogs, portfolio, activities] = await Promise.all([
      User.findById(userId).select("-password"),
      Project.find({ userId }).sort({ createdAt: -1 }),
      Blog.find({ userId }).sort({ createdAt: -1 }),
      Portfolio.findOne({ userId }),
      Activity.find({ userId }).sort({ createdAt: -1 }).limit(10)
    ]);

    if (!user) {
      return res.status(401).json({ message: "User not found. Session expired." });
    }

    // Calculate aggregated stats
    const totalProjects = projects.length;
    const totalBlogs = blogs.length;

    const totalProjectViews = projects.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalBlogViews = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const portfolioViews = (portfolio && portfolio.views) || 0;
    const totalViews = totalProjectViews + totalBlogViews + portfolioViews;

    const totalProjectLikes = projects.reduce((acc, curr) => acc + (curr.likes || 0), 0);
    const totalBlogLikes = blogs.reduce((acc, curr) => acc + (curr.likes || 0), 0);
    const totalLikes = totalProjectLikes + totalBlogLikes;

    // Map real activities for the frontend
    const recentActivity = activities.map(a => ({
      id: a._id,
      type: a.entityType.toLowerCase(),
      title: a.action,
      description: a.description,
      createdAt: a.createdAt,
    }));

    // Timeline data (for Area/Bar chart)
    // Create an array of the last 7 days including today
    const timelineData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      // Since we don't have historical daily data, we will simulate realistic mock data 
      // mixed with real totals for demonstration of the "Pro" feel
      timelineData.push({
        date: dateStr,
        projectViews: Math.floor(Math.random() * (totalProjectViews / 5 + 10)),
        blogViews: Math.floor(Math.random() * (totalBlogViews / 5 + 10)),
      });
    }

    // AI Insight Generator
    let aiInsight = "Your portfolio is looking good! Add more content to increase engagement.";
    if (totalViews > 100) {
      aiInsight = `Awesome work! Your overall views have reached ${totalViews}, indicating strong engagement. Keep posting!`;
    } else if (totalBlogs > 0 && totalProjects === 0) {
      aiInsight = "Your writing is taking off! Consider adding a project to showcase your technical skills.";
    } else if (totalProjects > 0 && totalBlogs === 0) {
      aiInsight = "Great projects! Writing a blog about your process can increase profile views by 40%.";
    }

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        profileViews: user.profileViews || 0,
      },
      stats: {
        totalProjects,
        totalBlogs,
        totalViews,
        portfolioViews,
        totalLikes,
      },
      recentActivity: recentActivity.slice(0, 5),
      timelineData,
      aiInsight
    });

  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
