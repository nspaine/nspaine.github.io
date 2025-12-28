import React from 'react';
import { useLocation } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import CircuitryBackground from '../Background/CircuitryBackground';
import profileImg from '../../assets/profile-pixel.webp';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isPortfolio = location.pathname === '/portfolio';
    const [isReady, setIsReady] = React.useState(false);
    const [isFading, setIsFading] = React.useState(false);
    const [showContent, setShowContent] = React.useState(false);


    React.useEffect(() => {
        const loadFonts = document.fonts.ready;

        const loadImage = new Promise((resolve, reject) => {
            const img = new Image();

            // Timeout safety (2s max wait for image fetch)
            const timeout = setTimeout(resolve, 3000);

            img.onload = () => {
                clearTimeout(timeout);
                resolve();
            };
            img.onerror = () => {
                clearTimeout(timeout);
                resolve(); // Proceed even if fails
            };

            img.src = profileImg;
        });

        const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));

        Promise.all([loadFonts, loadImage, minDelay]).then(() => {
            setIsReady(true);
            setIsFading(true);
            // Wait for fade-out animation to complete before showing content
            setTimeout(() => {
                setShowContent(true);
            }, 200); // Match fade-out duration
        });
    }, []);


    // Unified render with Loading Screen as Overlay
    return (
        <div className={`h-screen w-screen relative overflow-hidden flex flex-col ${isHomePage ? 'cursor-probe' : ''}`}>

            {/* Background (Rendered unless on Portfolio page) */}
            {!isPortfolio && <CircuitryBackground />}

            {/* Main Content (Always rendered behind loading screen) */}
            <main className="flex-grow relative z-10 w-full h-full">
                {children}
            </main>

            {/* Footer removed from here to be placed in individual pages for better scroll control */}

            {/* Loading Screen Overlay */}
            {!showContent && (
                <div className={`absolute inset-0 z-[9999] bg-black flex flex-col items-center justify-center gap-6 ${isFading ? 'fade-out' : ''}`}>
                    <div className="w-64 h-32 overflow-hidden relative">
                        <svg
                            className="w-full h-full animate-square-wave"
                            viewBox="0 0 400 100"
                            preserveAspectRatio="none"
                            style={{ width: '200%' }}
                        >
                            {/* Repeating square wave pattern */}
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
                    <p className="text-[var(--accent-color)] text-sm tracking-[0.3em] font-[Orbitron] uppercase">
                        ANALYZING SIGNALS...
                    </p>
                </div>
            )}
        </div>
    );
};

export default Layout;
