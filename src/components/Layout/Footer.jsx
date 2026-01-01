import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full text-center py-8 z-20 relative pointer-events-none mt-auto">
            <a
                href="https://antigravity.google/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-transparent text-[var(--accent-color)] text-xs tracking-widest shadow-lg pointer-events-auto hover:bg-black/90 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
                Built with Google Antigravity 🚀
            </a>
        </footer>
    );
};

export default Footer;
