import React, { useEffect, useRef } from 'react';
import pcbBg from '../../assets/pcb-background.webp';
import { useLoader } from '../Layout/Layout'; // Import Context hook

const CircuitryBackground = () => {
    const { setAreAssetsLoaded } = useLoader(); // Consume context
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const particlesRef = useRef([]);
    const burntSpotsRef = useRef([]);
    const damageCanvasRef = useRef(null);
    const damageCtxRef = useRef(null);

    useEffect(() => {
        // Lock Loader on Mount (regardless of Layout default, just to be safe)
        setAreAssetsLoaded(false);

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const container = containerRef.current;

        // Offscreen image processing
        const img = new Image();
        // img.src assigned at end of effect to prevent race condition

        let animationFrameId;
        let imageData = null;
        let scale = 1.0;

        const init = () => {
            if (!container) return;

            // Resize canvas to full screen
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Create offscreen canvas to analyze image data
            const offscreen = document.createElement('canvas');
            offscreen.width = canvas.width;
            offscreen.height = canvas.height;
            const offCtx = offscreen.getContext('2d');

            // Draw image to cover (simulating background-size: cover)
            scale = Math.max(offscreen.width / img.width, offscreen.height / img.height);
            const x = (offscreen.width / 2) - (img.width / 2) * scale;
            const y = (offscreen.height / 2) - (img.height / 2) * scale;

            offCtx.drawImage(img, x, y, img.width * scale, img.height * scale);

            // Initialize damage (burnt spots) canvas
            const damageCanvas = document.createElement('canvas');
            damageCanvas.width = canvas.width;
            damageCanvas.height = canvas.height;
            damageCanvasRef.current = damageCanvas;
            damageCtxRef.current = damageCanvas.getContext('2d');

            try {
                // Get pixel data for collision detection
                imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height).data;
            } catch (e) {
                console.warn("Could not load image data", e);
            }
        };

        const isConductive = (x, y) => {
            if (!imageData) return false;
            const ix = Math.floor(x);
            const iy = Math.floor(y);
            if (ix < 0 || iy < 0 || ix >= canvas.width || iy >= canvas.height) return false;
            const index = (iy * canvas.width + ix) * 4;
            const r = imageData[index];
            const g = imageData[index + 1];
            const b = imageData[index + 2];
            const brightness = (r + g + b) / 3;
            return brightness > 60;
        };

        class Particle {
            constructor(x, y, canvasWidth) {
                this.type = 'flow';
                this.x = x;
                this.y = y;
                // Improved mobile scaling: favor larger particles on mobile
                // Mobile gets 0.8-1.2x, desktop gets 1.0-1.5x
                const baseScale = canvasWidth < 768 ? 1.0 : Math.min(1.5, canvasWidth / 1200);
                const scale = Math.max(0.8, baseScale);

                // Random initial velocity
                const angle = Math.random() * Math.PI * 2;
                // Faster initial burst for mobile to get particles out from under the thumb
                const mobileSpeedBoost = canvasWidth < 768 ? 2.5 : 1.0;
                const speed = (Math.random() * 2 + 1) * 0.5 * scale * mobileSpeedBoost;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = 1.0;
                // Extended life: Decay ~0.0025.
                // At 60fps, 1.0/0.0025 = 400 frames = ~6.6 seconds of max life (if no collision death)
                this.decay = Math.random() * 0.002 + 0.0015;
                this.history = [{ x, y }];
                this.scale = scale; // Store for reflection logic
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= this.decay;

                // Collision / Guidance
                // Look ahead
                if (isConductive(this.x, this.y)) {
                    // Keep going
                } else {
                    let foundPath = false;
                    const checkRadius = 5 * this.scale; // Scale radius to prevent jumping gaps on mobile
                    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
                        const checkX = this.x + Math.cos(a) * checkRadius;
                        const checkY = this.y + Math.sin(a) * checkRadius;
                        if (isConductive(checkX, checkY)) {
                            this.vx = Math.cos(a) * 1.0 * this.scale; // Responsive reflection speed
                            this.vy = Math.sin(a) * 1.0 * this.scale;
                            this.x = checkX; // Hop to safety
                            this.y = checkY;
                            this.life -= 0.1; // Energy penalty for hitting a wall to prevent infinite bouncing
                            foundPath = true;
                            break;
                        }
                    }
                    if (!foundPath) {
                        this.life = 0; // Fizzle out
                    }
                }

                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > 5) this.history.shift();
            }

            draw(ctx) {
                // Glow (Using larger circle instead of shadowBlur for performance)
                ctx.beginPath();
                ctx.arc(this.x, this.y, 6 * this.scale, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 215, 0, ${this.life * 0.3})`;
                ctx.fill();

                // Tail
                ctx.beginPath();
                ctx.moveTo(this.history[0].x, this.history[0].y);
                for (let i = 1; i < this.history.length; i++) {
                    ctx.lineTo(this.history[i].x, this.history[i].y);
                }
                ctx.strokeStyle = `rgba(255, 255, 255, ${this.life})`; // Bright white core
                ctx.lineWidth = 3 * this.scale;
                ctx.stroke();

                // Head
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2.5 * this.scale, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 230, 100, ${this.life})`; // Brighter Gold/Yellow
                ctx.fill();
            }
        }

        class Smoke {
            constructor(x, y) {
                this.type = 'smoke';
                const mobileScale = window.innerWidth < 768 ? 2.2 : 1.0;
                this.x = x + (Math.random() - 0.5) * 10 * mobileScale;
                this.y = y + (Math.random() - 0.5) * 10 * mobileScale;
                this.vx = (Math.random() - 0.5) * 0.3 * mobileScale;
                this.vy = (-Math.random() * 0.5 - 0.2) * mobileScale; // Drift up
                this.life = 1.0;
                this.decay = Math.random() * 0.01 + 0.005;
                this.size = (Math.random() * 5 + 2) * mobileScale;
                this.maxSize = (Math.random() * 20 + 15) * mobileScale;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= this.decay;
                this.size += (this.maxSize - this.size) * 0.05;
            }
            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(150, 150, 150, ${this.life * 0.3})`;
                ctx.fill();
            }
        }

        class Spark {
            constructor(x, y) {
                this.type = 'spark';
                const mobileScale = window.innerWidth < 768 ? 2.0 : 1.0;
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = (Math.random() * 10 + 4) * mobileScale; // Increased speed
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = 1.0;
                this.decay = Math.random() * 0.04 + 0.02; // Slower decay
                this.lineWidth = 3 * mobileScale; // Thicker lines
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.3; // Gravity
                this.life -= this.decay;
                this.vx *= 0.98; // Friction
                this.vy *= 0.98;
            }
            draw(ctx) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - this.vx * 0.8, this.y - this.vy * 0.8);
                ctx.strokeStyle = `rgba(200, 240, 255, ${this.life})`; // Electric light blue/white
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
            }
        }

        class Flash {
            constructor(x, y) {
                this.type = 'flash';
                this.x = x;
                this.y = y;
                this.life = 1.0;
                this.decay = 0.15; // Very fast
                this.size = 20;
                this.maxSize = window.innerWidth < 768 ? 120 : 80;
            }
            update() {
                this.life -= this.decay;
                this.size += (this.maxSize - this.size) * 0.4;
            }
            draw(ctx) {
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                grad.addColorStop(0, `rgba(255, 255, 255, ${this.life * 0.8})`);
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const animate = () => {
            // Semi-clear for trail effect? Or full clear
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Performance: Limit total particles
            const MAX_PARTICLES = 200;

            // 1. Draw Burnt Spots (Blitted from pre-rendered damage canvas)
            context.globalCompositeOperation = 'source-over';
            if (damageCanvasRef.current) {
                context.drawImage(damageCanvasRef.current, 0, 0);
            }

            // 2. Draw Particles (Switch to 'screen' or 'lighter' for glow effect)
            context.globalCompositeOperation = 'screen';

            // Spawn particles if mouse is active, on a trace, and NOT blown out
            const onTrace = imageData && isConductive(mouseRef.current.x, mouseRef.current.y);

            if (mouseRef.current.active && onTrace && !mouseRef.current.isBlown) {
                // Spawn flow (reduced from 5 to 3 for performance)
                const spawnCount = particlesRef.current.length < MAX_PARTICLES ? 3 : 0;
                for (let i = 0; i < spawnCount; i++) {
                    particlesRef.current.push(new Particle(mouseRef.current.x, mouseRef.current.y, canvas.width));
                }
            }

            // Global ambient flow (Random sparks across the screen)
            const ambientChance = canvas.width < 768 ? 0.05 : 0.3; // Much lower on mobile
            if (imageData && Math.random() < ambientChance && particlesRef.current.length < MAX_PARTICLES) {
                const rx = Math.random() * canvas.width;
                const ry = Math.random() * canvas.height;
                if (isConductive(rx, ry)) {
                    particlesRef.current.push(new Particle(rx, ry, canvas.width));
                }
            }

            // Interactive "Burn Out" Effect (Smoke and Sparks)
            // 0-2s: Normal emission
            // 2-4s: Overheat (Smoke + Sparks)
            // 4s+: BLOWOUT (Explosion + Derez)
            if (mouseRef.current.active && onTrace && !mouseRef.current.isBlown) {
                if (!mouseRef.current.hoverStartTime) {
                    mouseRef.current.hoverStartTime = Date.now();
                    mouseRef.current.lastHoverPos = { x: mouseRef.current.x, y: mouseRef.current.y };
                } else {
                    const elapsed = Date.now() - mouseRef.current.hoverStartTime;
                    const dist = Math.hypot(mouseRef.current.x - mouseRef.current.lastHoverPos.x, mouseRef.current.y - mouseRef.current.lastHoverPos.y);

                    // If they move too much, reset timer, but allow minor jitter
                    if (dist > 30) {
                        mouseRef.current.hoverStartTime = Date.now();
                        mouseRef.current.lastHoverPos = { x: mouseRef.current.x, y: mouseRef.current.y };
                    } else if (elapsed > 6000) {
                        // 6s: TINY EXPLOSION!
                        mouseRef.current.isBlown = true;
                        mouseRef.current.hoverStartTime = null;

                        // Pre-render burnt spot to damage canvas (Fast!)
                        const dCtx = damageCtxRef.current;
                        if (dCtx) {
                            const spotSize = Math.random() * 30 + 40;
                            const grad = dCtx.createRadialGradient(mouseRef.current.x, mouseRef.current.y, 0, mouseRef.current.x, mouseRef.current.y, spotSize);
                            grad.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
                            grad.addColorStop(0.4, 'rgba(10, 10, 10, 0.6)');
                            grad.addColorStop(0.8, 'rgba(30, 20, 10, 0.2)');
                            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                            dCtx.fillStyle = grad;
                            dCtx.beginPath();
                            dCtx.arc(mouseRef.current.x, mouseRef.current.y, spotSize, 0, Math.PI * 2);
                            dCtx.fill();
                        }

                        // Explosion particles
                        particlesRef.current.push(new Flash(mouseRef.current.x, mouseRef.current.y));

                        // Fade out existing lead particles fast
                        particlesRef.current.forEach(p => {
                            if (p.type === 'flow') {
                                p.life *= 0.2; // Slash current life
                                p.decay = 0.05; // Rapid decay
                            }
                        });

                        for (let i = 0; i < 30; i++) {
                            particlesRef.current.push(new Spark(mouseRef.current.x, mouseRef.current.y));
                        }
                        for (let i = 0; i < 8; i++) {
                            particlesRef.current.push(new Smoke(mouseRef.current.x, mouseRef.current.y));
                        }
                    } else if (elapsed > 3000) {
                        // 3s: Overheat warning (shifted from 2s to match 5s pop)
                        if (Math.random() < 0.3) {
                            particlesRef.current.push(new Smoke(mouseRef.current.x, mouseRef.current.y));
                        }
                        if (Math.random() < 0.6) {
                            particlesRef.current.push(new Spark(mouseRef.current.x, mouseRef.current.y));
                        }
                    }
                }
            } else if (!mouseRef.current.isBlown) {
                mouseRef.current.hoverStartTime = null;
            }

            // Update and draw
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.update();
                p.draw(context);
                if (p.life <= 0) {
                    particlesRef.current.splice(i, 1);
                }
            }

            // 3. Reset to normal for next frame
            context.globalCompositeOperation = 'source-over';

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            init();
        };

        // Updates position AND triggers particles (Active)
        const handleActiveInteraction = (x, y) => {
            // Optimization: If a blocking modal (game, lightbox) is open, ignore interaction
            if (document.body.classList.contains('game-open') ||
                document.body.classList.contains('lightbox-open')) {
                mouseRef.current.active = false;
                return;
            }

            // If blown out, moving the mouse resets the state
            if (mouseRef.current.isBlown && mouseRef.current.lastHoverPos) {
                const dist = Math.hypot(x - mouseRef.current.lastHoverPos.x, y - mouseRef.current.lastHoverPos.y);
                if (dist > 30) {
                    mouseRef.current.isBlown = false;
                }
            }

            mouseRef.current.x = x;
            mouseRef.current.y = y;
            mouseRef.current.active = true;
            mouseRef.current.lastInteraction = Date.now();

            if (containerRef.current) {
                containerRef.current.style.setProperty('--mouse-x', `${x}px`);
                containerRef.current.style.setProperty('--mouse-y', `${y}px`);
            }
        };

        const handleMouseMove = (e) => {
            // Desktop: Movement spawns particles
            handleActiveInteraction(e.clientX, e.clientY);
        };

        const handleMouseDown = (e) => {
            mouseRef.current.mouseDown = true;
            // Desktop: Click spawns particles
            handleActiveInteraction(e.clientX, e.clientY);
        };

        const handleMouseUp = () => {
            mouseRef.current.mouseDown = false;
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
            mouseRef.current.hoverStartTime = null; // Also pause/reset timer
        };

        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                // Mobile: Touch drag spawns particles
                handleActiveInteraction(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        const handleTouchStart = (e) => {
            if (e.touches.length > 0) {
                // Reset blown state on new press
                mouseRef.current.isBlown = false;
                handleActiveInteraction(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        const handleTouchEnd = () => {
            mouseRef.current.active = false;
        };

        img.onload = () => {
            init();

            // Boot Sequence: Fire a burst of particles from the center
            if (imageData) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                // Try to find conductive points near center
                for (let i = 0; i < 20; i++) {
                    const angle = (Math.PI * 2 * i) / 20;
                    const r = 50 * scale; // Responsive radius
                    const bx = centerX + Math.cos(angle) * r;
                    const by = centerY + Math.sin(angle) * r;
                    if (isConductive(bx, by)) {
                        particlesRef.current.push(new Particle(bx, by, canvas.width));
                    }
                }
            }

            animate();

            // Signal Ready to Layout
            setAreAssetsLoaded(true);
        };

        // Safety error handler
        img.onerror = () => {
            console.warn("Background image failed to load");
            setAreAssetsLoaded(true); // Don't block app on bg failure
        };

        // Start loading image AFTER handlers are attached to catch cached loads
        img.src = pcbBg;

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mouseout', handleMouseLeave);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchcancel', handleTouchEnd);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mouseout', handleMouseLeave);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchstart', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-auto overflow-hidden cursor-probe"
            style={{
                '--mouse-x': '50%',
                '--mouse-y': '50%',
                zIndex: 0,
            }}
        >
            {/* Background Image Layer */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${pcbBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 1.0,
                }}
            />

            {/* Dark Overlay - Reverted to lighter per request */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'rgba(0,0,0,0.3)' // Back to 0.3
                }}
            />

            {/* Particle Canvas Layer */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10"
            />

        </div>
    );
};

export default CircuitryBackground;
