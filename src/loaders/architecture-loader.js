/**
 * Shared Architecture Loader Logic
 * Used by index.html (initial static load) and ArchitectureLoader.jsx (React component)
 */
export const LOADER_DURATION = 3500;

export function initArchitectureLoader(container) {
    if (!container) return null;

    container.innerHTML = '';
    // Standardize container class
    container.classList.add('architecture-container');

    // Add background glow
    const glow = document.createElement('div');
    glow.className = 'absolute inset-0 bg-[var(--accent-color)] opacity-5 blur-3xl rounded-full pointer-events-none';
    container.appendChild(glow);

    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-full';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    if (canvas.transferControlToOffscreen) {
        try {
            const offscreen = canvas.transferControlToOffscreen();

            const workerCode = `
            let ctx;
            let width, height;
            let totalLength = 0;
            let startTime = null;
            const cycleDuration = 8000;

            const points = [
                {x:0,y:160}, {x:40,y:160}, {x:50,y:40}, {x:60,y:40}, {x:70,y:160},
                {x:100,y:160}, {x:100,y:80}, {x:105,y:75}, {x:105,y:50}, {x:115,y:50}, {x:115,y:75}, {x:120,y:80}, {x:120,y:160},
                {x:150,y:160}, {x:150,y:80}, {x:160,y:70}, {x:170,y:80}, {x:170,y:160},
                {x:200,y:160}, {x:200,y:30}, {x:210,y:30}, {x:210,y:160},
                {x:240,y:160}, {x:240,y:60}, {x:260,y:40}, {x:260,y:160},
                {x:320,y:160}
            ];

            const segments = [];
            function init() {
                let acc = 0;
                for(let i=1; i<points.length; i++) {
                    const p1 = points[i-1], p2 = points[i];
                    const dx = p2.x-p1.x, dy = p2.y-p1.y;
                    const len = Math.sqrt(dx*dx+dy*dy);
                    segments.push({p1, p2, len, startDist: acc, endDist: acc+len});
                    acc += len;
                }
                totalLength = acc;
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
                width = w; height = h;
                if(ctx && ctx.canvas) {
                    ctx.canvas.width = w;
                    ctx.canvas.height = h;
                }
            }

            function loop(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = (timestamp - startTime) % cycleDuration;
                const progress = elapsed / cycleDuration;
                let drawStart = 0, drawEnd = 0;

                if (progress < 0.375) {
                    drawStart = 0;
                    drawEnd = totalLength * (progress / 0.375);
                } else if (progress < 0.5) {
                    drawStart = 0;
                    drawEnd = totalLength;
                } else {
                    drawStart = totalLength * ((progress - 0.5) / 0.5);
                    drawEnd = totalLength;
                }

                draw(drawStart, drawEnd);
                requestAnimationFrame(loop);
            }

            function draw(startDist, endDist) {
                ctx.clearRect(0, 0, width, height);
                const scale = Math.min(width/320, height/160) * 0.8;
                const tx = (width - 320*scale)/2, ty = (height - 160*scale)/2;
                ctx.save();
                ctx.translate(tx, ty); ctx.scale(scale, scale);
                ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
                ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                ctx.beginPath();
                let first = true;
                for (const s of segments) {
                    if (s.endDist < startDist || s.startDist > endDist) continue;
                    const t1 = Math.max(0, (startDist - s.startDist) / s.len);
                    const t2 = Math.min(1, (endDist - s.startDist) / s.len);
                    const x1 = s.p1.x + (s.p2.x-s.p1.x)*t1, y1 = s.p1.y + (s.p2.y-s.p1.y)*t1;
                    const x2 = s.p1.x + (s.p2.x-s.p1.x)*t2, y2 = s.p1.y + (s.p2.y-s.p1.y)*t2;
                    if (first) { ctx.moveTo(x1, y1); first = false; }
                    else { ctx.moveTo(x1, y1); }
                    ctx.lineTo(x2, y2);
                }
                ctx.stroke(); ctx.restore();
            }
            `;

            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));

            const initialWidth = container.clientWidth || 500;
            const initialHeight = container.clientHeight || 250;

            worker.postMessage({
                type: 'INIT',
                payload: {
                    canvas: offscreen,
                    width: initialWidth,
                    height: initialHeight
                }
            }, [offscreen]);

            const handleResize = () => {
                const w = container.clientWidth || 500;
                const h = container.clientHeight || 250;
                worker.postMessage({
                    type: 'RESIZE',
                    payload: { width: w, height: h }
                });
            };
            window.addEventListener('resize', handleResize);

            return () => {
                worker.terminate();
                window.removeEventListener('resize', handleResize);
                container.innerHTML = '';
            };
        } catch (err) {
            console.warn("Failed to init architecture loader", err);
        }
    }
    return () => { container.innerHTML = ''; };
}

// Global assignment for index.html (loaded as module)
if (typeof window !== 'undefined') {
    window.initArchitectureLoader = initArchitectureLoader;
}
