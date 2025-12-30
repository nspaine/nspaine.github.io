import React from 'react';

const HomeLoader = () => {
    return (
        <div className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center gap-6">
            <div className="w-64 h-32 overflow-hidden relative">
                <svg
                    className="w-full h-full animate-square-wave"
                    viewBox="0 0 400 100"
                    preserveAspectRatio="none"
                    style={{ width: '200%' }}
                >
                    <path
                        d="M0,80 L0,20 L50,20 L50,80 L100,80 L100,20 L150,20 L150,80 L200,80 L200,20 L250,20 L250,80 L300,80 L300,20 L350,20 L350,80 L400,80"
                        fill="none"
                        stroke="var(--accent-color)"
                        strokeWidth="3"
                        strokeLinecap="square"
                        filter="drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))"
                    />
                </svg>
            </div>
            <p className="text-[var(--accent-color)] text-sm tracking-[0.3em] font-[Orbitron] uppercase font-bold">
                ANALYZING SIGNALS...
            </p>
        </div>
    );
};

export default HomeLoader;
