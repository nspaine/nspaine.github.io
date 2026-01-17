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
            cleanup = initOscilloscopeLoader(containerRef.current);
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
