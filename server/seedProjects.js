const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');

const seedProjects = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/portfolioDB');

        const admin = await User.findOne({ email: 'kumarbablu74824@gmail.com' });
        if (!admin) {
            console.log('No admin found. Cannot seed projects.');
            process.exit(1);
        }

        const projects = [
            {
                userId: admin._id,
                title: "NextGen E-Commerce Dashboard",
                description: "A futuristic administrative dashboard built to manage massive scale e-commerce operations seamlessly. Includes beautiful real-time graphical metrics natively mapped to live MongoDB pipelines.",
                category: "Full Stack",
                status: "Live",
                featured: true,
                imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
                githubLink: "https://github.com",
                liveLink: "https://vercel.com",
                technologies: ["React", "Express", "MongoDB", "Recharts", "TailwindCSS"],
                features: ["Real-time Data Vis", "Stripe API Integration", "Role-based Access"]
            },
            {
                userId: admin._id,
                title: "Neuro: AI Prompt Engineering Platform",
                description: "An advanced portal for engineering, testing, and storing complex LLM prompt sequences simultaneously against GPT-4, Claude, and Gemini API endpoints.",
                category: "AI",
                status: "Beta",
                featured: true,
                imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000",
                githubLink: "https://github.com",
                liveLink: "https://vercel.com",
                technologies: ["Next.js", "OpenAI SDK", "Prisma", "PostgreSQL"],
                features: ["A/B Prompt Testing", "Latency Analytics", "Cost Tracker"]
            },
            {
                userId: admin._id,
                title: "Oasis UI Components library",
                description: "A meticulously crafted, highly customizable open-source React component library utilizing Framer Motion for incredibly smooth enterprise-level micro-interactions.",
                category: "Frontend",
                status: "Live",
                featured: false,
                imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000",
                githubLink: "https://github.com",
                liveLink: "https://npm.com",
                technologies: ["React", "TypeScript", "Framer Motion", "Storybook"],
                features: ["Fully Accessible", "Zero Dependencies", "Dark Mode Out-of-the-box"]
            }
        ];

        await Project.insertMany(projects);
        console.log('Successfully seeded 3 random projects!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedProjects();
