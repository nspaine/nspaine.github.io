/**
 * Shared Oscilloscope Loader Logic
 * Used by index.html (initial static load) and OscilloscopeLoader.jsx (React component)
 */
export const LOADER_DURATION = 2000;

export function initOscilloscopeLoader(container) {
    if (!container) return null;

    // Standardize container class
    container.classList.add('oscilloscope-container');

    container.innerHTML = `
        <svg viewBox="0 0 480 320" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; display: block;">
            <defs>
                <pattern id="grid-pattern-oscilloscope" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#FFD700" stroke-width="0.5" opacity="0.15" />
                </pattern>
                <clipPath id="screen-clip-oscilloscope">
                    <rect x="25" y="25" width="300" height="180" rx="4" />
                </clipPath>
            </defs>

            <!-- Chassis Wireframe -->
            <rect x="0" y="0" width="480" height="320" rx="8" fill="none" stroke="#FFD700" stroke-width="1.5" opacity="0.8" />

            <!-- Screen Bezel Panel -->
            <rect x="20" y="20" width="310" height="190" rx="6" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.6" />

            <!-- Grid -->
            <rect x="25" y="25" width="300" height="180" fill="url(#grid-pattern-oscilloscope)" clip-path="url(#screen-clip-oscilloscope)" />

            <!-- Channel 1: Clock -->
            <g clip-path="url(#screen-clip-oscilloscope)">
                <path class="scope-wave"
                    d="M25,85 L37.5,85 L37.5,115 L50,115 L50,85 L62.5,85 L62.5,115 L75,115 L75,85 L87.5,85 L87.5,115 L100,115 L100,85 L112.5,85 L112.5,115 L125,115 L125,85 L137.5,85 L137.5,115 L150,115 L150,85 L162.5,85 L162.5,115 L175,115 L175,85 L187.5,85 L187.5,115 L200,115 L200,85 L212.5,85 L212.5,115 L225,115 L225,85 L237.5,85 L237.5,115 L250,115 L250,85 L262.5,85 L262.5,115 L275,115 L275,85 L287.5,85 L287.5,115 L300,115 L300,85 L312.5,85 L312.5,115 L325,115 L325,85 L337.5,85 L337.5,115 L350,115 L350,85 L362.5,85 L362.5,115 L375,115 L375,85 L387.5,85 L387.5,115 L400,115 L400,85 L412.5,85 L412.5,115 L425,115 L425,85 L437.5,85 L437.5,115 L450,115 L450,85 L462.5,85 L462.5,115 L475,115 L475,85 L487.5,85 L487.5,115 L500,115 L500,85 L512.5,85 L512.5,115 L525,115 L525,85 L537.5,85 L537.5,115 L550,115 L550,85 L562.5,85 L562.5,115 L575,115 L575,85 L587.5,85 L587.5,115 L600,115 L600,85 L612.5,85 L612.5,115 L625,115 L625,85"
                    fill="none" stroke="#FFD700" stroke-width="2" style="filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.8));" />
            </g>

            <!-- Channel 2: Random -->
            <g clip-path="url(#screen-clip-oscilloscope)">
                <path class="scope-wave"
                    d="M25,155 L40,155 L40,175 L70,175 L70,155 L100,155 L100,175 L115,175 L130,175 L130,155 L160,155 L175,155 L175,175 L190,175 L220,175 L220,155 L250,155 L265,155 L265,175 L295,175 L325,175 L325,155 L340,155 L340,175 L370,175 L370,155 L400,155 L400,175 L415,175 L430,175 L430,155 L460,155 L475,155 L475,175 L490,175 L520,175 L520,155 L550,155 L565,155 L565,175 L595,175 L625,175 L625,155"
                    fill="none" stroke="#FFD700" stroke-width="2" style="filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.8));" />
            </g>

            <!-- Control Panel Panel -->
            <rect x="350" y="20" width="110" height="190" rx="4" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.5" />

            <!-- Knobs Row 1 -->
            <circle cx="385" cy="70" r="18" fill="none" stroke="#FFD700" stroke-width="1.5" opacity="0.8" />
            <line x1="385" y1="58" x2="385" y2="64" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
            <text x="385" y="103" font-family="Orbitron, monospace" font-size="7" fill="#FFD700" text-anchor="middle" opacity="0.7">GAIN</text>

            <circle cx="425" cy="70" r="18" fill="none" stroke="#FFD700" stroke-width="1.5" opacity="0.8" />
            <line x1="425" y1="58" x2="425" y2="64" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
            <text x="425" y="103" font-family="Orbitron, monospace" font-size="7" fill="#FFD700" text-anchor="middle" opacity="0.7">TIME/DIV</text>

            <!-- Knobs Row 2 -->
            <circle cx="385" cy="140" r="18" fill="none" stroke="#FFD700" stroke-width="1.5" opacity="0.8" />
            <line x1="385" y1="128" x2="385" y2="134" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
            <text x="385" y="173" font-family="Orbitron, monospace" font-size="7" fill="#FFD700" text-anchor="middle" opacity="0.7">V-POS</text>

            <circle cx="425" cy="140" r="18" fill="none" stroke="#FFD700" stroke-width="1.5" opacity="0.8" />
            <line x1="425" y1="128" x2="425" y2="134" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
            <text x="425" y="173" font-family="Orbitron, monospace" font-size="7" fill="#FFD700" text-anchor="middle" opacity="0.7">TRIGGER</text>

            <!-- Bottom Panel Panel -->
            <rect x="20" y="230" width="440" height="70" rx="4" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.5" />

            <!-- Power Button Wireframe -->
            <circle cx="50" cy="265" r="12" fill="none" stroke="#FFD700" stroke-width="1.5" opacity="0.8" />
            <circle cx="50" cy="265" r="4" fill="none" stroke="#FFD700" stroke-width="1.5" />
            <text x="50" y="288" font-family="Orbitron, monospace" font-size="7" fill="#FFD700" text-anchor="middle" opacity="0.7">POWER</text>

            <!-- Input Connectors Wireframe -->
            <circle cx="385" cy="265" r="10" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.9" />
            <text x="385" y="288" font-family="Orbitron, monospace" font-size="7" fill="#FFD700" text-anchor="middle" opacity="0.7">CH1</text>

            <circle cx="425" cy="265" r="10" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.9" />
            <text x="425" y="288" font-family="Orbitron, monospace" font-size="7" fill="#FFD700" text-anchor="middle" opacity="0.7">CH2</text>
        </svg>
    `;

    return () => {
        container.innerHTML = '';
    };
}

// Global assignment for index.html (loaded as module)
if (typeof window !== 'undefined') {
    window.initOscilloscopeLoader = initOscilloscopeLoader;
}
