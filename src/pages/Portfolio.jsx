import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CircuitNode from '../components/Portfolio/CircuitNode';
import { projects } from '../data/projects.jsx';
import Footer from '../components/Layout/Footer';

const Portfolio = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        container: containerRef,
        offset: ["start start", "end end"]
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div ref={containerRef} className="w-full h-full overflow-y-auto relative scrollbar-custom">
            <div className="pt-24 px-4 md:px-20 max-w-7xl mx-auto min-h-full relative">
                {/* Header Navigation - Home Icon Only */}
                <button
                    onClick={() => navigate('/')}
                    className="fixed top-6 left-6 md:left-10 z-50 p-3 rounded-full bg-black/50 border border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-black transition-all duration-300 hover:scale-110 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                >
                    <Home size={24} />
                </button>

                {/* Spacer for where header used to be */}
                <div className="h-20"></div>

                {/* MAIN CIRCUIT BUS (Vertical Line) */}
                {/* We place this absolutely continuously down the page using a fixed height container logic or just relative to the flow */}
                <div className="relative pb-32">
                    {/* Continuous Central Trace */}
                    {/* -top-44 = 11rem (6rem padding + 5rem spacer) to reach the very top of the page */}
                    <div className="absolute -top-44 bottom-0 left-8 md:left-1/2 w-1 -translate-x-1/2 bg-[#FFD700] shadow-[0_0_10px_#FFD700] z-0 rounded-b-full" />

                    {/* Circuit Nodes Loop */}
                    {projects.map((project, index) => (
                        <CircuitNode
                            key={project.id}
                            project={project}
                            index={index}
                            isLast={index === projects.length - 1}
                        />
                    ))}

                    {/* END TERMINATOR - Replaced by continuous line ending */}
                    <div className="absolute bottom-0 left-8 md:left-1/2 -translate-x-1/2 translate-y-full flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-[#FFD700] shadow-[0_0_15px_#FFD700] animate-pulse" />
                    </div>
                </div>

                <div className="mt-20">
                    <Footer />
                </div>

                {/* PROGRESS BAR (Optional - Side fixed) */}
                <motion.div
                    className="fixed top-0 left-0 right-0 h-1 bg-[var(--accent-color)] origin-left z-50 mix-blend-screen"
                    style={{ scaleX }}
                />
            </div>
        </div>

    );
};

export default Portfolio;
