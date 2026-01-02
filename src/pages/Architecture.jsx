import React, { useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '../components/Layout/Layout';
import Footer from '../components/Layout/Footer';


// Image filenames
const imageFilenames = [
    'Image~2.webp', 'Image~3.webp', 'PXL_20221217_204749031~2.webp',
    'PXL_20230224_221616739~2.webp', 'PXL_20230224_231524647.webp',
    'PXL_20230224_231548104~2.webp', 'PXL_20230615_132742527~3.webp',
    'PXL_20230615_171002859~2.webp', 'PXL_20230820_190817904.webp',
    'PXL_20230823_163247227.webp', 'PXL_20231209_234911689-01.webp',
    'PXL_20240311_202043373.webp', 'PXL_20240311_202048690~3.webp',
    'PXL_20240312_190659652~2.webp', 'PXL_20240519_173245250.webp',
    'PXL_20240807_184452907~2.webp', 'PXL_20240807_191904432~2.webp',
    'PXL_20240808_121018498~2.webp', 'PXL_20240808_124013650.webp',
    'PXL_20240808_124655591~2.webp', 'PXL_20240809_092223441~3.webp',
    'PXL_20240810_065634673.webp', 'PXL_20240810_091337394.webp',
    'PXL_20240810_092813117~2.webp', 'PXL_20240810_094532001~2.webp',
    'PXL_20240811_141332088.webp', 'PXL_20240811_154807741~3.webp',
    'PXL_20240811_192512755.webp', 'PXL_20240812_094141298~2.webp',
    'PXL_20250215_174428711~2.webp', 'PXL_20250704_204053335.MP~2.webp',
    'PXL_20250705_213231237~2.webp', 'PXL_20250705_213854943~2.webp',
    'PXL_20250705_232335490~2.webp', 'PXL_20250705_233147330~2.webp',
    'PXL_20250705_234009670~2.webp', 'PXL_20250705_235947312.webp',
    'PXL_20250706_000248312.webp', 'PXL_20250706_162337271.webp',
    'PXL_20250706_170611324~2.webp', 'PXL_20250706_171047823.webp',
    'PXL_20250706_171257546.webp', 'PXL_20250706_172128615~2.webp',
    'PXL_20250706_172153148~2.webp', 'PXL_20250706_172813182.webp',
    'PXL_20250706_173222362~2.webp', 'PXL_20250706_173231367~2.webp',
    'PXL_20250706_182200066.webp', 'PXL_20250821_171138451~2.webp',
    'PXL_20250821_191140603~2.webp', 'PXL_20250822_091955296~2.webp',
    'PXL_20250822_092642867~2.webp', 'PXL_20250822_163225543.webp',
    'PXL_20250822_172152402~2.webp', 'PXL_20250823_142022828~2.webp',
    'PXL_20250824_090714275~2.webp', 'PXL_20250824_102438799~2.webp',
    'PXL_20250824_111430018.webp', 'PXL_20250824_183325819.webp',
    'PXL_20250826_134746038~2.webp', 'PXL_20250826_134846251.webp',
    'PXL_20250828_164804723~2.webp', 'PXL_20250829_114414779.webp',
    'PXL_20250829_120156307~2.webp', 'PXL_20250829_123341484~3.webp',
    'PXL_20250829_144924912~2.webp', 'PXL_20250830_083930550~2.webp',
    'PXL_20250830_113922121.webp', 'PXL_20250830_183239712~2.webp',
    'PXL_20251025_171310690.webp', 'PXL_20251025_183557572~2.webp',
    'PXL_20251206_192935305.webp', 'PXL_20251206_195507168.webp'
];

// Thumbnail images for gallery (800px wide, faster loading)
const thumbnails = imageFilenames.map(filename =>
    `${import.meta.env.BASE_URL}images/architecture/thumbs/${filename}`
);

// Full resolution images for lightbox
const fullResImages = imageFilenames.map(filename =>
    `${import.meta.env.BASE_URL}images/architecture/${filename}`
);

const Architecture = () => {
    const navigate = useNavigate();
    const { setAreAssetsLoaded } = useLoader();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [slideDirection, setSlideDirection] = useState(0); // -1 for left, 1 for right

    // Persistent cache to prevent GC
    const preloadedMap = React.useRef(new Map());

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

    const loadingTimeoutRef = React.useRef(null);

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

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        };

        const handleSwipe = () => {
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

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);
        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [selectedImage, fullResImages]);

    const handleImageLoad = (event) => {
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
        }
        setImageLoading(false);
    };

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
                                handleImageChange(fullResImages[index]);
                            }}
                        >
                            <img
                                src={thumbUrl}
                                alt={`Architecture ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                loading="eager"
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-2"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/50 border-2 border-[var(--accent-color)] text-[var(--accent-color)] active:bg-[var(--accent-color)] active:text-black transition-all duration-300 flex items-center justify-center z-10 [@media(hover:hover)]:hover:bg-[var(--accent-color)] [@media(hover:hover)]:hover:text-black"
                            aria-label="Close"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="4" y1="4" x2="16" y2="16" />
                                <line x1="16" y1="4" x2="4" y2="16" />
                            </svg>
                        </button>

                        {/* Previous Button */}
                        {fullResImages.indexOf(selectedImage) > 0 && (
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
                        {fullResImages.indexOf(selectedImage) < fullResImages.length - 1 && (
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
                                    onClick={(e) => e.stopPropagation()}
                                    onLoad={handleImageLoad}
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
