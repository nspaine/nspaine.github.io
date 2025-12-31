import React, { useEffect, useRef } from 'react';
import { useLoader } from '../Layout/Layout';

const ArchitectureLoader = () => {
    const { startMinTimer } = useLoader();
    const canvasRef = useRef(null);

    useEffect(() => {
        // Wait for full draw to complete (3s) plus small buffer
        startMinTimer(3500);
    }, [startMinTimer]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // --- INLINE WORKER ---
        if (canvas.transferControlToOffscreen) {
            try {
                const offscreen = canvas.transferControlToOffscreen();

                // Calculate proper canvas dimensions
                const getCanvasDimensions = () => {
                    const maxWidth = 500;
                    const containerWidth = Math.min(window.innerWidth - 32, maxWidth); // 32px for px-4 padding
                    const containerHeight = containerWidth / 2; // 2:1 aspect ratio
                    return { width: containerWidth, height: containerHeight };
                };

                const workerCode = `
                let ctx;
                let width, height;
                let totalLength = 0;
                let startTime = null;
                const cycleDuration = 8000; // 8s total: 3s draw + 1s pause + 4s erase

                // Skyline Points
                const points = [
                    {x:0,y:160}, {x:40,y:160}, {x:50,y:40}, {x:60,y:40}, {x:70,y:160},
                    {x:100,y:160}, {x:100,y:80}, {x:105,y:75}, {x:105,y:50}, {x:115,y:50}, {x:115,y:75}, {x:120,y:80}, {x:120,y:160},
                    {x:150,y:160}, {x:150,y:80}, {x:160,y:70}, {x:170,y:80}, {x:170,y:160},
                    {x:200,y:160}, {x:200,y:30}, {x:210,y:30}, {x:210,y:160},
                    {x:240,y:160}, {x:240,y:60}, {x:260,y:40}, {x:260,y:160},
                    {x:320,y:160}
                ];

                // Pre-calculate segment lengths
                const segments = [];
                
                function init() {
                    let accumulatedLen = 0;
                    for(let i=1; i<points.length; i++) {
                        const p1 = points[i-1];
                        const p2 = points[i];
                        const dx = p2.x - p1.x;
                        const dy = p2.y - p1.y;
                        const len = Math.sqrt(dx*dx + dy*dy);
                        segments.push({
                            p1, p2, len, startDist: accumulatedLen, endDist: accumulatedLen + len
                        });
                        accumulatedLen += len;
                    }
                    totalLength = accumulatedLen;
                }
                init();

                self.onmessage = function(e) {
                    const { type, payload } = e.data;
                    if (type === 'INIT') {
                        ctx = payload.canvas.getContext('2d');
                        resize(payload.width, payload.height);
                        requestAnimationFrame(loop);
                    } else if (type === 'RESIZE') {
                        resize(payload.width, payload.height);
                    }
                };

                function resize(w, h) {
                    width = w;
                    height = h;
                    if(ctx && ctx.canvas) {
                        ctx.canvas.width = w;
                        ctx.canvas.height = h;
                    }
                }

                function loop(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const elapsed = (timestamp - startTime) % cycleDuration;
                    const progress = elapsed / cycleDuration;

                    let drawStart = 0;
                    let drawEnd = width;

                    if (progress < 0.375) {
                        // Drawing IN (0-37.5% = 3s)
                        drawStart = 0;
                        const t = progress / 0.375;
                        drawEnd = totalLength * t;
                    } else if (progress < 0.5) {
                        // PAUSE - hold full skyline (37.5-50% = 1s)
                        drawStart = 0;
                        drawEnd = totalLength;
                    } else {
                        // Erasing OUT (50-100% = 4s)
                        const t = (progress - 0.5) / 0.5;
                        drawStart = totalLength * t;
                        drawEnd = totalLength;
                    }

                    draw(drawStart, drawEnd);
                    requestAnimationFrame(loop);
                }

                function draw(startDist, endDist) {
                    ctx.clearRect(0, 0, width, height);

                    const scale = Math.min(width / 320, height / 160) * 0.8;
                    const tx = (width - 320 * scale) / 2;
                    const ty = (height - 160 * scale) / 2;

                    ctx.save();
                    ctx.translate(tx, ty);
                    ctx.scale(scale, scale);

                    ctx.strokeStyle = '#FFD700';
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.beginPath();
                    
                    let firstPointDrawn = false;

                    for (const seg of segments) {
                        if (seg.endDist < startDist || seg.startDist > endDist) continue;

                        const segDrawStart = Math.max(seg.startDist, startDist);
                        const segDrawEnd = Math.min(seg.endDist, endDist);

                        const t1 = (segDrawStart - seg.startDist) / seg.len;
                        const t2 = (segDrawEnd - seg.startDist) / seg.len;

                        const x1 = seg.p1.x + (seg.p2.x - seg.p1.x) * t1;
                        const y1 = seg.p1.y + (seg.p2.y - seg.p1.y) * t1;
                        const x2 = seg.p1.x + (seg.p2.x - seg.p1.x) * t2;
                        const y2 = seg.p1.y + (seg.p2.y - seg.p1.y) * t2;

                        if (!firstPointDrawn) {
                            ctx.moveTo(x1, y1);
                            firstPointDrawn = true;
                        }
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                    }
                    ctx.stroke();
                    ctx.restore();
                }
            `;

                const blob = new Blob([workerCode], { type: 'application/javascript' });
                const worker = new Worker(URL.createObjectURL(blob));

                const initialDimensions = getCanvasDimensions();
                worker.postMessage({
                    type: 'INIT',
                    payload: {
                        canvas: offscreen,
                        width: initialDimensions.width,
                        height: initialDimensions.height
                    }
                }, [offscreen]);

                const handleResize = () => {
                    const dimensions = getCanvasDimensions();
                    worker.postMessage({
                        type: 'RESIZE',
                        payload: { width: dimensions.width, height: dimensions.height }
                    });
                };
                window.addEventListener('resize', handleResize);

                return () => {
                    worker.terminate();
                    window.removeEventListener('resize', handleResize);
                };
            } catch (err) {
                console.warn("Failed to transfer control to offscreen canvas (already transferred?)", err);
            }
        }
    }, []);

    return (
        <div className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center gap-8">
            <div className="relative w-full max-w-[500px] aspect-[2/1] flex items-center justify-center px-4">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ display: 'block' }}
                />
                <div className="absolute inset-0 bg-[var(--accent-color)] opacity-5 blur-3xl rounded-full pointer-events-none" />
            </div>

            <div className="flex flex-col items-center gap-2">
                <p className="text-[var(--accent-color)] text-sm tracking-[0.3em] font-[Orbitron] font-bold uppercase animate-pulse">
                    RENDERING GEOMETRY...
                </p>
            </div>
        </div>
    );
};

export default ArchitectureLoader;
