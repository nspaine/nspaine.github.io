import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLoader } from '../Layout/Layout';

// Binary Grid Loader for Home Page
const HomeLoader = () => {
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
            cell.className = 'text-[var(--accent-color)] text-xl sm:text-lg md:text-lg lg:text-xl xl:text-3xl font-bold';
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
                    className="grid grid-cols-10 gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3"
                />

                {/* Loading Text */}
                <motion.p
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity
                    }}
                    className="text-[var(--accent-color)] text-sm tracking-[0.3em] font-[Orbitron] uppercase font-bold"
                >
                    INITIALIZING SYSTEM...
                </motion.p>
            </div>
        </div>
    );
};

export default HomeLoader;
