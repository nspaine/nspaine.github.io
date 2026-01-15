import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLoader } from '../Layout/Layout';

const OscilloscopeLoader = () => {
    const { startMinTimer } = useLoader();

    useEffect(() => {
        startMinTimer();
    }, []);

    return (
        <div className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center gap-6 px-4">
            {/* Oscilloscope Container - Responsive sizing */}
            <div className="w-[80vw] max-w-[28rem] md:w-[50vw] md:max-w-[36rem] lg:max-w-[40rem] aspect-[3/2]">
                <svg viewBox="0 0 480 320" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
                    <defs>
                        <pattern id="grid-pattern-react" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1A3A1A" strokeWidth="0.5" opacity="0.3" />
                        </pattern>
                        <clipPath id="screen-clip-react">
                            <rect x="25" y="25" width="300" height="200" rx="4" />
                        </clipPath>
                        <radialGradient id="knob-gradient-react">
                            <stop offset="0%" stopColor="#4A4A4A" />
                            <stop offset="50%" stopColor="#2A2A2A" />
                            <stop offset="100%" stopColor="#1A1A1A" />
                        </radialGradient>
                    </defs>

                    {/* Chassis */}
                    <rect x="0" y="0" width="480" height="320" rx="8" fill="#1A1A1A" stroke="#333" strokeWidth="2" />

                    {/* Screen Bezel */}
                    <rect x="20" y="20" width="310" height="210" rx="6" fill="#0A0A0A" stroke="#444" strokeWidth="2" />

                    {/* CRT Screen */}
                    <rect x="25" y="25" width="300" height="200" rx="4" fill="#050505" />

                    {/* Grid */}
                    <rect x="25" y="25" width="300" height="200" fill="url(#grid-pattern-react)" clipPath="url(#screen-clip-react)" />

                    {/* Channel 1: Clock */}
                    <g clipPath="url(#screen-clip-react)">
                        <path className="animate-scope-wave"
                            d="M25,85 L37.5,85 L37.5,115 L50,115 L50,85 L62.5,85 L62.5,115 L75,115 L75,85 L87.5,85 L87.5,115 L100,115 L100,85 L112.5,85 L112.5,115 L125,115 L125,85 L137.5,85 L137.5,115 L150,115 L150,85 L162.5,85 L162.5,115 L175,115 L175,85 L187.5,85 L187.5,115 L200,115 L200,85 L212.5,85 L212.5,115 L225,115 L225,85 L237.5,85 L237.5,115 L250,115 L250,85 L262.5,85 L262.5,115 L275,115 L275,85 L287.5,85 L287.5,115 L300,115 L300,85 L312.5,85 L312.5,115 L325,115 L325,85 L337.5,85 L337.5,115 L350,115 L350,85 L362.5,85 L362.5,115 L375,115 L375,85 L387.5,85 L387.5,115 L400,115 L400,85 L412.5,85 L412.5,115 L425,115 L425,85 L437.5,85 L437.5,115 L450,115 L450,85 L462.5,85 L462.5,115 L475,115 L475,85 L487.5,85 L487.5,115 L500,115 L500,85 L512.5,85 L512.5,115 L525,115 L525,85 L537.5,85 L537.5,115 L550,115 L550,85 L562.5,85 L562.5,115 L575,115 L575,85 L587.5,85 L587.5,115 L600,115 L600,85 L612.5,85 L612.5,115 L625,115 L625,85"
                            fill="none" stroke="#FFD700" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))" }} />
                    </g>

                    {/* Channel 2: Random */}
                    <g clipPath="url(#screen-clip-react)">
                        <path className="animate-scope-wave"
                            d="M25,155 L40,155 L40,175 L70,175 L70,155 L100,155 L100,175 L115,175 L130,175 L130,155 L160,155 L175,155 L175,175 L190,175 L220,175 L220,155 L250,155 L265,155 L265,175 L295,175 L325,175 L325,155 L340,155 L340,175 L370,175 L370,155 L400,155 L400,175 L415,175 L430,175 L430,155 L460,155 L475,155 L475,175 L490,175 L520,175 L520,155 L550,155 L565,155 L565,175 L595,175 L625,175 L625,155"
                            fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.85" style={{ filter: "drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))" }} />
                    </g>

                    {/* Control Panel */}
                    <rect x="340" y="20" width="130" height="210" rx="4" fill="#151515" stroke="#333" strokeWidth="1" />

                    {/* Knobs Row 1 */}
                    <circle cx="380" cy="80" r="18" fill="url(#knob-gradient-react)" stroke="#555" strokeWidth="1" />
                    <line x1="380" y1="68" x2="380" y2="74" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                    <text x="380" y="113" fontFamily="Orbitron, monospace" fontSize="7" fill="#888" textAnchor="middle">GAIN</text>

                    <circle cx="430" cy="80" r="18" fill="url(#knob-gradient-react)" stroke="#555" strokeWidth="1" />
                    <line x1="430" y1="68" x2="430" y2="74" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                    <text x="430" y="113" fontFamily="Orbitron, monospace" fontSize="7" fill="#888" textAnchor="middle">TIME/DIV</text>

                    {/* Knobs Row 2 */}
                    <circle cx="380" cy="160" r="18" fill="url(#knob-gradient-react)" stroke="#555" strokeWidth="1" />
                    <line x1="380" y1="148" x2="380" y2="154" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                    <text x="380" y="193" fontFamily="Orbitron, monospace" fontSize="7" fill="#888" textAnchor="middle">V-POS</text>

                    <circle cx="430" cy="160" r="18" fill="url(#knob-gradient-react)" stroke="#555" strokeWidth="1" />
                    <line x1="430" y1="148" x2="430" y2="154" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                    <text x="430" y="193" fontFamily="Orbitron, monospace" fontSize="7" fill="#888" textAnchor="middle">TRIGGER</text>

                    {/* Bottom Panel */}
                    <rect x="20" y="240" width="450" height="70" rx="4" fill="#0F0F0F" stroke="#333" strokeWidth="1" />

                    {/* Power Button */}
                    <circle cx="50" cy="275" r="12" fill="#1A1A1A" stroke="#555" strokeWidth="1" />
                    <circle cx="50" cy="275" r="4" fill="#FFD700" opacity="0.9" />
                    <text x="50" y="298" fontFamily="Orbitron, monospace" fontSize="7" fill="#888" textAnchor="middle">POWER</text>

                    {/* Input Connectors */}
                    <circle cx="380" cy="275" r="10" fill="#222" stroke="#FFD700" strokeWidth="2" />
                    <text x="380" y="298" fontFamily="Orbitron, monospace" fontSize="7" fill="#888" textAnchor="middle">CH1</text>

                    <circle cx="430" cy="275" r="10" fill="#222" stroke="#FFD700" strokeWidth="2" />
                    <text x="430" y="298" fontFamily="Orbitron, monospace" fontSize="7" fill="#888" textAnchor="middle">CH2</text>
                </svg>
            </div>

            <motion.p
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity
                }}
                className="text-[var(--accent-color)] text-sm tracking-[0.3em] font-[Orbitron] uppercase font-bold"
            >
                ANALYZING SIGNALS...
            </motion.p>
        </div>
    );
};

export default OscilloscopeLoader;
