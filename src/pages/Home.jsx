import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Linkedin, Building2, Cpu } from 'lucide-react';
import Footer from '../components/Layout/Footer';
import usePageTitle from '../hooks/usePageTitle';

const Home = () => {
    usePageTitle('Home | Nigel Paine');
    const navigate = useNavigate();

    return (
        // WRAPPER: Fixed single screen, no scroll
        <div className="w-full h-full overflow-hidden relative flex flex-col" style={{ zIndex: 10, isolation: "isolate" }}>

            {/* CONTENT FLEX CONTAINER: Grows to fill space, centers vertically */}
            {/* CONTENT FLEX CONTAINER: Grows to fill space, centers vertically */}
            <div className="flex-grow flex flex-col items-center justify-between [@media(max-height:500px)]:justify-center md:justify-center w-full px-4 gap-5 [@media(max-height:500px)]:gap-2 [@media(max-height:850px)]:gap-4 md:gap-8 lg:gap-10 xl:gap-12 relative z-50 py-12 [@media(max-height:500px)]:py-2 [@media(max-height:850px)]:py-6 md:py-12 lg:py-16 xl:py-20">

                <div className="shrink-0 relative z-[100] flex justify-center w-full">
                    <div className="bg-black/70 p-6 [@media(max-height:500px)]:p-3 md:p-8 lg:p-8 rounded-2xl text-center w-full max-w-sm md:max-w-xl lg:max-w-2xl shadow-[0_0_50px_rgba(255,215,0,0.15)] backdrop-blur-sm transition-all duration-300">
                        {/* Profile Image */}
                        <div className="w-32 h-32 [@media(max-height:500px)]:w-20 [@media(max-height:500px)]:h-20 md:w-44 md:h-44 lg:w-48 lg:h-48 mx-auto rounded-full overflow-hidden border-2 border-[var(--accent-color)] mb-3 [@media(max-height:500px)]:mb-1 md:mb-5 shadow-[0_0_30px_rgba(255,215,0,0.3)] bg-neutral-900 flex items-center justify-center transition-all duration-300">
                            <img
                                src="/images/project_images/profile.webp"
                                alt="Nigel Paine"
                                className="w-full h-full object-cover select-none pointer-events-none"
                                draggable="false"
                            />
                        </div>

                        {/* Name */}
                        <h1 className="text-xl [@media(max-height:500px)]:text-lg md:text-3xl lg:text-4xl font-black text-white mb-2 [@media(max-height:500px)]:mb-0 md:mb-3 tracking-wide uppercase font-[Orbitron] drop-shadow-md transition-all duration-300">
                            Nigel Paine
                        </h1>

                        {/* Title */}
                        <p className="text-[var(--accent-color)] text-xs [@media(max-height:500px)]:text-[10px] md:text-base lg:text-lg font-bold mb-3 [@media(max-height:500px)]:mb-1 md:mb-5 tracking-[0.2em] uppercase transition-all duration-300">
                            Embedded Software Engineer
                        </p>

                        {/* LinkedIn Icon */}
                        <a
                            href="https://www.linkedin.com/in/nigel-paine/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 [@media(max-height:500px)]:w-7 [@media(max-height:500px)]:h-7 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-[#0077b5] text-white hover:bg-[#006399] transition-all hover:scale-110 shadow-lg cursor-pointer mx-auto"
                        >
                            <Linkedin className="w-4 h-4 [@media(max-height:500px)]:w-3.5 [@media(max-height:500px)]:h-3.5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                        </a>
                    </div>
                </div>

                {/* SINGLE UNIFIED BUTTONS ROW/STACK */}
                <div className="flex flex-col [@media(max-height:500px)]:flex-row md:flex-row justify-center items-center gap-4 [@media(max-height:500px)]:gap-2 md:gap-8 w-full relative z-50">
                    {/* Portfolio Button */}
                    <div
                        className="cursor-pointer group flex items-center justify-between px-6 py-4 [@media(max-height:500px)]:px-4 [@media(max-height:500px)]:py-2 md:px-8 md:py-4 transition-transform hover:translate-x-1 hover:-translate-y-1 bg-black/70 rounded-lg backdrop-blur-sm border border-transparent hover:border-[var(--accent-color)] w-64 [@media(max-height:500px)]:w-48 md:w-80 lg:w-96 shadow-lg"
                        onClick={() => navigate('/portfolio')}
                    >
                        <span className="text-white font-bold text-sm [@media(max-height:500px)]:text-xs md:text-lg uppercase tracking-wider">Portfolio</span>
                        <Cpu className="w-6 h-6 [@media(max-height:500px)]:w-4 [@media(max-height:500px)]:h-4 md:w-8 md:h-8 text-[var(--accent-color)] shrink-0" />
                    </div>

                    {/* Architecture Button */}
                    <div
                        className="cursor-pointer group flex items-center justify-between px-6 py-4 [@media(max-height:500px)]:px-4 [@media(max-height:500px)]:py-2 md:px-8 md:py-4 transition-transform hover:translate-x-1 hover:-translate-y-1 bg-black/70 rounded-lg backdrop-blur-sm border border-transparent hover:border-[var(--accent-color)] w-64 [@media(max-height:500px)]:w-48 md:w-80 lg:w-96 shadow-lg"
                        onClick={() => navigate('/architecture')}
                    >
                        <span className="text-white font-bold text-sm [@media(max-height:500px)]:text-xs md:text-lg uppercase tracking-wider">Architecture</span>
                        <Building2 className="w-6 h-6 [@media(max-height:500px)]:w-4 [@media(max-height:500px)]:h-4 text-[var(--accent-color)] shrink-0" />
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

