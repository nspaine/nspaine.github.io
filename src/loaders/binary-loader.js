/**
 * Shared Binary Grid Loader Logic
 * Used by index.html (initial static load) and BinaryLoader.jsx (React component)
 */
export const LOADER_DURATION = 2000;

export function initBinaryLoader(container) {
    if (!container) return null;

    // Clear existing content
    container.innerHTML = '';

    // Ensure container has the base class
    container.classList.add('binary-grid-container');

    const gridSize = 10;
    const totalCells = gridSize * gridSize;
    const cells = [];

    // Create cells
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.textContent = Math.random() > 0.5 ? '1' : '0';
        cell.className = 'binary-grid-cell';
        container.appendChild(cell);
        cells.push(cell);
    }

    // State for orderly flipping: Each cell flips once per cycle
    let availableIndices = [];
    const resetIndices = () => {
        availableIndices = Array.from({ length: totalCells }, (_, i) => i);
        // Fisher-Yates Shuffle
        for (let i = availableIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
        }
    };

    resetIndices();

    // Animation interval
    const flipInterval = setInterval(() => {
        // Flip a few cells per tick for smoothness
        const flipsPerTick = 2;

        for (let i = 0; i < flipsPerTick; i++) {
            if (availableIndices.length === 0) {
                resetIndices();
            }

            const randomIndex = availableIndices.pop();
            const cell = cells[randomIndex];
            if (!cell) continue;

            cell.textContent = cell.textContent === '0' ? '1' : '0';
        }
    }, 100);

    // Return cleanup function
    return () => {
        clearInterval(flipInterval);
        container.innerHTML = '';
    };
}

// Global assignment for index.html (loaded as module)
if (typeof window !== 'undefined') {
    window.initBinaryLoader = initBinaryLoader;
}
