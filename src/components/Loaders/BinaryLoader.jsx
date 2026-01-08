import React, { useEffect, useRef } from 'react';
import { useLoader } from '../Layout/Layout';

// Binary Grid Loader v2.0
const BinaryLoader = () => {
    const gridRef = useRef(null);
    const { startMinTimer } = useLoader();

    useEffect(() => {
        startMinTimer();

        const grid = gridRef.current;
        if (!grid) return;

        // Create 10x10 grid of binary digits
        const gridSize = 10;
        const cells = [];

        // Initialize grid with random 0s and 1s
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.textContent = Math.random() > 0.5 ? '1' : '0';
            cell.className = 'text-[var(--accent-color)] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold';
            cell.style.fontFamily = '"Orbitron", monospace';
            cell.style.textAlign = 'center';
            grid.appendChild(cell);
            cells.push(cell);
        }

        // Randomly flip cells
        const flipInterval = setInterval(() => {
            // Flip 1-3 random cells each interval
            const numFlips = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numFlips; i++) {
                const randomIndex = Math.floor(Math.random() * cells.length);
                const cell = cells[randomIndex];
                cell.textContent = cell.textContent === '0' ? '1' : '0';

                // Add a brief flash effect
                cell.style.opacity = '0.5';
                setTimeout(() => {
                    cell.style.opacity = '1';
                }, 50);
            }
        }, 100);

        return () => {
            clearInterval(flipInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center gap-8">
                {/* 10x10 Binary Grid */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-10 gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3"
                />

                {/* Loading Text */}
                <p className="text-[var(--accent-color)] text-sm tracking-[0.2em] font-[Orbitron] font-bold uppercase animate-pulse">
                    DOWNLOADING BYTES...
                </p>
            </div>
        </div>
    );
};

export default BinaryLoader;

