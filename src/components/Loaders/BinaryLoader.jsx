import React, { useLayoutEffect, useRef } from 'react';
import { useLoader } from '../Layout/Layout';

import { initBinaryLoader } from '../../loaders/binary-loader';

// Binary Grid Loader for Home Page
const BinaryLoader = () => {
    const gridRef = useRef(null);
    const { startMinTimer } = useLoader();

    useLayoutEffect(() => {
        startMinTimer();

        let cleanup = null;
        if (gridRef.current) {
            cleanup = initBinaryLoader(gridRef.current);
        }

        return () => {
            if (cleanup) cleanup();
        };
    }, [startMinTimer]);

    return (
        <div className="loader-backdrop overflow-hidden">
            <div ref={gridRef} className="binary-grid-container" />
        </div>
    );
};

export default BinaryLoader;
