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
            cleanup = initArchitectureLoader(containerRef.current);
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
