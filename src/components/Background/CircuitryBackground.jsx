import React, { useEffect, useRef } from 'react';

const CircuitryBackground = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const x = e.clientX;
                const y = e.clientY;
                containerRef.current.style.setProperty('--mouse-x', `${x}px`);
                containerRef.current.style.setProperty('--mouse-y', `${y}px`);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{
                '--mouse-x': '50%',
                '--mouse-y': '50%',
                zIndex: 0, // Explicitly behind content (which is 10+)
            }}
        >

            {/* Base Grid */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 215, 0, 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Gold Circuitry Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    maskImage: 'radial-gradient(circle 300px at var(--mouse-x) var(--mouse-y), black, transparent)',
                    WebkitMaskImage: 'radial-gradient(circle 300px at var(--mouse-x) var(--mouse-y), black, transparent)',
                }}
            >
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M10 10 h 80 v 80 h -80 Z" fill="none" stroke="#ffd700" strokeWidth="0.5" />
                            <path d="M50 10 v 20 M50 70 v 20 M10 50 h 20 M70 50 h 20" fill="none" stroke="#ffd700" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="2" fill="#ffd700" />
                            <circle cx="10" cy="10" r="1" fill="#ffd700" />
                            <circle cx="90" cy="90" r="1" fill="#ffd700" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
                </svg>
            </div>

        </div>
    );
};

export default CircuitryBackground;
