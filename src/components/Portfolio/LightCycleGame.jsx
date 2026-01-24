import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const GAME_SPEED = 100; // ms per frame

// Draw a simple square light cycle
const drawLightCycle = (ctx, x, y, color, glowColor) => {
    ctx.fillStyle = color;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 15;
    ctx.fillRect(x * GRID_SIZE + 2, y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);
    ctx.shadowBlur = 0;
};

// Pixelated explosion animation
const drawExplosion = (ctx, x, y, frame, colorType) => {
    const cx = x * GRID_SIZE + GRID_SIZE / 2;
    const cy = y * GRID_SIZE + GRID_SIZE / 2;
    const maxRadius = GRID_SIZE * 2;

    ctx.save();

    const particleCount = 12;
    const radius = (frame / 10) * maxRadius;
    const alpha = Math.max(0, 1 - frame / 15);

    const colorMap = {
        gold: { rgb: '255, 215, 0', hex: '#FFD700' },
        cyan: { rgb: '0, 255, 255', hex: '#00FFFF' },
        red: { rgb: '255, 80, 80', hex: '#FF5050' }
    };
    const colorInfo = colorMap[colorType] || colorMap.gold;

    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + (frame * 0.1);
        const dist = radius + Math.sin(i * 3 + frame) * 5;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;
        const size = Math.max(2, 8 - frame / 2);

        ctx.fillStyle = `rgba(${colorInfo.rgb}, ${alpha})`;
        ctx.shadowColor = colorInfo.hex;
        ctx.shadowBlur = 10 * alpha;

        ctx.fillRect(
            Math.floor(px / 4) * 4,
            Math.floor(py / 4) * 4,
            size,
            size
        );
    }

    if (frame < 5) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.8 - frame * 0.15})`;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 20;
        ctx.fillRect(cx - 6, cy - 6, 12, 12);
    }

    ctx.restore();
};

const LightCycleGame = ({ isOpen, onClose }) => {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('ready');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('lightCycleHighScore');
        return saved ? parseInt(saved, 10) : 0;
    });

    const [isVertical, setIsVertical] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsVertical(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const gameDataRef = useRef({
        player: { x: 5, y: 12, dx: 1, dy: 0 },
        trail: [],
        ai1: { x: 26, y: 8, dx: -1, dy: 0, crashed: false },
        ai1Trail: [],
        ai2: { x: 26, y: 16, dx: -1, dy: 0, crashed: false },
        ai2Trail: [],
        gridWidth: 0,
        gridHeight: 0,
        explosionFrame: 0,
        crashPosition: null,
        crashType: null
    });

    const gameLoopRef = useRef(null);
    const explosionLoopRef = useRef(null);

    const initGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gridWidth = Math.floor(canvas.width / GRID_SIZE);
        const gridHeight = Math.floor(canvas.height / GRID_SIZE);

        const vertical = canvas.height > canvas.width;

        gameDataRef.current = {
            player: vertical
                ? { x: Math.floor(gridWidth / 2), y: gridHeight - 8, dx: 0, dy: -1 }
                : { x: 5, y: Math.floor(gridHeight / 2), dx: 1, dy: 0 },
            trail: [],
            ai1: vertical
                ? { x: Math.floor(gridWidth / 3), y: 5, dx: 0, dy: 1, crashed: false }
                : { x: gridWidth - 6, y: Math.floor(gridHeight / 3), dx: -1, dy: 0, crashed: false },
            ai1Trail: [],
            ai2: vertical
                ? { x: Math.floor(gridWidth * 2 / 3), y: 5, dx: 0, dy: 1, crashed: false }
                : { x: gridWidth - 6, y: Math.floor(gridHeight * 2 / 3), dx: -1, dy: 0, crashed: false },
            ai2Trail: [],
            gridWidth,
            gridHeight,
            explosionFrame: 0,
            crashPosition: null,
            crashType: null,
            inputQueue: []
        };

        setScore(0);
        setGameState('playing');
    }, []);

    // Check collision against walls, own trail, and all other trails
    const checkCollision = useCallback((x, y, ownTrail, otherTrails, otherHeads, gridWidth, gridHeight) => {
        if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return true;
        if (ownTrail.some(p => p.x === x && p.y === y)) return true;
        for (const trail of otherTrails) {
            if (trail.some(p => p.x === x && p.y === y)) return true;
        }
        for (const head of otherHeads) {
            if (head && x === head.x && y === head.y) return true;
        }
        return false;
    }, []);

    const updateAI = useCallback((ai, ownTrail, allOtherTrails, allHeads, gridWidth, gridHeight) => {
        const possibleMoves = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ].filter(move => {
            if (move.dx === -ai.dx && move.dy === -ai.dy) return false;
            const newX = ai.x + move.dx;
            const newY = ai.y + move.dy;
            return !checkCollision(newX, newY, ownTrail, allOtherTrails, allHeads, gridWidth, gridHeight);
        });

        if (possibleMoves.length > 0) {
            const currentMove = possibleMoves.find(m => m.dx === ai.dx && m.dy === ai.dy);
            if (currentMove && Math.random() > 0.15) {
                return currentMove;
            }
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
        return { dx: ai.dx, dy: ai.dy };
    }, [checkCollision]);

    const drawGame = useCallback((showExplosion = false) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const data = gameDataRef.current;
        const { player, trail, ai1, ai1Trail, ai2, ai2Trail } = data;

        // Clear
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw trails
        ctx.shadowBlur = 8;

        // Player trail (gold)
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        trail.forEach(p => {
            ctx.fillRect(p.x * GRID_SIZE + 3, p.y * GRID_SIZE + 3, GRID_SIZE - 6, GRID_SIZE - 6);
        });

        // AI1 trail (cyan)
        ctx.fillStyle = '#00FFFF';
        ctx.shadowColor = '#00FFFF';
        ai1Trail.forEach(p => {
            ctx.fillRect(p.x * GRID_SIZE + 3, p.y * GRID_SIZE + 3, GRID_SIZE - 6, GRID_SIZE - 6);
        });

        // AI2 trail (red)
        ctx.fillStyle = '#FF5050';
        ctx.shadowColor = '#FF5050';
        ai2Trail.forEach(p => {
            ctx.fillRect(p.x * GRID_SIZE + 3, p.y * GRID_SIZE + 3, GRID_SIZE - 6, GRID_SIZE - 6);
        });

        ctx.shadowBlur = 0;

        // Draw bikes (squares)
        if (data.crashType !== 'player') {
            drawLightCycle(ctx, player.x, player.y, '#FFD700', '#FFEC8B');
        }
        if (!ai1.crashed && data.crashType !== 'ai1') {
            drawLightCycle(ctx, ai1.x, ai1.y, '#00FFFF', '#7FFFFF');
        }
        if (!ai2.crashed && data.crashType !== 'ai2') {
            drawLightCycle(ctx, ai2.x, ai2.y, '#FF5050', '#FF8080');
        }

        // Draw explosion
        if (showExplosion && data.crashPosition) {
            const colorType = data.crashType === 'player' ? 'gold' : data.crashType === 'ai1' ? 'cyan' : 'red';
            drawExplosion(ctx, data.crashPosition.x, data.crashPosition.y, data.explosionFrame, colorType);
        }
    }, []);

    const gameLoop = useCallback(() => {
        const data = gameDataRef.current;
        const { player, trail, ai1, ai1Trail, ai2, ai2Trail, gridWidth, gridHeight, inputQueue } = data;

        // Process next turn from queue
        // We only process one input per tick to maintain the speed but ensure order
        if (inputQueue.length > 0) {
            const nextMove = inputQueue.shift();
            // Check if it's not a 180-degree turn
            if (!(nextMove.dx === -player.dx && nextMove.dy === -player.dy)) {
                player.dx = nextMove.dx;
                player.dy = nextMove.dy;
            }
        }

        // Player new position
        const newPlayerX = player.x + player.dx;
        const newPlayerY = player.y + player.dy;

        // All trails for collision checking
        const allTrails = [trail, ai1Trail, ai2Trail];

        // AI1 move
        let newAi1X = ai1.x, newAi1Y = ai1.y;
        if (!ai1.crashed) {
            const ai1Move = updateAI(ai1, ai1Trail, [trail, ai2Trail], [player, ai2], gridWidth, gridHeight);
            ai1.dx = ai1Move.dx;
            ai1.dy = ai1Move.dy;
            newAi1X = ai1.x + ai1.dx;
            newAi1Y = ai1.y + ai1.dy;
        }

        // AI2 move
        let newAi2X = ai2.x, newAi2Y = ai2.y;
        if (!ai2.crashed) {
            const ai2Move = updateAI(ai2, ai2Trail, [trail, ai1Trail], [player, ai1], gridWidth, gridHeight);
            ai2.dx = ai2Move.dx;
            ai2.dy = ai2Move.dy;
            newAi2X = ai2.x + ai2.dx;
            newAi2Y = ai2.y + ai2.dy;
        }

        // Check player collision
        const playerCrashed = checkCollision(newPlayerX, newPlayerY, trail, [ai1Trail, ai2Trail], [ai1, ai2], gridWidth, gridHeight) ||
            (newPlayerX === newAi1X && newPlayerY === newAi1Y) ||
            (newPlayerX === newAi2X && newPlayerY === newAi2Y);

        if (playerCrashed) {
            data.crashPosition = { x: newPlayerX, y: newPlayerY };
            data.crashType = 'player';
            data.explosionFrame = 0;
            setGameState('exploding');
            return;
        }

        // Check AI1 collision
        const ai1Crashed = !ai1.crashed && (
            checkCollision(newAi1X, newAi1Y, ai1Trail, [trail, ai2Trail], [player, ai2], gridWidth, gridHeight) ||
            (newPlayerX === newAi1X && newPlayerY === newAi1Y) ||
            (newAi1X === newAi2X && newAi1Y === newAi2Y)
        );

        // Check AI2 collision
        const ai2Crashed = !ai2.crashed && (
            checkCollision(newAi2X, newAi2Y, ai2Trail, [trail, ai1Trail], [player, ai1], gridWidth, gridHeight) ||
            (newPlayerX === newAi2X && newPlayerY === newAi2Y) ||
            (newAi1X === newAi2X && newAi1Y === newAi2Y)
        );

        // Handle AI crashes with explosion
        if (ai1Crashed && !ai1.crashed) {
            ai1.crashed = true;
            data.crashPosition = { x: newAi1X, y: newAi1Y };
            data.crashType = 'ai1';
            data.explosionFrame = 0;
            let frame = 0;
            const explosion = setInterval(() => {
                frame++;
                data.explosionFrame = frame;
                drawGame(true);
                if (frame >= 15) {
                    clearInterval(explosion);
                    data.crashPosition = null;
                    data.crashType = null;
                }
            }, 50);
        }

        if (ai2Crashed && !ai2.crashed) {
            ai2.crashed = true;
            data.crashPosition = { x: newAi2X, y: newAi2Y };
            data.crashType = 'ai2';
            data.explosionFrame = 0;
            let frame = 0;
            const explosion = setInterval(() => {
                frame++;
                data.explosionFrame = frame;
                drawGame(true);
                if (frame >= 15) {
                    clearInterval(explosion);
                    data.crashPosition = null;
                    data.crashType = null;
                }
            }, 50);
        }

        // Update positions
        trail.push({ x: player.x, y: player.y });
        player.x = newPlayerX;
        player.y = newPlayerY;

        if (!ai1.crashed) {
            ai1Trail.push({ x: ai1.x, y: ai1.y });
            ai1.x = newAi1X;
            ai1.y = newAi1Y;
        }

        if (!ai2.crashed) {
            ai2Trail.push({ x: ai2.x, y: ai2.y });
            ai2.x = newAi2X;
            ai2.y = newAi2Y;
        }

        setScore(s => s + 1);
        drawGame(data.crashType !== null);
    }, [checkCollision, updateAI, drawGame]);

    // Explosion animation
    useEffect(() => {
        if (gameState === 'exploding') {
            const data = gameDataRef.current;
            explosionLoopRef.current = setInterval(() => {
                data.explosionFrame++;
                drawGame(true);
                if (data.explosionFrame >= 15) {
                    clearInterval(explosionLoopRef.current);
                    setGameState('gameover');
                    if (score > highScore) {
                        setHighScore(score);
                        localStorage.setItem('lightCycleHighScore', score.toString());
                    }
                }
            }, 50);
            return () => clearInterval(explosionLoopRef.current);
        }
    }, [gameState, drawGame, score, highScore]);

    // Keyboard controls
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            // Global keys
            if (e.key === 'Escape') {
                onClose();
                return;
            }

            if (e.key === 'Enter') {
                if (gameState === 'ready' || gameState === 'gameover') {
                    initGame();
                    return;
                }
            }

            if (gameState !== 'playing') return;
            const data = gameDataRef.current;
            const { player, inputQueue } = data;

            // Maximum queue size to prevent excessive lag if they mash keys
            if (inputQueue.length >= 3) return;

            // Determine what the "last" intended direction is (from the last queued item or current)
            const lastMove = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : player;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (lastMove.dy !== 1 && lastMove.dy !== -1) {
                        inputQueue.push({ dx: 0, dy: -1 });
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (lastMove.dy !== -1 && lastMove.dy !== 1) {
                        inputQueue.push({ dx: 0, dy: 1 });
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (lastMove.dx !== 1 && lastMove.dx !== -1) {
                        inputQueue.push({ dx: -1, dy: 0 });
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (lastMove.dx !== -1 && lastMove.dx !== 1) {
                        inputQueue.push({ dx: 1, dy: 0 });
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, gameState, initGame, onClose]);

    // Game loop
    useEffect(() => {
        if (gameState === 'playing') {
            gameLoopRef.current = setInterval(gameLoop, GAME_SPEED);
            return () => clearInterval(gameLoopRef.current);
        }
    }, [gameState, gameLoop]);

    // Init canvas
    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.1)';
            for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        }
    }, [isOpen]);

    // Touch controls
    const handleSwipe = useCallback((direction) => {
        if (gameState !== 'playing') return;
        const data = gameDataRef.current;
        const { player, inputQueue } = data;

        if (inputQueue.length >= 3) return;
        const lastMove = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : player;

        switch (direction) {
            case 'up':
                if (lastMove.dy !== 1 && lastMove.dy !== -1) {
                    inputQueue.push({ dx: 0, dy: -1 });
                }
                break;
            case 'down':
                if (lastMove.dy !== -1 && lastMove.dy !== 1) {
                    inputQueue.push({ dx: 0, dy: 1 });
                }
                break;
            case 'left':
                if (lastMove.dx !== 1 && lastMove.dx !== -1) {
                    inputQueue.push({ dx: -1, dy: 0 });
                }
                break;
            case 'right':
                if (lastMove.dx !== -1 && lastMove.dx !== 1) {
                    inputQueue.push({ dx: 1, dy: 0 });
                }
                break;
        }
    }, [gameState]);

    const touchStartRef = useRef({ x: 0, y: 0 });

    const handleTouchStart = (e) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const handleTouchEnd = (e) => {
        const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
        const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            handleSwipe(dx > 0 ? 'right' : 'left');
        } else {
            handleSwipe(dy > 0 ? 'down' : 'up');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-2xl bg-[#0a0a0a] border-2 border-[#FFD700] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.3)] flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[#FFD700]/30">
                        <h2 className="text-xl font-bold font-[Orbitron] text-[#FFD700]">
                            LIGHT CYCLE
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-mono text-zinc-400">
                                HI: <span className="text-[#FFD700]">{highScore}</span>
                            </span>
                            <span className="text-sm font-mono text-zinc-400">
                                SCORE: <span className="text-[#FFD700]">{score}</span>
                            </span>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-[#FFD700]/20 text-[#FFD700] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Game Area */}
                    <div
                        className={`relative w-full ${isVertical ? 'aspect-[2/3]' : 'aspect-[4/3]'}`}
                        onTouchStart={isVertical ? handleTouchStart : undefined}
                        onTouchEnd={isVertical ? handleTouchEnd : undefined}
                    >
                        <canvas
                            ref={canvasRef}
                            width={isVertical ? 480 : 640}
                            height={isVertical ? 720 : 480}
                            className="w-full h-full"
                        />

                        {/* Ready Overlay */}
                        {gameState === 'ready' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                                {isVertical ? (
                                    <p className="text-lg text-zinc-400 mb-6 text-center px-4">
                                        Swipe to <span className="text-[#FFD700]">MOVE</span>
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-lg text-zinc-400 mb-6 text-center px-4">
                                            Use <span className="text-[#FFD700]">WASD</span> or <span className="text-[#FFD700]">Arrow Keys</span> to move
                                        </p>
                                    </>
                                )}
                                <button
                                    onClick={initGame}
                                    className="px-8 py-3 bg-[#FFD700] text-black font-bold font-[Orbitron] rounded-lg hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(255,215,0,0.5)] tracking-widest"
                                >
                                    ENTER THE GRID
                                </button>
                            </div>
                        )}

                        {/* Game Over Overlay */}
                        {gameState === 'gameover' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                                <h3 className="text-3xl font-bold font-[Orbitron] text-red-500 mb-2">
                                    DEREZZED
                                </h3>
                                <p className="text-lg text-zinc-400 mb-1">
                                    Score: <span className="text-[#FFD700]">{score}</span>
                                </p>
                                {score >= highScore && score > 0 && (
                                    <p className="text-sm text-[#FFD700] mb-4">New High Score!</p>
                                )}
                                <button
                                    onClick={initGame}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-black font-bold font-[Orbitron] rounded-lg hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                                >
                                    <RotateCcw size={18} />
                                    RETRY
                                </button>
                            </div>
                        )}
                    </div>


                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LightCycleGame;
