import React from 'react';
import CircuitryBackground from '../Background/CircuitryBackground';

const Layout = ({ children }) => {
    return (
        // Added 'bg-neutral-950' as static fallback
        <div className="h-screen w-screen relative overflow-hidden flex flex-col">
            <CircuitryBackground />

            {/* Main Content Area */}
            <main className="flex-grow relative z-10 w-full h-full">
                {children}
            </main>

            {/* Footer */}
            <footer className="absolute bottom-4 left-0 w-full text-center z-20 pointer-events-none">
                <p className="text-[var(--text-secondary)] text-xs tracking-widest opacity-70">
                    Created with Google Antigravity 🚀
                </p>
            </footer>
        </div>
    );
};

export default Layout;
