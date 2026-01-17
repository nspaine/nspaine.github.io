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
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1A3A1A" stroke-width="0.5" opacity="0.3" />
                </pattern>
                <clipPath id="screen-clip-oscilloscope">
                    <rect x="25" y="25" width="300" height="200" rx="4" />
                </clipPath>
                <radialGradient id="knob-gradient-oscilloscope">
                    <stop offset="0%" stop-color="#4A4A4A" />
                    <stop offset="50%" stop-color="#2A2A2A" />
                    <stop offset="100%" stop-color="#1A1A1A" />
                </radialGradient>
            </defs>

            <!-- Chassis -->
            <rect x="0" y="0" width="480" height="320" rx="8" fill="#1A1A1A" stroke="#333" stroke-width="2" />

            <!-- Screen Bezel -->
            <rect x="20" y="20" width="310" height="210" rx="6" fill="#0A0A0A" stroke="#444" stroke-width="2" />

            <!-- CRT Screen -->
            <rect x="25" y="25" width="300" height="200" rx="4" fill="#050505" />

            <!-- Grid -->
            <rect x="25" y="25" width="300" height="200" fill="url(#grid-pattern-oscilloscope)" clip-path="url(#screen-clip-oscilloscope)" />

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
                    fill="none" stroke="#FFD700" stroke-width="2" opacity="0.85" style="filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.6));" />
            </g>

            <!-- Control Panel -->
            <rect x="340" y="20" width="130" height="210" rx="4" fill="#151515" stroke="#333" stroke-width="1" />

            <!-- Knobs Row 1 -->
            <circle cx="380" cy="80" r="18" fill="url(#knob-gradient-oscilloscope)" stroke="#555" stroke-width="1" />
            <line x1="380" y1="68" x2="380" y2="74" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
            <text x="380" y="113" font-family="Orbitron, monospace" font-size="7" fill="#888" text-anchor="middle">GAIN</text>

            <circle cx="430" cy="80" r="18" fill="url(#knob-gradient-oscilloscope)" stroke="#555" stroke-width="1" />
            <line x1="430" y1="68" x2="430" y2="74" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
            <text x="430" y="113" font-family="Orbitron, monospace" font-size="7" fill="#888" text-anchor="middle">TIME/DIV</text>

            <!-- Knobs Row 2 -->
            <circle cx="380" cy="160" r="18" fill="url(#knob-gradient-oscilloscope)" stroke="#555" stroke-width="1" />
            <line x1="380" y1="148" x2="380" y2="154" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
            <text x="380" y="193" font-family="Orbitron, monospace" font-size="7" fill="#888" text-anchor="middle">V-POS</text>

            <circle cx="430" cy="160" r="18" fill="url(#knob-gradient-oscilloscope)" stroke="#555" stroke-width="1" />
            <line x1="430" y1="148" x2="430" y2="154" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
            <text x="430" y="193" font-family="Orbitron, monospace" font-size="7" fill="#888" text-anchor="middle">TRIGGER</text>

            <!-- Bottom Panel -->
            <rect x="20" y="240" width="450" height="70" rx="4" fill="#0F0F0F" stroke="#333" stroke-width="1" />

            <!-- Power Button -->
            <circle cx="50" cy="275" r="12" fill="#1A1A1A" stroke="#555" stroke-width="1" />
            <circle cx="50" cy="275" r="4" fill="#FFD700" opacity="0.9" />
            <text x="50" y="298" font-family="Orbitron, monospace" font-size="7" fill="#888" text-anchor="middle">POWER</text>

            <!-- Input Connectors -->
            <circle cx="380" cy="275" r="10" fill="#222" stroke="#FFD700" stroke-width="2" />
            <text x="380" y="298" font-family="Orbitron, monospace" font-size="7" fill="#888" text-anchor="middle">CH1</text>

            <circle cx="430" cy="275" r="10" fill="#222" stroke="#FFD700" stroke-width="2" />
            <text x="430" y="298" font-family="Orbitron, monospace" font-size="7" fill="#888" text-anchor="middle">CH2</text>
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
