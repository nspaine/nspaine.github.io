import React, { useEffect, useRef } from 'react';

const BinaryLoader = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Binary Stream Config
        const fontSize = 14;
        const columns = Math.ceil(canvas.width / fontSize);
        const drops = Array(columns).fill(1).map(() => Math.random() * -100); // Random start positions

        const draw = () => {
            // Semi-transparent black fill for trail effect
            ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#FFD700'; // Gold
            ctx.font = `${fontSize}px 'Courier New', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = Math.random() > 0.5 ? '1' : '0';
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-80"
            />

            <div className="relative z-10 flex flex-col items-center gap-4">
                <p className="text-[var(--accent-color)] text-sm tracking-[0.2em] font-[Orbitron] font-bold uppercase animate-pulse">
                    DOWNLOADING BYTES...
                </p>
            </div>
        </div>
    );
};

export default BinaryLoader;
