import React, { useEffect, useRef } from 'react';
import { useLoader } from '../Layout/Layout';
// Import Worker using Vite's suffix syntax
import MatrixWorker from './matrix.worker.js?worker';

const BinaryLoader = () => {
    const canvasRef = useRef(null);
    const { startMinTimer } = useLoader();

    useEffect(() => {
        startMinTimer();
        const canvas = canvasRef.current;
        let worker;
        let animationFrameId;

        // --- RESIZE HANDLER ---
        const handleResize = () => {
            if (worker) {
                worker.postMessage({
                    type: 'RESIZE',
                    payload: { width: window.innerWidth, height: window.innerHeight }
                });
            } else if (canvas && !worker) {
                // Main thread resize (Fallback case)
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };

        // --- WEB WORKER IMPLEMENTATION (OffscreenCanvas) ---
        if (canvas.transferControlToOffscreen) {
            try {
                const offscreen = canvas.transferControlToOffscreen();
                worker = new MatrixWorker();
                worker.postMessage({
                    type: 'INIT',
                    payload: {
                        canvas: offscreen,
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                }, [offscreen]); // Transfer ownership
            } catch (e) {
                console.warn("Worker init failed, falling back to main thread:", e);
                // Fallback logic below will catch if worker remains undefined
            }
        }

        // --- MAIN THREAD FALLBACK (If OffscreenCanvas not supported) ---
        if (!worker) {
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Binary Stream Config
            const fontSize = 14;
            let columns = Math.ceil(canvas.width / fontSize);
            let drops = Array(columns).fill(1).map(() => Math.random() * -100);

            // Re-calc columns on manual resize if worker didn't take over
            const manualResize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                columns = Math.ceil(canvas.width / fontSize);
                drops = Array(columns).fill(1).map(() => Math.random() * -100);
            };
            window.addEventListener('resize', manualResize);

            const draw = () => {
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

            // Cleanup for fallback
            return () => {
                window.removeEventListener('resize', manualResize);
                cancelAnimationFrame(animationFrameId);
            };
        }

        // --- GENERAL CLEANUP ---
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (worker) {
                worker.terminate();
            }
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
