import React from 'react';
import { Database, Cpu, Cloud, ExternalLink } from 'lucide-react';
// Using the profile pixel image as a placeholder for now since we don't have project screenshots yet
import placeholderImg from '../assets/pcb-background.jpg';

export const projects = [
    {
        id: "personal-site",
        title: "Personal Website",
        description: "Modern, interactive personal portfolio website with WebGL background and split-screen navigation.",
        fullDescription: "This website itself! Designed to reflect a hardware/software engineer aesthetic with a custom circuitry simulation background. Features a responsive layout that adapts from a dashboard-style view on desktop to a vertical scroll on mobile.",
        tech: ["React", "Vite", "TailwindCSS", "Framer Motion", "Canvas API"],
        icon: <ExternalLink />,
        image: placeholderImg,
        link: "#",
        status: "Live",
        year: "2024"
    },
    {
        id: "iot-gateway",
        title: "Cloud IoT Gateway",
        description: "Scalable gateway service for ingesting sensor data from thousands of edge devices. Built with robust error handling and buffering.",
        fullDescription: "Designed to handle high-throughput telemetry from industrial sensors. The service buffers incoming MQTT messages, validates payloads against JSON schemas, and batches writes to a data lake. Achieved 99.99% uptime during load testing with simulated 10k concurrent connections.",
        tech: ["Go", "AWS Lambda", "MQTT", "Redis", "Terraform"],
        icon: <Cloud />,
        image: placeholderImg,
        link: "#",
        status: "Deployed",
        year: "2022"
    },
    {
        id: "rtos-kernel",
        title: "Embedded RTOS Kernel",
        description: "Custom real-time operating system kernel for ARM Cortex-M4. Features preemptive scheduling and inter-process communication.",
        fullDescription: "A fully preemptive real-time kernel written from scratch for the STM32F4 microcontroller. Implements round-robin scheduling, semaphores, mutexes, and message queues. Optimized context switching in pure assembly significantly reduced overhead compared to FreeRTOS on the same hardware.",
        tech: ["C", "Assembly (ARM Thumb-2)", "Make", "GDB"],
        icon: <Cpu />,
        image: placeholderImg,
        link: "#",
        status: "Maintenance",
        year: "2021"
    },
    {
        id: "covid-ma",
        title: "COVID-MA Analyzer",
        description: "Data analysis tool for tracking COVID-19 trends in Massachusetts. Automated report generation and visualization pipelines.",
        fullDescription: "Built during the height of the pandemic to make state data more accessible. This solution scraped daily PDF reports from the mass.gov website, parsed the unstructured data, and stored it in a timeseries database. A frontend dashboard visualized trends in infection rates and hospitalizations by county.",
        tech: ["Python", "Pandas", "Matplotlib", "Flask", "PostgreSQL"],
        icon: <Database />,
        image: placeholderImg,
        link: "#",
        status: "Completed",
        year: "2020"
    }
];
