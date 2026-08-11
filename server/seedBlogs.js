const mongoose = require('mongoose');
const User = require('./models/User');
const Blog = require('./models/Blog');
require('dotenv').config();

const seedBlogs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const admin = await User.findOne({ email: 'kumarbablu74824@gmail.com' });
        if (!admin) {
            console.log('No admin found. Cannot seed blogs.');
            process.exit(1);
        }

        const blogs = [
            {
                userId: admin._id,
                title: "The Future of Artificial Intelligence in Web Development",
                slug: "future-of-ai-web-dev-" + Date.now(),
                content: "<h2>AI is transforming the web</h2><p>As we move deeper into the 2020s, AI is no longer just a buzzword. It's actively generating boilerplate, dynamically optimizing assets, and entirely automating A/B testing.</p><h3>What's next?</h3><p>We predict that AI will soon be writing entire front-end components autonomously...</p>",
                imageUrl: "https://images.unsplash.com/photo-1677442135136-760c813028c0?q=80&w=1000&auto=format&fit=crop",
                category: "AI & Tech",
                tags: ["AI", "Web Dev", "Future"],
                views: 1205,
                likes: 342,
            },
            {
                userId: admin._id,
                title: "Mastering React 18: Concurrent Features Explained",
                slug: "mastering-react-18-" + Date.now(),
                content: "<h2>Understanding useTransition</h2><p>React 18 brought us Concurrent Mode by default. The most important hook you need to master is <code>useTransition()</code>...</p><p>It allows you to mark state updates as non-urgent, keeping your UI incredibly responsive even under heavy rendering loads.</p>",
                imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
                category: "Frontend",
                tags: ["React", "JavaScript", "Performance"],
                views: 843,
                likes: 211,
            },
            {
                userId: admin._id,
                title: "Why Tailwind CSS is the Ultimate Styling Solution",
                slug: "why-tailwind-css-" + Date.now(),
                content: "<h2>Utility-first is the way</h2><p>Gone are the days of naming collisions and massive global CSS files. Tailwind CSS moves the design directly into your markup...</p><p>It provides an incredible developer experience when paired with component architectures like React and Vue.</p>",
                imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
                category: "Design",
                tags: ["CSS", "Tailwind", "UI/UX"],
                views: 520,
                likes: 129,
            }
        ];

        await Blog.insertMany(blogs);
        console.log('Successfully seeded 3 random blogs!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedBlogs();
