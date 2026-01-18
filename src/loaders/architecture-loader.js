/**
 * Shared Architecture Loader Logic
 * Used by index.html (initial static load) and ArchitectureLoader.jsx (React component)
 */
export const LOADER_DURATION = 2500;

export function initArchitectureLoader(container, existingStartTime = null) {
    if (!container) return null;

    container.innerHTML = '';
    // Standardize container class
    container.classList.add('architecture-container');

    // Add background glow
    const glow = document.createElement('div');
    glow.className = 'absolute inset-0 bg-[var(--accent-color)] opacity-5 blur-3xl rounded-full pointer-events-none';
    container.appendChild(glow);

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    if (canvas.transferControlToOffscreen) {
        try {
            const offscreen = canvas.transferControlToOffscreen();

            const workerCode = `
            let ctx;
            let width = 500, height = 250, dpr = 1;
            let startTime = null;
            const buildDuration = 2200; 

            const vertices = [];
            const edges = [];

            function addEdge(i1, i2) { edges.push([i1, i2]); }

            function createEmpireState(x, y, z, scale) {
                const s = vertices.length;
                // Proportions: 1/10, 3/10, 1/10, 4/10 (Shortened last block)
                const hBase = 240 * scale; 
                const tiers = [
                    {w: 42 * scale, h: hBase * 0.1}, 
                    {w: 37 * scale, h: hBase * 0.2}, 
                    {w: 32 * scale, h: hBase * 0.1}, 
                    {w: 27 * scale, h: hBase * 0.4},
                    {w: 22 * scale, h: hBase * 0.1} // New 5th smallest tier
                ];
                let currentY = y;
                tiers.forEach((t) => {
                    const w = t.w, h = t.h;
                    const b = vertices.length;
                    vertices.push({x:x-w/2, y:currentY, z:z-w/2}, {x:x+w/2, y:currentY, z:z-w/2},
                                  {x:x+w/2, y:currentY, z:z+w/2}, {x:x-w/2, y:currentY, z:z+w/2});
                    vertices.push({x:x-w/2, y:currentY-h, z:z-w/2}, {x:x+w/2, y:currentY-h, z:z-w/2},
                                  {x:x+w/2, y:currentY-h, z:z+w/2}, {x:x-w/2, y:currentY-h, z:z+w/2});
                    for(let j=0; j<4; j++) {
                        addEdge(b+j, b+(j+1)%4); addEdge(b+4+j, b+4+(j+1)%4); addEdge(b+j, b+4+j);
                    }
                    currentY -= h;
                });
                // Iconic Spire
                vertices.push({x:x, y: currentY, z:z}, {x:x, y: currentY - 40 * scale, z:z});
                addEdge(vertices.length-2, vertices.length-1);
            }

            function createGherkin(x, y, z, scale) {
                const rings = 6, segments = 10;
                const h = 180 * scale;
                const startV = vertices.length;
                for(let i=0; i<=rings; i++) {
                    const norm = i / rings;
                    const radius = (Math.sin(Math.pow(norm, 0.8) * Math.PI * 0.96) * 46 + (1 - norm) * 12 + 3) * scale;
                    const py = y - norm * h;
                    for(let s=0; s<segments; s++) {
                        const ang = (s / segments) * Math.PI * 2;
                        vertices.push({x: x + Math.cos(ang)*radius, y: py, z: z + Math.sin(ang)*radius});
                        if(i > 0) {
                            const idx = startV + i * segments + s;
                            addEdge(idx - segments, idx);
                            addEdge(startV + (i-1)*segments + (s+1)%segments, idx);
                        }
                    }
                }
            }

            function createShard(x, y, z, scale) {
                const s = vertices.length, w = 45 * scale, h = 240 * scale;
                vertices.push({x:x-w/2, y:y, z:z-w/2}, {x:x+w/2, y:y, z:z-w/2},
                              {x:x+w/2, y:y, z:z+w/2}, {x:x-w/2, y:y, z:z+w/2});
                addEdge(s, s+1); addEdge(s+1, s+2); addEdge(s+2, s+3); addEdge(s+3, s);
                vertices.push({x:x, y:y-h, z:z});
                const tip = vertices.length - 1;
                for(let i=0; i<4; i++) addEdge(s+i, tip);
            }

            function createVessel(x, y, z, scale) {
                const layers = 6, sides = 6, startV = vertices.length;
                for(let i=0; i<layers; i++) {
                    const r = (18 + i * 8) * scale, py = y - i * 14 * scale;
                    for(let s=0; s<sides; s++) {
                        const ang = (s / sides) * Math.PI * 2;
                        vertices.push({x: x + Math.cos(ang)*r, y: py, z: z + Math.sin(ang)*r});
                        addEdge(startV + i*sides + s, startV + i*sides + (s+1)%sides);
                    }
                }
            }

            function createOneWorldTrade(x, y, z, scale) {
                const s = vertices.length, wBase = 50 * scale, wTop = 20 * scale, h = 280 * scale;
                for(let i=0; i<2; i++) {
                    const py = i===0 ? y : y-h, w = i===0 ? wBase : wTop;
                    vertices.push({x:x-w/2, y:py, z:z-w/2}, {x:x+w/2, y:py, z:z-w/2},
                                  {x:x+w/2, y:py, z:z+w/2}, {x:x-w/2, y:py, z:z+w/2});
                    addEdge(s+i*4, s+i*4+1); addEdge(s+i*4+1, s+i*4+2);
                    addEdge(s+i*4+2, s+i*4+3); addEdge(s+i*4+3, s+i*4);
                }
                addEdge(s, s+4); addEdge(s+1, s+5); addEdge(s+2, s+6); addEdge(s+3, s+7);
                const topY = y - h;
                vertices.push({x:x, y: topY, z:z}, {x:x, y: topY - 40*scale, z:z});
                addEdge(vertices.length-2, vertices.length-1);
            }

            createOneWorldTrade(0, 140, 0, 1.0);  
            createEmpireState(70, 140, -70, 0.85); 
            createGherkin(-80, 140, 40, 0.8);      
            createShard(70, 140, 50, 0.9);         
            createVessel(-60, 140, -70, 0.7);      

            self.onmessage = function(e) {
                const { type, payload } = e.data;
                if (type === 'INIT') {
                    ctx = payload.canvas.getContext('2d');
                    dpr = payload.dpr || 1;
                    if (payload.startTime) startTime = payload.startTime;
                    resize(payload.width, payload.height);
                    requestAnimationFrame(loop);
                } else if (type === 'RESIZE') {
                    dpr = payload.dpr || 1;
                    resize(payload.width, payload.height);
                }
            };

            function resize(w, h) {
                width = w || 500; height = h || 250;
                if(ctx && ctx.canvas) {
                    ctx.canvas.width = width * dpr; ctx.canvas.height = height * dpr;
                }
            }

            function project(p, angle) {
                const cosA = Math.cos(angle), sinA = Math.sin(angle);
                const rotX = p.x * cosA - p.z * sinA, rotZ = p.x * sinA + p.z * cosA;
                const baseScale = (Math.min(width, height) * 0.95) / 400;
                const perspective = 1000 / (1000 + rotZ);
                const finalScale = baseScale * perspective;
                const stretchY = height > width ? Math.min(1.4, height / width) : 1.0;
                return {
                    x: width / 2 + rotX * finalScale,
                    y: height / 2 + (p.y * stretchY) * finalScale
                };
            }

            function loop(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                
                const buildProgress = Math.min(1, elapsed / buildDuration);
                // Tighten sweep: 220 to -220 matches building bounds better (140 to -140 range)
                const startY = 220;
                const endY = -220;
                const thresholdY = startY - (startY - endY) * buildProgress;
                
                draw(elapsed / 4000, thresholdY, buildProgress >= 1);
                requestAnimationFrame(loop);
            }

            function draw(angle, thresholdY, isFinished) {
                if (!ctx) return;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                ctx.clearRect(0, 0, width, height);
                ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.8;
                
                const projected = vertices.map(v => project(v, angle));
                
                // BATCHED DRAWING: One path for full edges, one for clipped edges
                ctx.beginPath();
                edges.forEach(edge => {
                    const v1 = vertices[edge[0]], v2 = vertices[edge[1]];
                    const p1 = projected[edge[0]], p2 = projected[edge[1]];
                    const v1v = isFinished || v1.y >= thresholdY, v2v = isFinished || v2.y >= thresholdY;
                    
                    if (v1v && v2v) {
                        ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
                    }
                });
                ctx.stroke();

                if (!isFinished) {
                    ctx.beginPath();
                    edges.forEach(edge => {
                        const v1 = vertices[edge[0]], v2 = vertices[edge[1]];
                        const p1 = projected[edge[0]], p2 = projected[edge[1]];
                        const v1v = v1.y >= thresholdY, v2v = v2.y >= thresholdY;
                        
                        if (v1v !== v2v) {
                            const vVis = v1v ? v1 : v2, vHide = v1v ? v2 : v1, pVis = v1v ? p1 : p2;
                            const lerp = (thresholdY - vVis.y) / (vHide.y - vVis.y);
                            const pInter = project({
                                x: vVis.x + (vHide.x - vVis.x) * lerp,
                                y: thresholdY,
                                z: vVis.z + (vHide.z - vVis.z) * lerp
                            }, angle);
                            ctx.moveTo(pVis.x, pVis.y); ctx.lineTo(pInter.x, pInter.y);
                        }
                    });
                    ctx.stroke();

                    // Scanline UI element
                    const scanY = project({x:0, y:thresholdY, z:0}, angle).y;
                    const grad = ctx.createLinearGradient(0, scanY-6, 0, scanY+6);
                    grad.addColorStop(0, 'transparent'); grad.addColorStop(0.5, 'rgba(255, 215, 0, 0.4)'); grad.addColorStop(1, 'transparent');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, scanY-6, width, 12);
                }
            }
            `;

            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));

            const initialWidth = container.clientWidth || 500;
            const initialHeight = container.clientHeight || 250;
            const dpr = Math.min(2.0, window.devicePixelRatio || 1);

            worker.postMessage({
                type: 'INIT',
                payload: { canvas: offscreen, width: initialWidth, height: initialHeight, dpr: dpr, startTime: existingStartTime }
            }, [offscreen]);

            const handleResize = () => {
                const w = container.clientWidth || 500;
                const h = container.clientHeight || 250;
                worker.postMessage({ type: 'RESIZE', payload: { width: w, height: h, dpr: Math.min(2.0, window.devicePixelRatio || 1) } });
            };
            window.addEventListener('resize', handleResize);

            return () => {
                worker.terminate();
                window.removeEventListener('resize', handleResize);
                container.innerHTML = '';
            };
        } catch (err) {
            console.error("Architecture Loader Error:", err);
        }
    }
    return () => { container.innerHTML = ''; };
}

if (typeof window !== 'undefined') {
    window.initArchitectureLoader = initArchitectureLoader;
}
