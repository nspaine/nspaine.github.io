import React, { useState, useEffect, useLayoutEffect, createContext, useContext } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import CircuitryBackground from '../Background/CircuitryBackground';
import profileImg from '../../assets/profile-pixel.webp';
import HomeLoader from '../Loaders/HomeLoader';
import OscilloscopeLoader from '../Loaders/OscilloscopeLoader';
import ArchitectureLoader from '../Loaders/ArchitectureLoader';

// Export Context for Pages to use
export const LoaderContext = createContext({
    setAreAssetsLoaded: () => { },
    startMinTimer: () => { },
});

export const useLoader = () => useContext(LoaderContext);

// Helper to check if a page has been visited this session
const hasVisitedPage = (path) => {
    try {
        const visited = JSON.parse(sessionStorage.getItem('visitedPages') || '[]');
        return visited.includes(path);
    } catch {
        return false;
    }
};

// Helper to mark a page as visited this session
const markPageVisited = (path) => {
    try {
        const visited = JSON.parse(sessionStorage.getItem('visitedPages') || '[]');
        if (!visited.includes(path)) {
            visited.push(path);
            sessionStorage.setItem('visitedPages', JSON.stringify(visited));
        }
    } catch {
        // Ignore storage errors
    }
};

const Layout = ({ children }) => {
    const location = useLocation();
    const navigation = useNavigation();
    const isHomePage = location.pathname === '/';
    const isPortfolio = location.pathname === '/portfolio';
    const isArchitecture = location.pathname === '/architecture';

    // Track if this is the initial page load (initial-loader exists)
    const hadInitialLoader = React.useRef(!!document.getElementById('initial-loader'));

    // State
    const [isReady, setIsReady] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [currentPath, setCurrentPath] = useState(location.pathname);

    // Asset Loading State 
    const isRoot = location.pathname === '/';
    const isPortPage = location.pathname.includes('/portfolio');
    const isArchPage = location.pathname.includes('/architecture');

    // Lock assets for pages that need loading
    const shouldLockInitially = isPortPage || isArchPage || isRoot;

    const [areAssetsLoaded, setAreAssetsLoaded] = useState(() => !shouldLockInitially);
    const [minTimePassed, setMinTimePassed] = useState(false);

    // Initial Load Logic - Only runs on initial page load
    useEffect(() => {
        // This only runs once on mount
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
            setMinTimePassed(true);
        });
    }, []);

    // Timer Start Function (Exposed to Loaders)
    const startMinTimer = React.useCallback((duration = 2000) => {
        setTimeout(() => {
            setMinTimePassed(true);
        }, duration);
    }, []);

    // Navigation Logic
    const wasNavigating = React.useRef(false);

    useLayoutEffect(() => {
        if (!isReady) return;

        // Track when navigation completes
        if (wasNavigating.current && navigation.state === 'idle') {
            // Navigation just completed - set timer as passed since route loader handled the delay
            wasNavigating.current = false;
            setMinTimePassed(true);
        }

        // If navigating, check if destination was already visited
        if (navigation.state === 'loading' && navigation.location) {
            const destPath = navigation.location.pathname;
            if (hasVisitedPage(destPath)) {
                // Skip loader for already-visited pages
                setShowContent(true);
                setMinTimePassed(true);
                setAreAssetsLoaded(true);
                return;
            }
            // Track that we're navigating to a new page
            wasNavigating.current = true;
        }

        // IMMEDIATE FEEDBACK: If router is transitioning/loading to NEW page, lock the gate.
        if (navigation.state === 'loading') {
            setShowContent(false);
            setIsFading(false);
            setMinTimePassed(false);
            setAreAssetsLoaded(false);
            return;
        }

        if (location.pathname !== currentPath) {
            // Check if we've already visited this page
            if (hasVisitedPage(location.pathname)) {
                setShowContent(true);
                setMinTimePassed(true);
                setAreAssetsLoaded(true);
                setCurrentPath(location.pathname);
                return;
            }

            // Reset States for Transition to NEW page
            setShowContent(false);
            setIsFading(false);

            // Route-Specific Gate Logic
            const nextPathIsPortfolio = location.pathname.includes('/portfolio');
            const nextPathIsArchitecture = location.pathname.includes('/architecture');
            const nextPathIsHome = location.pathname === '/';

            if (nextPathIsPortfolio || nextPathIsArchitecture || nextPathIsHome) {
                setAreAssetsLoaded(false);
            } else {
                setAreAssetsLoaded(true);
            }

            setCurrentPath(location.pathname);
        }
    }, [location.pathname, isReady, currentPath, navigation.state, navigation.location]);

    // Unified "Show Content" Trigger
    // Matches: (Timer Completed) AND (Page Assets Loaded)
    useEffect(() => {
        if (isReady && minTimePassed && areAssetsLoaded) {
            // Mark this page as visited for the session
            markPageVisited(location.pathname);

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
    }, [isReady, minTimePassed, areAssetsLoaded, location.pathname]);


    // Determine target path for loader selection
    // If navigating, look ahead to the destination. Otherwise use current.
    const targetPath = (navigation.state === 'loading' && navigation.location)
        ? navigation.location.pathname
        : location.pathname;

    const isTargetPortfolio = targetPath.includes('/portfolio');
    const isTargetArchitecture = targetPath.includes('/architecture');

    // Determine which loader to show
    let LoaderComponent = HomeLoader;
    if (isTargetPortfolio) LoaderComponent = OscilloscopeLoader;
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
                {(
                    // Show when navigating to an unvisited page
                    (navigation.state === 'loading' && navigation.location && !hasVisitedPage(navigation.location.pathname)) ||
                    // Or when content is not ready and we're past initial load
                    (!showContent && !document.getElementById('initial-loader'))
                ) && (
                        <div className={`absolute inset-0 z-[9999] ${isFading ? 'fade-out' : ''}`}>
                            <LoaderComponent />
                        </div>
                    )}
            </div>
        </LoaderContext.Provider>
    );
};

export default Layout;
