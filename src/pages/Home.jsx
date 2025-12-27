import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Linkedin, ChevronLeft, ChevronRight, User, Building2, Cpu } from 'lucide-react';
import Footer from '../components/Layout/Footer';

import profileImg from '../assets/profile-pixel.jpg';

const Home = () => {
    const navigate = useNavigate();

    return (
        // WRAPPER: Fixed single screen, no scroll
        <div className="w-full h-full overflow-hidden relative flex flex-col" style={{ zIndex: 10, isolation: "isolate" }}>

            {/* CONTENT FLEX CONTAINER: Grows to fill space, centers vertically */}
            <div className="flex-grow flex flex-col md:flex-row w-full items-center justify-between px-2 md:px-10 gap-4 md:gap-0 relative z-50">

                {/* MOBILE: Profile Card First (Full Width) */}
                <div className="w-full md:hidden shrink-0 relative z-[100] px-4 pt-4 flex justify-center">
                    <div className="bg-black/70 p-6 rounded-2xl text-center w-full max-w-sm shadow-[0_0_50px_rgba(255,215,0,0.15)] backdrop-blur-sm">
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[var(--accent-color)] mb-4 shadow-[0_0_30px_rgba(255,215,0,0.3)] bg-neutral-900 flex items-center justify-center">
                            <img
                                src={profileImg}
                                alt="Nigel Paine"
                                className="w-full h-full object-cover select-none pointer-events-none"
                                draggable="false"
                                loading="eager"
                            />
                        </div>

                        <h1 className="text-xl font-black text-white mb-2 tracking-wide uppercase font-[Orbitron] drop-shadow-md">
                            Nigel Paine
                        </h1>
                        <p className="text-[var(--accent-color)] text-xs font-bold mb-4 tracking-[0.2em] uppercase">
                            Embedded Software Engineer
                        </p>

                        <a
                            href="https://www.linkedin.com/in/nigel-paine/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0077b5] text-white hover:bg-[#006399] transition-all hover:scale-110 shadow-lg cursor-pointer mx-auto"
                        >
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>

                {/* MOBILE: Buttons Row */}
                <div className="w-full md:hidden flex flex-row justify-center items-center gap-4 relative z-50">
                    {/* Left Button: Portfolio */}
                    <div
                        className="cursor-pointer group flex items-center p-3 transition-transform hover:translate-x-1 bg-black/70 rounded-lg backdrop-blur-sm border border-transparent hover:border-[var(--accent-color)] w-32 justify-between px-4 h-14"
                        onClick={() => navigate('/portfolio')}
                    >
                        <ChevronLeft className="w-8 h-8 text-[var(--accent-color)] shrink-0" />
                        <Cpu className="w-8 h-8 text-[var(--accent-color)] shrink-0" />
                    </div>

                    {/* Right Button: Architecture */}
                    <div
                        className="cursor-pointer group flex items-center p-3 transition-transform hover:-translate-x-1 bg-black/70 rounded-lg backdrop-blur-sm border border-transparent hover:border-[var(--accent-color)] w-32 justify-between px-4 h-14"
                        onClick={() => navigate('/architecture')}
                    >
                        <Building2 className="w-8 h-8 text-[var(--accent-color)] shrink-0" />
                        <ChevronRight className="w-8 h-8 text-[var(--accent-color)] shrink-0" />
                    </div>
                </div>

                {/* DESKTOP: Original 3-Column Layout */}
                {/* 1. LEFT COLUMN: Software Portfolio */}
                <div className="hidden md:flex flex-1 justify-start items-center relative z-50 min-w-0">
                    <div
                        className="cursor-pointer group flex items-center p-3 lg:p-4 transition-transform hover:translate-x-1 md:hover:translate-x-2 bg-black/70 rounded-lg backdrop-blur-sm border border-transparent hover:border-[var(--accent-color)] w-32 lg:w-44 justify-between px-4 lg:px-6"
                        onClick={() => navigate('/portfolio')}
                    >
                        <ChevronLeft className="w-12 h-12 lg:w-16 lg:h-16 text-[var(--accent-color)] shrink-0" />
                        <Cpu className="w-12 h-12 lg:w-16 lg:h-16 text-[var(--accent-color)] shrink-0" />
                    </div>
                </div>

                {/* 2. CENTER COLUMN: Profile Card (Desktop Only) */}
                <div className="hidden md:block shrink-0 relative z-[100] px-2">
                    <div className="bg-black/70 p-8 lg:p-14 rounded-2xl text-center w-full shadow-[0_0_50px_rgba(255,215,0,0.15)] backdrop-blur-sm">
                        <div className="w-32 h-32 lg:w-48 lg:h-48 mx-auto rounded-full overflow-hidden border-2 border-[var(--accent-color)] mb-4 lg:mb-6 shadow-[0_0_30px_rgba(255,215,0,0.3)] bg-neutral-900 flex items-center justify-center">
                            <img
                                src={profileImg}
                                alt="Nigel Paine"
                                className="w-full h-full object-cover select-none pointer-events-none"
                                draggable="false"
                                loading="eager"
                                decoding="sync"
                            />
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-black text-white mb-2 lg:mb-3 tracking-wide uppercase font-[Orbitron] drop-shadow-md">
                            Nigel Paine
                        </h1>
                        <p className="text-[var(--accent-color)] text-sm lg:text-xl font-bold mb-4 lg:mb-8 tracking-[0.1em] md:tracking-[0.2em] uppercase">
                            Embedded Software Engineer
                        </p>

                        <a
                            href="https://www.linkedin.com/in/nigel-paine/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-[#0077b5] text-white hover:bg-[#006399] transition-all hover:scale-110 shadow-lg cursor-pointer mx-auto"
                        >
                            <Linkedin className="w-5 h-5 lg:w-7 lg:h-7" />
                        </a>
                    </div>
                </div>

                {/* 3. RIGHT COLUMN: Architecture Gallery (Desktop Only) */}
                <div className="hidden md:flex flex-1 justify-end items-center relative z-50 min-w-0">
                    <div
                        className="cursor-pointer group flex items-center p-3 lg:p-4 transition-transform hover:-translate-x-1 md:hover:-translate-x-2 bg-black/70 rounded-lg backdrop-blur-sm border border-transparent hover:border-[var(--accent-color)] w-32 lg:w-44 justify-between px-4 lg:px-6"
                        onClick={() => navigate('/architecture')}
                    >
                        <Building2 className="w-12 h-12 lg:w-16 lg:h-16 text-[var(--accent-color)] shrink-0" />
                        <ChevronRight className="w-12 h-12 lg:w-16 lg:h-16 text-[var(--accent-color)] shrink-0" />
                    </div>
                </div>
            </div>

            <div className="pb-4 shrink-0">
                <Footer />
            </div>
        </div>
    );
};

export default Home;

