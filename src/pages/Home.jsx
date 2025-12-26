import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Linkedin, ChevronLeft, ChevronRight, User, Building2, Cpu } from 'lucide-react';

import profileImg from '../assets/profile-pixel.jpg';

const Home = () => {
    const navigate = useNavigate();

    return (
        // Responsive Flexbox: Row layout on all screens (modified for mobile compactness)
        <div
            className="flex flex-row w-full h-full items-center justify-between px-2 md:px-10 overflow-hidden relative"
            style={{ zIndex: 10, isolation: "isolate" }}
        >

            {/* 1. LEFT COLUMN: Software Portfolio */}
            <div className="flex-1 flex justify-start items-center relative z-50">
                <div
                    className="cursor-pointer group flex items-center p-2 md:p-4 transition-transform hover:translate-x-1 md:hover:translate-x-2 bg-black/70 rounded-lg backdrop-blur-sm border border-transparent hover:border-[var(--accent-color)] w-24 md:w-44 justify-between px-2 md:px-6"
                    onClick={() => navigate('/portfolio')}
                >
                    <ChevronLeft className="w-10 h-10 md:w-16 md:h-16 text-[var(--accent-color)] shrink-0" />

                    {/* Cpu Icon */}
                    <Cpu className="w-10 h-10 md:w-16 md:h-16 text-[var(--accent-color)] shrink-0" />
                </div>
            </div>

            {/* 2. CENTER COLUMN: Profile Card */}
            <div className="shrink-0 relative z-50 px-2">
                <div className="bg-black/70 p-3 md:p-14 rounded-2xl text-center w-full shadow-[0_0_50px_rgba(255,215,0,0.15)] backdrop-blur-sm">
                    <div className="w-20 h-20 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden border-2 border-[var(--accent-color)] mb-2 md:mb-6 shadow-[0_0_30px_rgba(255,215,0,0.3)] bg-neutral-900 flex items-center justify-center">
                        <img
                            src={profileImg}
                            alt="Nigel Paine"
                            className="w-full h-full object-cover select-none pointer-events-none"
                            draggable="false"
                        />
                    </div>

                    <h1 className="text-sm md:text-6xl font-black text-white mb-1 md:mb-3 tracking-wide uppercase font-[Orbitron] drop-shadow-md">
                        Nigel Paine
                    </h1>
                    <p className="text-[var(--accent-color)] text-[8px] md:text-xl font-bold mb-2 md:mb-8 tracking-[0.1em] md:tracking-[0.2em] uppercase">
                        Embedded Software Engineer
                    </p>

                    <a
                        href="https://www.linkedin.com/in/nigel-paine/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 md:w-14 md:h-14 rounded-full bg-[#0077b5] text-white hover:bg-[#006399] transition-all hover:scale-110 shadow-lg cursor-pointer mx-auto"
                    >
                        <Linkedin size={14} className="md:w-7 md:h-7" />
                    </a>
                </div>
            </div>

            {/* 3. RIGHT COLUMN: Architecture Gallery (Visual Comparison) */}
            <div className="flex-1 flex justify-end items-center relative z-50">
                <div
                    className="cursor-pointer group flex items-center p-2 md:p-4 transition-transform hover:-translate-x-1 md:hover:-translate-x-2 bg-black/70 rounded-lg backdrop-blur-sm border border-transparent hover:border-[var(--accent-color)] w-24 md:w-44 justify-between px-2 md:px-6"
                    onClick={() => navigate('/architecture')}
                >
                    {/* Building Icon */}
                    <Building2 className="w-10 h-10 md:w-16 md:h-16 text-[var(--accent-color)] shrink-0" />

                    <ChevronRight className="w-10 h-10 md:w-16 md:h-16 text-[var(--accent-color)] shrink-0" />
                </div>
            </div>

        </div>
    );
};

export default Home;
