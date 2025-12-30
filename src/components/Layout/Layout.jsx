import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CircuitryBackground from '../Background/CircuitryBackground';
import profileImg from '../../assets/profile-pixel.webp';
import HomeLoader from '../Loaders/HomeLoader';
import BinaryLoader from '../Loaders/BinaryLoader';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isPortfolio = location.pathname === '/portfolio';

    // State
    const [isReady, setIsReady] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [currentPath, setCurrentPath] = useState(location.pathname);

    // Initial Load Logic (Fonts, Images, External Loader Cleanup)
    useEffect(() => {
        const loadFonts = document.fonts.ready;
        const loadImage = new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = profileImg; // Preload profile image
        });

        // Initial delay matches the request for consistent viewing time
        const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));

        Promise.all([loadFonts, loadImage, minDelay]).then(() => {
            setIsReady(true);
            setIsFading(true);

            // Fade out external loader (index.html)
            const externalLoader = document.getElementById('initial-loader');
            if (externalLoader) {
                externalLoader.style.opacity = '0';
                setTimeout(() => {
                    externalLoader.remove();
                    setShowContent(true);
                }, 500);
            } else {
                setShowContent(true);
            }
        });
    }, []);

    // Navigation Loading Logic (Re-trigger on route change)
    // useLayoutEffect ensures the loader appears BEFORE the next paint, eliminating lag.
    useLayoutEffect(() => {
        // Skip effect on initial mount (handled above) or if path hasn't effectively changed
        if (!isReady) return;

        if (location.pathname !== currentPath) {
            // Start Transition
            setShowContent(false);
            setIsFading(false);
            setCurrentPath(location.pathname);

            // Wait for loader animation (2s min)
            setTimeout(() => {
                setIsFading(true);
                setTimeout(() => setShowContent(true), 500);
            }, 2000);
        }
    }, [location.pathname, isReady, currentPath]);


    // Determine which loader to show
    const LoaderComponent = isPortfolio ? BinaryLoader : HomeLoader;

    return (
        <div className={`h-screen w-screen relative overflow-hidden flex flex-col ${isHomePage ? 'cursor-probe' : ''}`}>

            {/* Background (Rendered unless on Portfolio page) */}
            {!isPortfolio && <CircuitryBackground />}

            {/* Main Content */}
            <main className="flex-grow relative z-10 w-full h-full">
                {children}
            </main>

            {/* Internal Loading Screen Overlay */}
            {!showContent && !document.getElementById('initial-loader') && (
                <div className={`absolute inset-0 z-[9999] ${isFading ? 'fade-out' : ''}`}>
                    <LoaderComponent />
                </div>
            )}
        </div>
    );
};

export default Layout;
