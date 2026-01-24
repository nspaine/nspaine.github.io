import React, { useRef, useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CircuitNode from '../components/Portfolio/CircuitNode';
import LightCycleGame from '../components/Portfolio/LightCycleGame';
import { projects } from '../data/projects.jsx';
import Footer from '../components/Layout/Footer';
import { useLoader } from '../components/Layout/Layout';
import usePageTitle from '../hooks/usePageTitle';

const Portfolio = () => {
    usePageTitle('Portfolio | Nigel Paine');
    const navigate = useNavigate();
    const { setAreAssetsLoaded } = useLoader();
    const containerRef = useRef(null);
    const [isGameOpen, setIsGameOpen] = useState(false);

    // Asset Preload Logic
    useLayoutEffect(() => {
        // 1. Lock Loader Immediately to ensure no gaps
        setAreAssetsLoaded(false);

        const preloadImages = async () => {
            if (!projects || projects.length === 0) {
                setAreAssetsLoaded(true);
                return;
            }

            const imagePromises = projects.map(project => {
                const img = new Image();
                img.src = project.image;
                // Use decode() to ensure image is ready to paint (prevents pop-in)
                return img.decode().catch(() => {
                    // If decode fails, resolve anyway to avoid blocking
                    return Promise.resolve();
                });
            });

            // Safety Timeout: Unlock after 10s max to allow for slow connections but prevent total hang
            const timeoutPromise = new Promise(resolve => setTimeout(resolve, 10000));

            await Promise.race([Promise.all(imagePromises), timeoutPromise]);

            // Stabilization Buffer: Wait an extra 500ms to allow DOM paint/layout to settle
            await new Promise(resolve => setTimeout(resolve, 500));

            // 3. Release Loader
            setAreAssetsLoaded(true);
        };

        preloadImages();
    }, [setAreAssetsLoaded]);

    // Handle Scroll Locking for Game
    useLayoutEffect(() => {
        if (isGameOpen) {
            document.body.classList.add('game-open');
        } else {
            document.body.classList.remove('game-open');
        }
    }, [isGameOpen]);

    return (
        <div
            ref={containerRef}
            className={`w-full h-full relative scrollbar-custom ${isGameOpen ? 'overflow-hidden' : 'overflow-y-auto'}`}
        >
            {/* Subtle Tron Grid Background */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    background: `
                        linear-gradient(90deg,
                            rgba(255,215,0,0.08) 1px,
                            transparent 1px
                        ),
                        linear-gradient(0deg,
                            rgba(255,215,0,0.08) 1px,
                            transparent 1px
                        )
                    `,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="px-4 md:px-20 max-w-7xl 3xl:max-w-[1800px] mx-auto min-h-full relative z-10">
                {/* Sticky Header Navigation */}
                <div className="sticky top-0 z-50 pt-6 pb-6 w-full flex justify-start md:justify-center pointer-events-none">
                    <button
                        onClick={() => navigate('/')}
                        className="pointer-events-auto ml-[7px] md:ml-0 p-3 rounded-full bg-black border border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-black transition-all duration-300 hover:scale-110 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    >
                        <Home size={24} />
                    </button>
                </div>

                {/* MAIN CIRCUIT BUS (Vertical Line) */}
                {/* We place this absolutely continuously down the page using a fixed height container logic or just relative to the flow */}
                <div className="relative pb-32">
                    {/* Unified Circuit Trace & Terminator Wrapper */}
                    <div className="absolute inset-0 pointer-events-none drop-shadow-[0_0_10px_#FFD700] z-0">
                        {/* Continuous Central Trace */}
                        {/* -top-6 overlaps the pb-6 header padding to touch the button */}
                        <div className="absolute -top-6 bottom-0 left-8 md:left-1/2 w-[4px] -translate-x-1/2 bg-[#FFD700]" />

                        {/* END TERMINATOR - Signal Ground (Easter Egg Trigger!) */}
                        <motion.div
                            className="absolute bottom-0 left-8 md:left-1/2 -translate-x-1/2 translate-y-full flex flex-col items-center cursor-pointer pointer-events-auto group"
                            onClick={() => setIsGameOpen(true)}
                        >
                            {/* Constant Pulsing Glow Layer */}
                            <motion.div
                                className="absolute inset-0 z-0 rounded-full"
                                animate={{
                                    opacity: [0.2, 0.6, 0.2],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    filter: 'blur(10px)',
                                    background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
                                    width: '60px',
                                    height: '60px',
                                    top: '-6px'
                                }}
                            />

                            {/* Hover 'Max Glow' Layer */}
                            <motion.div
                                className="z-10 relative"
                                whileHover={{
                                    filter: 'drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 30px #FFD700)'
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                                    {/* Vertical connection line - extends slightly up to ensure overlap */}
                                    <path d="M12 -2V12" stroke="#FFD700" strokeWidth="2" />
                                    {/* Top horizontal line */}
                                    <path d="M4 12H20" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                                    {/* Middle horizontal line */}
                                    <path d="M7 16H17" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                                    {/* Bottom horizontal line */}
                                    <path d="M10 20H14" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Circuit Nodes Loop */}
                    {projects.map((project, index) => (
                        <CircuitNode
                            key={project.id}
                            project={project}
                            index={index}
                            isLast={index === projects.length - 1}
                        />
                    ))}
                </div>

                <div className="mt-20">
                    <Footer />
                </div>
            </div>

            {/* Light Cycle Easter Egg Game */}
            {/* LIGHT CYCLE EASTER EGG */}
            {isGameOpen && (
                <LightCycleGame
                    isOpen={isGameOpen}
                    onClose={() => setIsGameOpen(false)}
                />
            )}
        </div>

    );
};

export default Portfolio;
