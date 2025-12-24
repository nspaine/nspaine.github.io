import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Cpu, Database, Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const projects = [
    {
        title: "COVID-MA Analyzer",
        description: "Data analysis tool for tracking COVID-19 trends in Massachusetts. Automated report generation and visualization pipelines.",
        tech: ["Python", "Pandas", "Matplotlib"],
        icon: <Database />,
        link: "#"
    },
    {
        title: "Embedded RTOS Kernel",
        description: "Custom real-time operating system kernel for ARM Cortex-M4. Features preemptive scheduling and inter-process communication.",
        tech: ["C", "Assembly", "ARM"],
        icon: <Cpu />,
        link: "#"
    },
    {
        title: "Cloud IoT Gateway",
        description: "Scalable gateway service for ingesting sensor data from thousands of edge devices. Built with robust error handling and buffering.",
        tech: ["Go", "AWS Lambda", "MQTT"],
        icon: <Cloud />,
        link: "#"
    },
    {
        title: "Personal Website",
        description: "Modern, interactive personal portfolio website with WebGL background and split-screen navigation.",
        tech: ["React", "Vite", "Tailwind/CSS", "Framer Motion"],
        icon: <ExternalLink />,
        link: "#"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

const Portfolio = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-24 px-6 md:px-20 max-w-7xl mx-auto min-h-screen">
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 mb-12 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors group"
            >
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </button>

            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"
            >
                Software Portfolio
            </motion.h1>
            <p className="text-[var(--text-secondary)] mb-12 text-lg max-w-2xl">
                A collection of projects spanning embedded systems, cloud infrastructure, and modern web development.
            </p>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className="glass-panel p-6 hover:border-[var(--accent-color)] transition-colors group relative overflow-hidden"
                        whileHover={{ y: -5 }}
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-[var(--accent-color)]">
                            {project.icon}
                        </div>

                        <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--accent-color)] transition-colors">
                            {project.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                            {project.tech.map((t, i) => (
                                <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-secondary)]">
                                    {t}
                                </span>
                            ))}
                        </div>

                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-color)] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Portfolio;
