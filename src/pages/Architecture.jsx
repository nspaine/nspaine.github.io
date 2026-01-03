import React, { useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '../components/Layout/Layout';
import Footer from '../components/Layout/Footer';


// Image filenames
// Automatically find all images in the public/images/architecture directory
const fullResModules = import.meta.glob('../../public/images/architecture/*.{webp,jpg,jpeg,png,JPG,JPEG,PNG,WEBP}');
const thumbModules = import.meta.glob('../../public/images/architecture/thumbs/*.{webp,jpg,jpeg,png,JPG,JPEG,PNG,WEBP}');

// Helper to extract filename from path
const getFilename = (path) => path.split('/').pop();

// Get list of all full resolution images
const allFilenames = Object.keys(fullResModules).map(getFilename).sort();
const thumbFilenames = new Set(Object.keys(thumbModules).map(getFilename));

// Full resolution images for lightbox (includes EVERYTHING found in the folder)
const fullResImages = allFilenames.map(filename =>
    `${import.meta.env.BASE_URL}images/architecture/${filename}`
);

// Gallery images (ONLY matches that have a thumbnail)
// We store both the thumb URL and the full res URL (for click handler)
const galleryItems = allFilenames
    .filter(filename => thumbFilenames.has(filename))
    .map(filename => ({
        thumb: `${import.meta.env.BASE_URL}images/architecture/thumbs/${filename}`,
        full: `${import.meta.env.BASE_URL}images/architecture/${filename}`,
        filename: filename
    }));

// Derived thumbnails array for grid rendering (to keep existing map logic mostly compatible, though we'll update it)
const thumbnails = galleryItems.map(item => item.thumb);

const Architecture = () => {
    const navigate = useNavigate();
    const { setAreAssetsLoaded } = useLoader();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [slideDirection, setSlideDirection] = useState(0); // -1 for left, 1 for right

    // Zoom and pan state
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
    // Use refs for state to access current value in event handlers without triggering re-creation
    const panPositionRef = React.useRef({ x: 0, y: 0 });
    const zoomLevelRef = React.useRef(1);

    // Sync refs with state
    useLayoutEffect(() => {
        // Only sync if NOT dragging. During drag, the Ref is the source of truth (updated by handler)
        // and State follows. Overwriting Ref with State during drag causes "stutter/jumps" due to render lag.
        if (!isDraggingRef.current) {
            panPositionRef.current = panPosition;
        }
    }, [panPosition]);

    useLayoutEffect(() => {
        zoomLevelRef.current = zoomLevel;
    }, [zoomLevel]);

    // Drag state
    const [isDragging, setIsDragging] = useState(false);
    // Use refs for drag state to ensure immediate updates during event handling
    const isDraggingRef = React.useRef(false);
    const dragStartRef = React.useRef({ x: 0, y: 0 });
    const imageRef = React.useRef(null); // Direct DOM access for zero-latency updates
    // Touch handlers for mobile pinch-to-zoom
    const touchStartRef = React.useRef({ distance: 0, zoom: 1 });
    const loadingTimeoutRef = React.useRef(null);
    const preloadedMap = React.useRef(new Map());

    const handleTouchStart = React.useCallback((e) => {
        const currentZoom = zoomLevelRef.current;
        const currentPan = panPositionRef.current;

        // Debug logs active
        // console.log('TouchStart', { touches: e.touches.length, zoomLevel: currentZoom, targetTag: e.target.tagName });

        if (e.touches.length === 2) {
            // Pinch Start
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            touchStartRef.current = { distance, zoom: currentZoom };
        } else if (e.touches.length === 1 && currentZoom > 1) {
            // Pan Start (merged) - Allow dragging anywhere except buttons
            if (e.target.closest('button')) return;

            // console.log('Starting Pan');
            isDraggingRef.current = true;
            setIsDragging(true);
            const touch = e.touches[0];
            // Calculate start position relative to current pan position
            // Note: We don't preventDefault here to allow potential clicks (tap to zoom)
            // Use REF for value to keep handler stable
            dragStartRef.current = { x: touch.clientX - currentPan.x, y: touch.clientY - currentPan.y };
            dragDistanceRef.current = 0;
        }
    }, []); // Zero dependencies!

    const handleTouchMove = React.useCallback((e) => {
        const currentZoom = zoomLevelRef.current;
        // Debug logs active
        // console.log('TouchMove', { touches: e.touches.length, isDragging: isDraggingRef.current, zoomLevel: currentZoom });
        if (e.touches.length === 2) {
            // Pinch Move
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );

            const scale = distance / touchStartRef.current.distance;
            const newZoom = Math.max(1, Math.min(3, touchStartRef.current.zoom * scale));

            // Clear any pending loading timeout when zooming via pinch
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
            }
            setImageLoading(false);

            setZoomLevel(newZoom);
            if (newZoom === 1) {
                setPanPosition({ x: 0, y: 0 });
            }
        } else if (e.touches.length === 1 && isDraggingRef.current && currentZoom > 1) {
            // Pan Move (merged)
            e.preventDefault(); // Stop browser scrolling

            const touch = e.touches[0];
            const newX = touch.clientX - dragStartRef.current.x;
            const newY = touch.clientY - dragStartRef.current.y;

            // Track drag distance
            const currentPan = panPositionRef.current;
            const deltaX = Math.abs(newX - currentPan.x);
            const deltaY = Math.abs(newY - currentPan.y);
            dragDistanceRef.current += deltaX + deltaY;

            // Increase pan boundaries to allow viewing entire image
            const maxPanX = (window.innerWidth / 1.5) * (currentZoom - 1);
            const maxPanY = (window.innerHeight / 1.5) * (currentZoom - 1);

            // console.log('Panning to', newX, newY);

            setPanPosition({
                x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
                y: Math.max(-maxPanY, Math.min(maxPanY, newY))
            });
        }
    }, [loadingTimeoutRef]); // Removed zoomLevel/panPosition dependencies

    const handleTouchEnd = React.useCallback(() => {
        isDraggingRef.current = false;
        setIsDragging(false);
    }, []);

    // Preload only first 6 thumbnails (above the fold), let others lazy load
    useLayoutEffect(() => {
        setAreAssetsLoaded(false);

        const preloadImages = async () => {
            // Only preload first 6 thumbnails for faster initial load
            const initialImages = thumbnails.slice(0, 6);
            const preloadPromises = initialImages.map(url => {
                const img = new Image();
                img.src = url;
                return img.decode().catch(() => Promise.resolve());
            });

            // Wait for initial images or timeout after 5s
            const timeoutPromise = new Promise(resolve => setTimeout(resolve, 5000));
            await Promise.race([Promise.all(preloadPromises), timeoutPromise]);

            // Small buffer for DOM settling
            await new Promise(resolve => setTimeout(resolve, 300));

            // Unlock loader
            setAreAssetsLoaded(true);
        };

        preloadImages();
    }, [setAreAssetsLoaded]);

    // Preload adjacent images
    useLayoutEffect(() => {
        if (!selectedImage) return;

        const currentIndex = fullResImages.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1) % fullResImages.length;
        const prevIndex = (currentIndex - 1 + fullResImages.length) % fullResImages.length;

        const imagesToPreload = [fullResImages[nextIndex], fullResImages[prevIndex]];

        imagesToPreload.forEach(src => {
            if (!preloadedMap.current.has(src)) {
                const img = new Image();
                img.src = src;
                preloadedMap.current.set(src, img);
            }
        });
    }, [selectedImage]);

    const handleImageChange = (newImage) => {
        // Clear potential pending timer
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);

        // Optimistically treat as fast; timer will set true if slow
        setImageLoading(false);

        loadingTimeoutRef.current = setTimeout(() => {
            setImageLoading(true);
        }, 500);

        // Reset zoom and pan when changing images
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });

        // Reset drag state REFS to prevent stuck panning
        isDraggingRef.current = false;
        dragDistanceRef.current = 0;
        setIsDragging(false);

        setSelectedImage(newImage);
    };

    // Keyboard navigation for lightbox
    useLayoutEffect(() => {
        if (!selectedImage) return;

        const handleKeyDown = (e) => {
            const currentIndex = fullResImages.indexOf(selectedImage);

            if (e.key === 'Escape') {
                setSelectedImage(null);
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                // Blur any focused button to clear hover state
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
                setSlideDirection(-1);
                handleImageChange(fullResImages[currentIndex - 1]);
            } else if (e.key === 'ArrowRight' && currentIndex < fullResImages.length - 1) {
                // Blur any focused button to clear hover state
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
                setSlideDirection(1);
                handleImageChange(fullResImages[currentIndex + 1]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, fullResImages]);

    // Touch/swipe navigation for lightbox
    useLayoutEffect(() => {
        if (!selectedImage) return;

        let touchStartX = 0;
        let touchEndX = 0;
        let isPinching = false; // Track if user is pinching

        const handleTouchStartSwipe = (e) => {
            // If multi-touch, it's a pinch gesture
            if (e.touches.length > 1) {
                isPinching = true;
                return;
            }
            isPinching = false;
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEndSwipe = (e) => {
            // Don't navigate if user was pinching
            if (isPinching || e.touches.length > 0) {
                return;
            }
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        };

        const handleSwipe = () => {
            // Don't navigate if image is zoomed in (user is panning)
            if (zoomLevel > 1) {
                return;
            }

            const swipeThreshold = 50; // Minimum distance for a swipe
            const currentIndex = fullResImages.indexOf(selectedImage);

            if (touchStartX - touchEndX > swipeThreshold) {
                // Swiped left - go to next
                if (currentIndex < fullResImages.length - 1) {
                    setSlideDirection(1);
                    handleImageChange(fullResImages[currentIndex + 1]);
                }
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swiped right - go to previous
                if (currentIndex > 0) {
                    setSlideDirection(-1);
                    handleImageChange(fullResImages[currentIndex - 1]);
                }
            }
        };

        window.addEventListener('touchstart', handleTouchStartSwipe);
        window.addEventListener('touchend', handleTouchEndSwipe);
        return () => {
            window.removeEventListener('touchstart', handleTouchStartSwipe);
            window.removeEventListener('touchend', handleTouchEndSwipe);
        };
    }, [selectedImage, fullResImages, zoomLevel]);

    // Reset drag distance + state AND CLAMP PAN position when zoom changes
    useLayoutEffect(() => {
        dragDistanceRef.current = 0;
        isDraggingRef.current = false;
        setIsDragging(false);

        // Clamp pan position to new boundaries immediately
        // This prevents "dead zone" dragging if we zoomed out while panned far away
        const maxPanX = (window.innerWidth / 1.5) * (zoomLevel - 1);
        const maxPanY = (window.innerHeight / 1.5) * (zoomLevel - 1);

        setPanPosition(prev => {
            // Only update if out of bounds to avoid unnecessary renders
            const clampedX = Math.max(-maxPanX, Math.min(maxPanX, prev.x));
            const clampedY = Math.max(-maxPanY, Math.min(maxPanY, prev.y));

            if (clampedX !== prev.x || clampedY !== prev.y) {
                // CRITICAL: Update Ref IMMEDIATELY so handlers see the clamped value 
                // before the next render cycle completes
                panPositionRef.current = { x: clampedX, y: clampedY };
                return { x: clampedX, y: clampedY };
            }
            return prev;
        });

    }, [zoomLevel]);

    const handleImageLoad = (event) => {
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
        }
        setImageLoading(false);
    };


    // Double-tap/click zoom toggle
    const dragDistanceRef = React.useRef(0);
    const lastTapRef = React.useRef(0);

    const handleImageClick = (e) => {
        if (e.target.tagName === 'IMG') {
            e.stopPropagation();

            // Don't toggle zoom if user was dragging
            if (dragDistanceRef.current > 5) {
                dragDistanceRef.current = 0;
                return;
            }

            // Detect input type (mouse vs touch)
            // Use pointerType if available, fallback to touch detection
            const isTouch = (e.nativeEvent && e.nativeEvent.pointerType === 'touch') ||
                ('ontouchstart' in window && navigator.maxTouchPoints > 0);

            // However, pointerType 'mouse' is definitive for mouse users even on touch devices
            // If explicit mouse click, always single-click zoom
            const isMouse = e.nativeEvent && e.nativeEvent.pointerType === 'mouse';

            if (isMouse || !isTouch) {
                // Desktop/Mouse: Single click to toggle zoom
                if (zoomLevel === 1) {
                    setZoomLevel(2);
                } else {
                    setZoomLevel(1);
                    setPanPosition({ x: 0, y: 0 });
                }
            } else {
                // Mobile/Touch: Double-tap to toggle zoom
                const now = Date.now();
                const timeSinceLastTap = now - lastTapRef.current;

                if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
                    // Double-tap detected
                    if (zoomLevel === 1) {
                        setZoomLevel(2);
                    } else {
                        setZoomLevel(1);
                        setPanPosition({ x: 0, y: 0 });
                    }
                    lastTapRef.current = 0; // Reset
                } else {
                    // First tap
                    lastTapRef.current = now;
                }
            }
        }
    };

    // Mouse wheel zoom
    const handleWheel = React.useCallback((e) => {
        if (!selectedImage) return;
        e.preventDefault();

        // Clear any pending loading timeout when zooming
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
        }
        setImageLoading(false);

        const currentZoom = zoomLevelRef.current;
        const currentPan = panPositionRef.current;
        const delta = e.deltaY > 0 ? -0.2 : 0.2;

        // Calculate new zoom
        const newZoom = Math.max(1, Math.min(3, currentZoom + delta));

        if (newZoom === currentZoom) return;

        // Calculate Mouse Offset relating to center of screen (M)
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Mouse position relative to center
        const mouseX = e.clientX - rect.left - centerX;
        const mouseY = e.clientY - rect.top - centerY;

        // Math: P_new = M - (M - P_old) * (Z_new / Z_old)
        // effectively scaling the distance from the viewport center to the image point under the cursor
        const scaleFactor = newZoom / currentZoom;
        const targetPanX = mouseX - (mouseX - currentPan.x) * scaleFactor;
        const targetPanY = mouseY - (mouseY - currentPan.y) * scaleFactor;

        // Calculate clamped pan for NEW zoom immediately
        const maxPanX = (window.innerWidth / 1.5) * (newZoom - 1);
        const maxPanY = (window.innerHeight / 1.5) * (newZoom - 1);

        const clampedX = Math.max(-maxPanX, Math.min(maxPanX, targetPanX));
        const clampedY = Math.max(-maxPanY, Math.min(maxPanY, targetPanY));

        // CRITICAL: Update Refs IMMEDIATELY so handlers see the correct values
        zoomLevelRef.current = newZoom;
        panPositionRef.current = { x: clampedX, y: clampedY };
        isDraggingRef.current = false; // Force break any active drag

        // DOM Update for instant feedback
        if (imageRef.current) {
            imageRef.current.style.transform = `scale(${newZoom}) translate(${clampedX / newZoom}px, ${clampedY / newZoom}px)`;
        }

        // Batch state updates
        setZoomLevel(newZoom);
        setPanPosition({ x: clampedX, y: clampedY });

    }, [selectedImage]);

    const containerRef = React.useRef(null);

    // Register non-passive wheel listener
    useLayoutEffect(() => {
        if (!selectedImage || !containerRef.current) return;

        const lightboxElement = containerRef.current;
        lightboxElement.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            lightboxElement.removeEventListener('wheel', handleWheel);
        };
    }, [selectedImage, handleWheel]); // Container ref is stable

    // Pan/drag handlers (MOUSE) - DELTA BASED
    const lastMousePosRef = React.useRef({ x: 0, y: 0 });

    const handleMouseDown = React.useCallback((e) => {
        const currentZoom = zoomLevelRef.current;
        // Only allow Left Click (0)
        if (e.button !== 0) return;

        // console.log('MouseDown', { zoom: currentZoom, buttons: e.buttons });

        if (currentZoom > 1) {
            // Allow dragging anywhere except buttons
            if (e.target.closest('button')) return;

            e.preventDefault();
            isDraggingRef.current = true;
            setIsDragging(true);

            // Store initial mouse position for delta calculation
            lastMousePosRef.current = { x: e.clientX, y: e.clientY };
            dragDistanceRef.current = 0;
        }
    }, []);

    const handleMouseMove = React.useCallback((e) => {
        const currentZoom = zoomLevelRef.current;

        // Safety: If buttons are released (0), stop everything.
        // Also ensure we are still holding strict Left Click (1) if checking bitmask
        if (isDraggingRef.current && currentZoom > 1) {
            // Standard bitmask: 1=Left, 2=Right, 4=Middle.
            // If Left is not pressed, stop.
            if ((e.buttons & 1) === 0) {
                isDraggingRef.current = false;
                setIsDragging(false);
                return;
            }

            e.preventDefault();

            // Calculate Delta
            const deltaX = e.clientX - lastMousePosRef.current.x;
            const deltaY = e.clientY - lastMousePosRef.current.y;

            // Update last pos
            lastMousePosRef.current = { x: e.clientX, y: e.clientY };

            // Apply Delta to Current Pan
            const currentPan = panPositionRef.current;
            const newX = currentPan.x + deltaX;
            const newY = currentPan.y + deltaY;

            // Track drag distance
            dragDistanceRef.current += Math.abs(deltaX) + Math.abs(deltaY);

            // Clamp
            const maxPanX = (window.innerWidth / 1.5) * (currentZoom - 1);
            const maxPanY = (window.innerHeight / 1.5) * (currentZoom - 1);

            const clampedX = Math.max(-maxPanX, Math.min(maxPanX, newX));
            const clampedY = Math.max(-maxPanY, Math.min(maxPanY, newY));

            // CRITICAL: Manually update Ref since we blocked the Effect sync during drag
            panPositionRef.current = { x: clampedX, y: clampedY };

            // NUCLEAR LATTENCY FIX: Direct DOM update to bypass React Render Cycle
            if (imageRef.current) {
                imageRef.current.style.transform = `scale(${currentZoom}) translate(${clampedX / currentZoom}px, ${clampedY / currentZoom}px)`;
            }

            // OPTIMIZATION: Do NOT update state during drag. This prevents React from overwriting
            // our manual DOM updates with stale/laggy frames, and eliminates re-renders.
            // (State will be synced on MouseUp)
            // setPanPosition({ x: clampedX, y: clampedY }); 
        }
    }, []);

    const handleMouseUp = React.useCallback(() => {
        if (isDraggingRef.current) {
            // Commit final position to state
            setPanPosition(panPositionRef.current);
        }
        isDraggingRef.current = false;
        setIsDragging(false);
    }, []);

    // Register non-passive touch listeners for pinch-to-zoom AND panning
    useLayoutEffect(() => {
        if (!selectedImage) return;

        const lightboxElement = document.querySelector('[data-lightbox="true"]');
        if (!lightboxElement) return;

        lightboxElement.addEventListener('touchstart', handleTouchStart, { passive: false });
        lightboxElement.addEventListener('touchmove', handleTouchMove, { passive: false });
        lightboxElement.addEventListener('touchend', handleTouchEnd);

        return () => {
            lightboxElement.removeEventListener('touchstart', handleTouchStart);
            lightboxElement.removeEventListener('touchmove', handleTouchMove);
            lightboxElement.removeEventListener('touchend', handleTouchEnd);
        };
    }, [selectedImage, handleTouchStart, handleTouchMove, handleTouchEnd]);

    // Handle Clicking Background to Close
    const handleBackdropClick = React.useCallback((e) => {
        // Only close if clicking the backdrop itself (not the image or buttons, though stopPropagation usually handles this)
        // AND if we haven't been dragging (distinguish pan from click)
        if (e.target === e.currentTarget && dragDistanceRef.current < 5) {
            setSelectedImage(null);
        }
    }, []);

    return (
        <div className="w-full h-full overflow-y-auto relative scrollbar-custom">
            <div className="px-4 md:px-20 max-w-7xl mx-auto min-h-full relative">
                {/* Home Button - Matching Portfolio Style */}
                <div className="sticky top-0 z-50 pt-6 pb-6 w-full flex justify-start md:justify-center pointer-events-none">
                    <button
                        onClick={() => navigate('/')}
                        className="pointer-events-auto ml-[7px] md:ml-0 p-3 rounded-full bg-black border border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-black transition-all duration-300 hover:scale-110 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    >
                        <Home size={24} />
                    </button>
                </div>

                {/* Camera Credit Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <p className="text-[var(--text-secondary)] text-sm tracking-wide">
                        Captured with Google Pixel
                    </p>
                </motion.div>

                {/* Image Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 [&>*:last-child:nth-child(3n+1)]:lg:col-start-2 [&>*:last-child:nth-child(2n+1)]:md:col-span-2 [&>*:last-child:nth-child(2n+1)]:lg:col-span-1 [&>*:last-child:nth-child(3n+1)]:lg:col-span-1">
                    {thumbnails.map((thumbUrl, index) => (
                        <motion.div
                            key={thumbUrl}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                            onClick={() => {
                                handleImageChange(galleryItems[index].full);
                            }}
                        >
                            <img
                                src={thumbUrl}
                                alt={`Architecture ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                loading={index < 6 ? "eager" : "lazy"}
                                decoding="async"
                                style={{
                                    contentVisibility: 'auto',
                                    willChange: index < 12 ? 'transform' : 'auto'
                                }}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />

                            {/* Border glow on hover */}
                            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-[var(--accent-color)]/30 rounded-xl transition-all duration-300" />
                        </motion.div>
                    ))}
                </div>

                {/* Copyright Notice */}
                <div className="text-center py-8 text-[var(--text-secondary)] text-sm max-w-2xl mx-auto">
                    <p className="mb-2">© 2026 Nigel Paine. All rights reserved.</p>
                    <p className="text-xs opacity-70">
                        All images in this gallery are my original work unless otherwise noted and are not licensed for commercial use without permission.
                    </p>
                </div>

                {/* Footer */}
                <Footer />
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        ref={containerRef}
                        key="lightbox-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black touch-none select-none p-4 md:p-10"
                        data-lightbox="true"
                        onClick={handleBackdropClick}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onDragStart={(e) => e.preventDefault()} // Block native drag
                    >
                        {/* Close Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/50 border-2 border-[var(--accent-color)] text-[var(--accent-color)] active:bg-[var(--accent-color)] active:text-black transition-all duration-300 flex items-center justify-center z-10 [@media(hover:hover)]:hover:bg-[var(--accent-color)] [@media(hover:hover)]:hover:text-black"
                            aria-label="Close"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="4" y1="4" x2="16" y2="16" />
                                <line x1="16" y1="4" x2="4" y2="16" />
                            </svg>
                        </button>

                        {/* Previous Button */}
                        {fullResImages.indexOf(selectedImage) > 0 && zoomLevel === 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.currentTarget.blur();
                                    setSlideDirection(-1);
                                    const currentIndex = fullResImages.indexOf(selectedImage);
                                    handleImageChange(fullResImages[currentIndex - 1]);
                                }}
                                onTouchEnd={(e) => {
                                    setTimeout(() => e.currentTarget.blur(), 100);
                                }}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border-2 border-[var(--accent-color)] text-[var(--accent-color)] active:bg-[var(--accent-color)] active:text-black transition-all duration-300 hidden md:flex items-center justify-center z-10 [@media(hover:hover)]:hover:bg-[var(--accent-color)] [@media(hover:hover)]:hover:text-black [@media(max-height:500px)]:top-[60%]"
                                aria-label="Previous image"
                            >
                                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="10,2 2,10 10,18" />
                                </svg>
                            </button>
                        )}

                        {/* Next Button */}
                        {fullResImages.indexOf(selectedImage) < fullResImages.length - 1 && zoomLevel === 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.currentTarget.blur();
                                    setSlideDirection(1);
                                    const currentIndex = fullResImages.indexOf(selectedImage);
                                    handleImageChange(fullResImages[currentIndex + 1]);
                                }}
                                onTouchEnd={(e) => {
                                    setTimeout(() => e.currentTarget.blur(), 100);
                                }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border-2 border-[var(--accent-color)] text-[var(--accent-color)] active:bg-[var(--accent-color)] active:text-black transition-all duration-300 hidden md:flex items-center justify-center z-10 [@media(hover:hover)]:hover:bg-[var(--accent-color)] [@media(hover:hover)]:hover:text-black [@media(max-height:500px)]:top-[60%]"
                                aria-label="Next image"
                            >
                                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="2,2 10,10 2,18" />
                                </svg>
                            </button>
                        )}

                        {/* Image Container with Slide Animation */}
                        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center pb-12">
                            <AnimatePresence mode="wait" custom={slideDirection}>
                                <motion.img
                                    ref={imageRef}
                                    key={selectedImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 0.1,
                                        ease: "easeInOut"
                                    }}
                                    src={selectedImage}
                                    alt="Full size"
                                    className="max-w-full max-h-[calc(100vh-120px)] min-h-[200px] object-contain rounded-2xl shadow-2xl"
                                    style={{
                                        transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                                        cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                                        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                                        willChange: zoomLevel > 1 ? 'transform' : 'auto'
                                    }}
                                    onClick={handleImageClick}
                                    onLoad={handleImageLoad}
                                    draggable={false}
                                />
                            </AnimatePresence>

                            {/* Loading Spinner */}
                            {imageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                                    <div className="w-12 h-12 border-4 border-[var(--accent-color)]/30 border-t-[var(--accent-color)] rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        {/* Image Counter - Outside image container */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 border border-[var(--accent-color)] text-[var(--accent-color)] text-sm font-mono backdrop-blur-sm">
                            {fullResImages.indexOf(selectedImage) + 1} / {fullResImages.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Architecture;
