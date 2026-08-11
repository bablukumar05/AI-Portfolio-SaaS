import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/ui/PageTransition";
import ScrollToTop from "./components/ui/ScrollToTop";

import DashboardLayout from "./components/layout/DashboardLayout";

// Eager loads
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
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

const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

const Loader = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 flex items-center justify-center transition-colors">
        <div className="w-8 h-8 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
        </div>
    </div>
);

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/about-project" element={<PageTransition><AboutProject /></PageTransition>} />
                <Route path="/login" element={<PageTransition><PublicRoute><Login /></PublicRoute></PageTransition>} />
                <Route path="/register" element={<PageTransition><PublicRoute><Register /></PublicRoute></PageTransition>} />
                <Route path="/forgot-password" element={<PageTransition><PublicRoute><ForgotPassword /></PublicRoute></PageTransition>} />
                <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
                <Route path="/blog/:slug" element={<PageTransition><BlogDetail /></PageTransition>} />

                {/* Protected Routes (Dashboard App Shell) */}
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                    <Route path="/builder" element={<PageTransition><Builder /></PageTransition>} />
                    <Route path="/resume" element={<PageTransition><Resume /></PageTransition>} />
                    <Route path="/billing" element={<PageTransition><Billing /></PageTransition>} />
                    <Route path="/manage-projects" element={<PageTransition><ManageProjects /></PageTransition>} />
                    <Route path="/manage-blogs" element={<PageTransition><ManageBlogs /></PageTransition>} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

export default function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <Suspense fallback={<Loader />}>

                <AnimatedRoutes />
            </Suspense>
        </BrowserRouter>
    );
}