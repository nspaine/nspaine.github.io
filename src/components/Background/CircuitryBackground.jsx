import React, { useEffect, useRef } from 'react';
import pcbBg from '../../assets/pcb-background.webp';
import { useLoader } from '../Layout/Layout'; // Import Context hook

const CircuitryBackground = () => {
    const { setAreAssetsLoaded } = useLoader(); // Consume context
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const particlesRef = useRef([]);

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
                this.x = x;
                this.y = y;
                // Improved mobile scaling: favor larger particles on mobile
                // Mobile gets 0.8-1.2x, desktop gets 1.0-1.5x
                const baseScale = canvasWidth < 768 ? 1.0 : Math.min(1.5, canvasWidth / 1200);
                const scale = Math.max(0.8, baseScale);

                // Random initial velocity
                const angle = Math.random() * Math.PI * 2;
                const speed = (Math.random() * 2 + 1) * 0.5 * scale; // Halved speed * responsive scale
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
                // Draw glow first (larger, softer)
                ctx.shadowBlur = 8 * this.scale;
                ctx.shadowColor = `rgba(255, 215, 0, ${this.life * 0.8})`;

                ctx.beginPath();
                ctx.moveTo(this.history[0].x, this.history[0].y);
                for (let i = 1; i < this.history.length; i++) {
                    ctx.lineTo(this.history[i].x, this.history[i].y);
                }
                ctx.strokeStyle = `rgba(255, 255, 255, ${this.life})`; // Bright white core
                ctx.lineWidth = 3 * this.scale; // Increased from 2 to 3
                ctx.stroke();

                // Head with stronger glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2.5 * this.scale, 0, Math.PI * 2); // Increased from 1.5 to 2.5
                ctx.fillStyle = `rgba(255, 230, 100, ${this.life})`; // Brighter Gold/Yellow
                ctx.fill();

                // Reset shadow
                ctx.shadowBlur = 0;
            }
        }

        const animate = () => {
            // Semi-clear for trail effect? Or full clear
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Performance: Limit total particles
            const MAX_PARTICLES = 200;

            // Spawn particles if mouse is moving AND recently active (within 0.1s)
            const isRecent = Date.now() - (mouseRef.current.lastInteraction || 0) < 100;
            const isHolding = mouseRef.current.mouseDown;

            if (mouseRef.current.active && (isRecent || isHolding) && imageData) {
                if (isConductive(mouseRef.current.x, mouseRef.current.y)) {
                    // Spawn flow (reduced from 5 to 3 for performance)
                    const spawnCount = particlesRef.current.length < MAX_PARTICLES ? 3 : 0;
                    for (let i = 0; i < spawnCount; i++) {
                        particlesRef.current.push(new Particle(mouseRef.current.x, mouseRef.current.y, canvas.width));
                    }
                }
            }

            // Global ambient flow (Random sparks across the screen)
            if (imageData && Math.random() < 0.3 && particlesRef.current.length < MAX_PARTICLES) { // 30% chance per frame to spawn a random particle
                const rx = Math.random() * canvas.width;
                const ry = Math.random() * canvas.height;
                if (isConductive(rx, ry)) {
                    particlesRef.current.push(new Particle(rx, ry, canvas.width));
                }
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

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            init();
        };

        // Updates position AND triggers particles (Active)
        const handleActiveInteraction = (x, y) => {
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

        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                // Mobile: Touch drag spawns particles
                handleActiveInteraction(e.touches[0].clientX, e.touches[0].clientY);
            }
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
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchstart', handleTouchMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchstart', handleTouchMove);
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
                style={{ mixBlendMode: 'screen' }}
            />

        </div>
    );
};

export default CircuitryBackground;
