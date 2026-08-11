import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ResumeAnalyzer = () => {
    const [resumeText, setResumeText] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [useQueue, setUseQueue] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        setAnalysis(null);
        try {
            const response = await axios.post('/api/ai/analyze-resume', {
                resumeText,
                useQueue
            });
            if (useQueue) {
                alert(`Job queued! Job ID: ${response.data.jobId}`);
            } else {
                setAnalysis(response.data.data);
            }
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Something went wrong during analysis.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
                AI Resume Analyzer
            </motion.h2>

            <div className="space-y-6">
                <textarea
                    className="w-full h-64 p-4 bg-black/40 border border-white/10 rounded-2xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                    placeholder="Paste your resume text here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                ></textarea>

                <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer space-x-3 text-zinc-400">
                        <input
                            type="checkbox"
                            checked={useQueue}
                            onChange={() => setUseQueue(!useQueue)}
                            className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-purple-600 focus:ring-purple-500"
                        />
                        <span>Use background queue (for large resumes)</span>
                    </label>
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={loading || !resumeText}
                    className={`w-full py-4 rounded-2xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading || !resumeText
                        ? 'bg-zinc-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/20'
                        }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Analyzing...</span>
                        </div>
                    ) : 'Start Deep Analysis'}
                </button>
            </div>

            {analysis && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 space-y-8"
                >
                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-xl font-medium text-zinc-300">Overall AI Score</span>
                        <span className="text-4xl font-bold text-purple-400">{analysis.score}/10</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-green-500/5 rounded-2xl border border-green-500/20">
                            <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
                                <span className="mr-2">✨</span> Strengths
                            </h3>
                            <ul className="space-y-2">
                                {analysis.strengths.map((s, i) => (
                                    <li key={i} className="text-zinc-400 flex items-start">
                                        <span className="mr-2 text-green-500">•</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20">
                            <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center">
                                <span className="mr-2">💡</span> Improvements
                            </h3>
                            <ul className="space-y-2">
                                {analysis.improvements.map((im, i) => (
                                    <li key={i} className="text-zinc-400 flex items-start">
                                        <span className="mr-2 text-blue-500">•</span> {im}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="p-6 bg-purple-500/5 rounded-2xl border border-purple-500/20">
                        <h3 className="text-lg font-bold text-purple-400 mb-2">🎯 Skill Gaps</h3>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {analysis.skillGaps.map((gap, i) => (
                                <span key={i} className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/20 font-medium">
                                    {gap}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ResumeAnalyzer;
