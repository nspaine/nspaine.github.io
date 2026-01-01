import React, { useState } from 'react';
import { RefreshCw, AlertTriangle, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    return (
        <div className="fixed inset-0 z-[9999] bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4 text-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_100%)] z-0" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-lg w-full bg-black/60 backdrop-blur-xl border border-[var(--accent-color)] p-8 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.1)] flex flex-col items-center max-h-[90vh] overflow-y-auto scrollbar-hide">

                {/* Icon - Pulse on icon only */}
                <div className="mb-6 relative flex-shrink-0">
                    <AlertTriangle className="w-20 h-20 text-[var(--accent-color)] relative z-10 animate-pulse-gold" />
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-widest uppercase font-[Orbitron] drop-shadow-md flex-shrink-0">
                    SIGNAL LOST
                </h1>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent opacity-50 my-4 flex-shrink-0" />

                {/* Collapsible Technical Error Details */}
                {error && (
                    <div className="w-full mb-6 flex-shrink-0">
                        <button
                            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                            className="w-full flex items-center justify-between px-4 py-2 bg-black/40 border border-white/10 rounded hover:bg-black/60 transition-colors text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider mb-2"
                        >
                            <span className="flex items-center gap-2">
                                <Terminal size={14} />
                                System Diagnostics
                            </span>
                            {isDetailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        {isDetailsOpen && (
                            <div className="w-full bg-black/90 border border-red-900/30 p-4 rounded text-left overflow-auto max-h-48 scrollbar-custom shadow-inner">
                                <div className="font-mono text-[10px] md:text-xs leading-relaxed text-red-400/80 font-normal break-all whitespace-pre-wrap">
                                    <span className="text-red-500 font-bold block mb-2">Error: {error.toString()}</span>
                                    {error.stack && (
                                        <span className="opacity-75">{error.stack}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={() => {
                        // Attempt to reset boundary first, if that fails or isn't enough, hard reload
                        if (resetErrorBoundary) {
                            resetErrorBoundary();
                        } else {
                            window.location.reload();
                        }
                    }}
                    className="group relative px-8 py-3 bg-[var(--accent-color)] text-black font-bold uppercase tracking-[0.2em] text-sm hover:bg-[#ffe44d] transition-all duration-300 clip-path-polygon hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] flex items-center gap-2 flex-shrink-0"
                    style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                >
                    <RefreshCw className="w-4 h-4 group-hover:animate-spin" />
                    Reinitialize Website
                </button>
            </div>

            {/* Decorative Footer */}
            <div className="absolute bottom-8 text-[var(--text-secondary)] text-xs opacity-50 tracking-[0.3em]">
                ERROR_CODE: 0xDEADBEEF
            </div>
        </div>
    );
};

export default ErrorFallback;
