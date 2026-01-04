import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Code } from 'lucide-react';

const CircuitNode = ({ project, index, isLast }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isEven = index % 2 === 0;

    // Animation variants
    const nodeVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.25, delay: Math.min(index * 0.05, 0.2) }
        }
    };

    return (
        <motion.div
            className={`flex w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} relative mb-12 md:mb-12 3xl:mb-32 md:justify-between ${index > 0 ? 'md:-mt-40 3xl:-mt-48' : ''} group`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
        >
            {/* CENTRAL BUS LINE SEGMENT - REMOVED (Handled by parent for continuity) */}

            {/* SPACER FOR CENTER ALIGNMENT - Desktop */}
            {/* Acts as the opposing side to force justify-between to push the card to the edge */}
            <div className="hidden md:block w-[40%]" />

            {/* NODE DOT (Junction Point on Central Bus) */}
            <div
                className={`absolute left-8 md:left-1/2 top-8 w-4 h-4 -translate-x-1/2 rounded-full border-2 border-[var(--accent-color)] bg-black shadow-[0_0_10px_var(--accent-color)] z-20 transition-transform duration-300 group-hover:scale-125`}
            />

            {/* NODE CONNECTION LINE (Desktop) - Branching Trace from Center to Card */}
            <div className={`absolute top-[38px] left-1/2 h-[4px] bg-[#FFD700] shadow-[0_0_8px_#FFD700]
                ${isEven ? 'origin-left' : '-translate-x-full origin-right'}
                w-[10%]
                z-0 hidden md:block`}
            />

            {/* NODE CONNECTION LINE (Mobile) - Short trace from left-aligned bus to card */}
            <div className="absolute top-[38px] left-8 w-8 h-[4px] bg-[#FFD700] shadow-[0_0_8px_#FFD700] z-0 md:hidden origin-left" />

            {/* CONTENT CARD */}
            <motion.div
                variants={nodeVariants}
                className={`w-full md:w-[40%] z-10 pl-16 pr-4 md:px-0 group ${isEven ? 'md:text-right' : 'md:text-left'} text-left`}
            >

                {/* THE CARD ITSELF */}
                <div
                    className={`
                        p-6 3xl:p-10 rounded-xl bg-black/90
                        shadow-[0_0_15px_rgba(0,0,0,0.5)]
                        hover:shadow-[0_0_25px_var(--accent-color-dim)]
                        transition-[box-shadow,border-color] duration-300 cursor-pointer
                        [contain:paint]
                        overflow-hidden
                    `}
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        '--accent-color-dim': 'rgba(255, 215, 0, 0.3)'
                    }}
                >

                    {/* Project Image Preview */}
                    <div className="w-full h-40 3xl:h-72 mb-6 3xl:mb-8 rounded-lg overflow-hidden border border-[var(--glass-border)] relative group-hover:border-[var(--accent-color)]/50 transition-colors">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Header: Icon + Title */}
                    <div className={`flex items-center gap-4 mb-2 3xl:mb-4 ${isEven ? 'md:flex-row-reverse' : 'flex-row'}`}>
                        <div className="p-3 3xl:p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--accent-color)] shrink-0">
                            {project.icon}
                        </div>
                        <div className="flex-grow min-w-0">
                            <h3 className="text-xl md:text-2xl 3xl:text-4xl font-bold font-[Orbitron] text-zinc-100">
                                {project.title}
                            </h3>
                            {/* Desktop Meta (Inside Header) */}
                            <div className={`hidden md:flex items-center text-xs 3xl:text-base text-[var(--text-secondary)] gap-1.5 3xl:gap-3 mt-2 ${isEven ? 'md:justify-end' : ''}`}>
                                {/* Toggle Arrow (Left for Right-Side Cards) */}
                                {isEven && (
                                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} text-[var(--text-secondary)] mr-2`}>
                                        <ChevronDown size={14} />
                                    </div>
                                )}

                                <span className="px-2 py-0.5 rounded-full border border-[var(--text-secondary)]/30">
                                    {project.year}
                                </span>
                                <span className="inline-block mx-1 text-[var(--text-secondary)]/50">•</span>
                                <span className="font-mono tracking-wider uppercase text-[10px] md:text-xs whitespace-nowrap">
                                    {project.status}
                                </span>

                                {/* Toggle Arrow (Right for Left-Side Cards) */}
                                {!isEven && (
                                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} text-[var(--text-secondary)] ml-2`}>
                                        <ChevronDown size={14} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Meta (Outside Header) */}
                    <div className={`flex md:hidden items-center justify-between text-xs text-[var(--text-secondary)] mb-4`}>
                        <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full border border-[var(--text-secondary)]/30">
                                {project.year}
                            </span>
                            <span className="inline-block mx-1 text-[var(--text-secondary)]/50">•</span>
                            <span className="font-mono tracking-wider uppercase text-[10px] md:text-xs whitespace-nowrap">
                                {project.status}
                            </span>
                        </div>
                        {/* Toggle Arrow (Always Right on Mobile) */}
                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} text-[var(--text-secondary)]`}>
                            <ChevronDown size={16} />
                        </div>
                    </div>

                    {/* Tech Stack Preview (Collapsed) - Only visible when NOT expanded */}
                    {!isExpanded && (
                        <div className={`mt-4 flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : ''}`}>
                            {project.tech.slice(0, 3).map((t, i) => (
                                <span key={i} className="text-[10px] 3xl:text-sm font-mono px-2 py-1 rounded bg-black/50 border border-[var(--glass-border)] text-zinc-400">
                                    {t}
                                </span>
                            ))}
                            {project.tech.length > 3 && (
                                <span className="text-[10px] font-mono px-2 py-1 text-zinc-500">
                                    +{project.tech.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    {/* EXPANDED CONTENT */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="pt-6 mt-6 border-t border-[var(--glass-border)]">

                                    {/* Full Tech Stack (No Label) */}
                                    <div className={`flex flex-wrap gap-2 mb-6 ${isEven ? 'md:justify-end' : ''}`}>
                                        {project.tech.map((t, i) => (
                                            <span key={i} className="text-xs 3xl:text-sm font-mono px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-secondary)]">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Full Description */}
                                    <p className={`text-zinc-300 font-mono text-xs md:text-sm 3xl:text-lg leading-6 3xl:leading-8 mb-6 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                        {project.fullDescription}
                                    </p>

                                    {/* Actions */}
                                    {project.link && (
                                        <div className={`flex gap-3 ${isEven ? 'md:justify-end' : ''}`}>
                                            <a href={project.link} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-color)] text-black font-bold text-sm hover:bg-yellow-400 transition-colors">
                                                <ExternalLink size={16} />
                                                View Project
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </motion.div>
        </motion.div>
    );
};

export default CircuitNode;
