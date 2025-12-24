import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Linkedin, ChevronLeft, ChevronRight, User } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        // Replaced Grid with Flexbox
        <div
            className="flex w-full h-full items-center justify-between px-4 md:px-10 overflow-hidden relative"
            style={{ zIndex: 10, isolation: "isolate" }}
        >

            {/* 1. LEFT COLUMN: Software Portfolio (Width 1/3, Align Left) */}
            <div className="flex-1 flex justify-start items-center relative z-50">
                <div
                    className="cursor-pointer group flex items-center gap-2 p-4 transition-transform hover:translate-x-2 bg-black/50 rounded-lg backdrop-blur-sm border border-transparent hover:border-[var(--accent-color)]"
                    onClick={() => navigate('/portfolio')}
                >
                    <ChevronLeft className="w-10 h-10 md:w-16 md:h-16 text-[var(--accent-color)] group-hover:scale-125 transition-transform shrink-0" />
                    <span className="hidden md:block text-2xl md:text-3xl font-bold text-white group-hover:text-[var(--accent-color)] transition-colors uppercase tracking-widest text-shadow">
                        Software<br />Portfolio
                    </span>
                </div>
            </div>

            {/* 2. CENTER COLUMN: Profile Card (Width Auto, Align Center) */}
            <div className="shrink-0 relative z-50 px-4">
                <div className="glass-panel p-8 md:p-14 rounded-2xl border border-[var(--accent-color)] text-center w-full shadow-[0_0_50px_rgba(255,215,0,0.15)]">
                    <div className="w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden border-2 border-[var(--accent-color)] mb-6 shadow-[0_0_30px_rgba(255,215,0,0.3)] bg-neutral-900 flex items-center justify-center">
                        <User className="w-16 h-16 md:w-24 md:h-24 text-[var(--accent-color)]" />
                    </div>

                    <h1 className="text-3xl md:text-6xl font-black text-white mb-3 tracking-wide uppercase font-[Orbitron] drop-shadow-md">
                        Nigel Paine
                    </h1>
                    <p className="text-[var(--accent-color)] text-sm md:text-xl font-bold mb-8 tracking-[0.2em] uppercase">
                        Embedded Software Engineer
                    </p>

                    <a
                        href="https://www.linkedin.com/in/nigel-paine/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0077b5] text-white hover:bg-[#006399] transition-all hover:scale-110 shadow-lg cursor-pointer mx-auto"
                    >
                        <Linkedin size={28} />
                    </a>
                </div>
            </div>

            {/* 3. RIGHT COLUMN: Architecture Gallery (Width 1/3, Align Right) */}
            <div className="flex-1 flex justify-end items-center relative z-50">
                <div
                    className="cursor-pointer group flex items-center gap-2 p-4 justify-end transition-transform hover:-translate-x-2 bg-black/50 rounded-lg backdrop-blur-sm border border-transparent hover:border-[var(--accent-color)]"
                    onClick={() => navigate('/architecture')}
                >
                    <span className="hidden md:block text-2xl md:text-3xl font-bold text-white group-hover:text-[var(--accent-color)] transition-colors uppercase tracking-widest text-shadow">
                        Architecture<br />Gallery
                    </span>
                    <ChevronRight className="w-10 h-10 md:w-16 md:h-16 text-[var(--accent-color)] group-hover:scale-125 transition-transform shrink-0" />
                </div>
            </div>

        </div>
    );
};

export default Home;
