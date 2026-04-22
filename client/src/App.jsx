import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Eager loads
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Lazy loads for Performance (Phase 13)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Builder = lazy(() => import("./pages/Builder"));
const AboutProject = lazy(() => import("./pages/AboutProject"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Resume = lazy(() => import("./pages/Resume"));
const Billing = lazy(() => import("./pages/Billing"));
const ManageProjects = lazy(() => import("./pages/ManageProjects"));
const ManageBlogs = lazy(() => import("./pages/ManageBlogs"));

const Loader = () => (
   <div className="min-h-screen bg-slate-50 dark:bg-dark-900 flex items-center justify-center transition-colors">
     <div className="w-8 h-8 relative">
        <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
     </div>
   </div>
);

export default function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<Loader />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about-project" element={<AboutProject />} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogDetail />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/builder" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
                    <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
                    <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
                    <Route path="/manage-projects" element={<ProtectedRoute><ManageProjects /></ProtectedRoute>} />
                    <Route path="/manage-blogs" element={<ProtectedRoute><ManageBlogs /></ProtectedRoute>} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}