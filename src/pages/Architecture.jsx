import React, { useState, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '../components/Layout/Layout';

const photos = [
    { id: 1, color: "from-gray-800 to-gray-600", title: "Structural Integrity" },
    { id: 2, color: "from-slate-800 to-slate-600", title: "Urban Lines" },
    { id: 3, color: "from-neutral-800 to-neutral-600", title: "Light & Shadow" },
    { id: 4, color: "from-zinc-800 to-zinc-600", title: "Cantilever" },
    { id: 5, color: "from-stone-800 to-stone-600", title: "Facade details" },
    { id: 6, color: "from-cyan-900 to-blue-900", title: "Nightscape" },
];

const Architecture = () => {
    const navigate = useNavigate();
    const { setAreAssetsLoaded } = useLoader();
    const [hoveredId, setHoveredId] = useState(null);

    // Asset Preload Logic (Simplified for now - unlocks immediately)
    useLayoutEffect(() => {
        // Unlock the loader so the page becomes visible
        // Use a small timeout to ensure this runs strictly AFTER the Layout's navigation "Lock" effect.
        const timer = setTimeout(() => {
            setAreAssetsLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [setAreAssetsLoaded]);

    return (
        <div className="pt-24 px-6 md:px-20 max-w-7xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-12">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors group"
                >
                    <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                <a
                    href="https://photos.app.goo.gl/PD3JUsCWRNvmTphC8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent-color)] text-[var(--bg-primary)] font-bold hover:opacity-90 transition-opacity"
                >
                    <ExternalLink size={20} />
                    View Full Album
                </a>
            </div>

            <motion.h1
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-l from-purple-400 to-pink-600 text-right"
            >
                Architecture Gallery
            </motion.h1>
            <p className="text-[var(--text-secondary)] mb-12 text-lg text-right max-w-2xl ml-auto">
                Exploring the interplay of structure, light, and form through the lens.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {photos.map((photo, index) => (
                    <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                        onMouseEnter={() => setHoveredId(photo.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        {/* Placeholder Gradient */}
                        <div className={`w-full h-full bg-gradient-to-br ${photo.color} group-hover:scale-110 transition-transform duration-700 ease-out`} />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

                        {/* Icon/Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <ImageIcon className="w-12 h-12 text-white/50 mb-2 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                            <span className="text-white font-light tracking-widest uppercase text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                {photo.title}
                            </span>
                        </div>

                        {/* Border glow */}
                        <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-xl transition-all duration-300" />
                    </motion.div>
                ))}
            </div>

            <div className="text-center pb-20">
                <p className="text-[var(--text-secondary)] mb-6">See the complete collection in high resolution on Google Photos.</p>
                <a
                    href="https://photos.app.goo.gl/PD3JUsCWRNvmTphC8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[var(--accent-color)] hover:underline underline-offset-4"
                >
                    Open Google Photos <ExternalLink size={16} />
                </a>
            </div>

        </div>
    );
};

export default Architecture;
