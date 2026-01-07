import React, { useState, useEffect, useLayoutEffect, createContext, useContext } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import CircuitryBackground from '../Background/CircuitryBackground';
import profileImg from '../../assets/profile-pixel.webp';
import HomeLoader from '../Loaders/HomeLoader';
import BinaryLoader from '../Loaders/BinaryLoader';
import ArchitectureLoader from '../Loaders/ArchitectureLoader';

// Export Context for Pages to use
export const LoaderContext = createContext({
    setAreAssetsLoaded: () => { },
    startMinTimer: () => { },
});

export const useLoader = () => useContext(LoaderContext);

const Layout = ({ children }) => {
    const location = useLocation();
    const navigation = useNavigation();
    const isHomePage = location.pathname === '/';
    const isPortfolio = location.pathname === '/portfolio';
    const isArchitecture = location.pathname === '/architecture';

    // State
    const [isReady, setIsReady] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [currentPath, setCurrentPath] = useState(location.pathname);

    // Asset Loading State 
    // CRITICAL FIX: Initialize based on route. If on Portfolio OR Home, default to FALSE (Locked).
    const isRoot = location.pathname === '/';
    const isPortPage = location.pathname.includes('/portfolio');
    const isArchPage = location.pathname.includes('/architecture');
    // Determine initial lock state: Lock if Home OR Portfolio
    const shouldLockInitially = isPortPage || isArchPage || isRoot;

    const [areAssetsLoaded, setAreAssetsLoaded] = useState(() => !shouldLockInitially);
    const [minTimePassed, setMinTimePassed] = useState(false);

    // Initial Load Logic
    useEffect(() => {
        const loadFonts = document.fonts.ready;
        const loadImage = new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = profileImg; // Preload profile image
        });

        const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));

        Promise.all([loadFonts, loadImage, minDelay]).then(() => {
            setIsReady(true);
            // setMinTimePassed(true); // Don't auto-set here on initial load either if we want absolute strictness, 
            // but for initial load, the "Offline" loader handles early visual.
            // Let's keep it safe:
            setMinTimePassed(true);
        });
    }, []);

    // Timer Start Function (Exposed to Loaders)
    // Child Loaders call this when they MOUNT and are VISIBLE.
    // Timer Start Function (Exposed to Loaders)
    // Child Loaders call this when they MOUNT and are VISIBLE.
    const startMinTimer = React.useCallback((duration = 2000) => {
        setTimeout(() => {
            setMinTimePassed(true);
        }, duration);
    }, []);

    // Navigation Logic
    useLayoutEffect(() => {
        if (!isReady) return;

        // IMMEDAITE FEEDBACK: If router is transitioning/loading, lock the gate.
        // This handles cases where lazy loading chunks (Suspense) pauses the location update.
        if (navigation.state === 'loading') {
            setShowContent(false);
            setIsFading(false);
            setMinTimePassed(false);
            setAreAssetsLoaded(false);
            return;
        }

        if (location.pathname !== currentPath) {
            // Reset States for Transition
            setShowContent(false);
            setIsFading(false);
            setMinTimePassed(false);

            // Route-Specific Gate Logic
            // If going to Portfolio OR Home, LOCK the gate (false). Child component must unlock it.
            const nextPathIsPortfolio = location.pathname.includes('/portfolio');
            const nextPathIsArchitecture = location.pathname.includes('/architecture');
            const nextPathIsHome = location.pathname === '/';

            if (nextPathIsPortfolio || nextPathIsArchitecture || nextPathIsHome) {
                setAreAssetsLoaded(false);
            } else {
                setAreAssetsLoaded(true);
            }

            setCurrentPath(location.pathname);

            // AUTO-TIMER REMOVED.
            // Waited for child loader to call startMinTimer()
        }
    }, [location.pathname, isReady, currentPath, navigation.state]);

    // Unified "Show Content" Trigger
    // Matches: (Timer Completed) AND (Page Assets Loaded)
    useEffect(() => {
        if (isReady && minTimePassed && areAssetsLoaded) {
            // Start Fade Sequence
            // Handle external loader cleanup if it exists (Initial load)
            const externalLoader = document.getElementById('initial-loader');
            if (externalLoader) {
                setIsFading(true);
                externalLoader.style.opacity = '0';
                setTimeout(() => {
                    externalLoader.remove();
                    setShowContent(true);
                }, 500);
            } else {
                // Navigation Pulse
                setIsFading(true);
                setTimeout(() => setShowContent(true), 500);
            }
        }
    }, [isReady, minTimePassed, areAssetsLoaded]);


    // Determine target path for loader selection
    // If navigating, look ahead to the destination. Otherwise use current.
    const targetPath = (navigation.state === 'loading' && navigation.location)
        ? navigation.location.pathname
        : location.pathname;

    const isTargetPortfolio = targetPath.includes('/portfolio');
    const isTargetArchitecture = targetPath.includes('/architecture');

    // Determine which loader to show
    let LoaderComponent = HomeLoader;
    if (isTargetPortfolio) LoaderComponent = BinaryLoader;
    if (isTargetArchitecture) LoaderComponent = ArchitectureLoader;

    return (
        <LoaderContext.Provider value={{ setAreAssetsLoaded, startMinTimer }}>
            <div className={`h-[100dvh] w-screen relative overflow-hidden flex flex-col ${(isHomePage || isPortfolio || isArchitecture) ? 'cursor-probe' : ''}`}>

                {/* Background */}
                {(!isPortfolio && !isArchitecture) && <CircuitryBackground />}

                {/* Main Content */}
                <main className="flex-grow relative z-10 w-full h-full overflow-hidden">
                    {children}
                </main>

                {/* Internal Loading Screen Overlay */}
                {!showContent && !document.getElementById('initial-loader') && (
                    <div className={`absolute inset-0 z-[9999] ${isFading ? 'fade-out' : ''}`}>
                        <LoaderComponent />
                    </div>
                )}
            </div>
        </LoaderContext.Provider>
    );
};

export default Layout;
