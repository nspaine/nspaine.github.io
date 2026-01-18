import React, { useLayoutEffect, useRef } from 'react';
import { useLoader } from '../Layout/Layout';

import { initOscilloscopeLoader } from '../../loaders/oscilloscope-loader';

const OscilloscopeLoader = () => {
    const containerRef = useRef(null);
    const { startMinTimer } = useLoader();

    useLayoutEffect(() => {
        startMinTimer();

        let cleanup = null;
        if (containerRef.current) {
            // Only synchronize with initial loader if it's currently visible
            const isInitialLoad = !!document.getElementById('initial-loader');
            const initialStartTime = isInitialLoad ? (window.loaderStartTime || null) : null;
            cleanup = initOscilloscopeLoader(containerRef.current, initialStartTime);
        }

        return () => {
            if (cleanup) cleanup();
        };
    }, [startMinTimer]);

    return (
        <div className="loader-backdrop">
            <div ref={containerRef} className="oscilloscope-container" />
        </div>
    );
};

export default OscilloscopeLoader;
