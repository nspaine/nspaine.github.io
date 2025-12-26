import React from 'react';
import { useLocation } from 'react-router-dom';
import CircuitryBackground from '../Background/CircuitryBackground';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        // Added 'bg-neutral-950' as static fallback
        <div className={`h-screen w-screen relative overflow-hidden flex flex-col ${isHomePage ? 'cursor-probe' : ''}`}>
            {isHomePage && <CircuitryBackground />}

            {/* Main Content Area */}
            <main className="flex-grow relative z-10 w-full h-full">
                {children}
            </main>

            {/* Footer */}
            <footer className="absolute bottom-4 left-0 w-full text-center z-20 pointer-events-none">
                <a
                    href="https://antigravity.google/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-transparent text-[var(--accent-color)] text-xs tracking-widest shadow-lg pointer-events-auto hover:bg-black/90 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                    Created with Google Antigravity 🚀
                </a>
            </footer>
        </div>
    );
};

export default Layout;
