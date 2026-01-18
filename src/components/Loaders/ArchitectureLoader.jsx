import React, { useLayoutEffect, useRef } from 'react';
import { useLoader } from '../Layout/Layout';
import { initArchitectureLoader } from '../../loaders/architecture-loader';

const ArchitectureLoader = () => {
    const containerRef = useRef(null);
    const { startMinTimer } = useLoader();

    useLayoutEffect(() => {
        startMinTimer();

        let cleanup = null;
        if (containerRef.current) {
            // Only synchronize with initial loader if it's currently visible
            const isInitialLoad = !!document.getElementById('initial-loader');
            const initialStartTime = isInitialLoad ? (window.loaderStartTime || null) : null;
            cleanup = initArchitectureLoader(containerRef.current, initialStartTime);
        }

        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    return (
        <div className="loader-backdrop">
            <div ref={containerRef} className="architecture-container" />
        </div>
    );
};

export default ArchitectureLoader;
