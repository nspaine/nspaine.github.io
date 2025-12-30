import React from 'react';
import { ExternalLink, Database, Cpu, Cloud, Globe, Code, Wifi, Terminal, Layout, Share2, PenTool, Activity, FileJson, Monitor, Zap, Calendar1Icon, CalendarDaysIcon, MoveIcon, MicroscopeIcon, CircleDollarSignIcon, PaletteIcon, WavesLadderIcon, CarIcon, WallpaperIcon, CircleGaugeIcon, WaypointsIcon, TwitterIcon, FlameIcon, CpuIcon, ApertureIcon, AudioWaveformIcon, KeyboardMusicIcon } from 'lucide-react';

import rustImg from '../assets/project_images/rust-network-analyzer.webp';
import profileImg from '../assets/profile-pixel.webp';
import azureImg from '../assets/project_images/azure-ad-migration.webp';
import jiraImg from '../assets/project_images/ms-project-jira.webp';
import periscopeImg from '../assets/project_images/periscope-motion.webp';
import covidImg from '../assets/project_images/covid-analytics.webp';
import loanImg from '../assets/project_images/student-loan-calc.webp';
import photoImg from '../assets/project_images/photo-filter.webp';
import poolImg from '../assets/project_images/pool-monitor.webp';
import iotechImg from '../assets/project_images/iotech-car-hub.webp';
import networkImg from '../assets/project_images/network-graph-theory.webp';
import tweetImg from '../assets/project_images/markov-tweet-gen.webp';
import fireImg from '../assets/project_images/firefighter-tracking.webp';
import fpgaImg from '../assets/project_images/fpga-image-proc.webp';
import thermalImg from '../assets/project_images/thermal-flow-model.webp';
import audioImg from '../assets/project_images/audio-func-gen.webp';
import synthImg from '../assets/project_images/arduino-synth.webp';

export const projects = [
    {
        id: "rust-network-analyzer",
        title: "Matter Network Analyzer & Smart Bridge",
        fullDescription: "Develop Matter over Thread network analyzer and smart bridge using Rust, FreeRTOS, and Embassy (Async RTOS). Utilize STM32H755 for Ethernet, TI CC2652P for 802.15.4 transceiver, Nordic nRF54L and ESP32-C6 for Wi-Fi and BLE.",
        tech: ["Rust", "STM32H755", "FreeRTOS", "Matter", "Thread", "Wi-Fi", "BLE", "Ethernet", "Embassy", "CC2652P", "nRF54L", "ESP32-C6", "802.15.4"],
        icon: <Wifi />,
        image: rustImg,
        link: "",
        status: "In Progress",
        year: "2025"
    },
    {
        id: "personal-website",
        title: "Personal Website",
        fullDescription: "Modern portfolio website built entirely with Google Antigravity Agentic AI IDE using Gemini 3 Pro, Claude Sonnet 4.5, React, Vite, TailwindCSS, Framer Motion, and Canvas API. Features a custom UI/UX, an interactive WebGL circuitry background with particle physics, timeline portfolio, IMMERSIVE architecture gallery, and optimized for performance and mobile/desktop displays.",
        tech: ["Google Antigravity", "Agentic AI", "Gemini 3 Pro", "Claude Sonnet 4.5", "React", "Vite", "TailwindCSS", "Framer Motion", "Canvas API"],
        icon: <WallpaperIcon />,
        image: profileImg,
        link: "",
        status: "In Progress",
        year: "2025"
    },
    {
        id: "azure-ad-migration",
        title: "Crowd Azure Directory Migration",
        fullDescription: "Migrated and validated 10+ directories into a single Azure Active Directory using Atlassian REST API, PostgreSQL, and Claude Sonnet. Used the Python threading library to reduce migration runtime from 30 minutes to 3 minutes. Enabled SSL (HTTPS) for Atlassian applications and secure single-sign on (SAML SSO) with Integrated Windows Authentication (IWA) for passwordless logins.",
        tech: ["Python", "Multi-threading", "PostgreSQL", "Psycopg", "SQLAlchemy", "Atlassian API", "Azure AD", "SSL", "SAML SSO", "Claude Sonnet"],
        icon: <Database />,
        image: azureImg,
        link: "",
        status: "In Progress",
        year: "2025"
    },
    {
        id: "ms-project-jira",
        title: "MS Project to Jira Importer",
        fullDescription: "Generated a deployable Python .exe application with Claude Sonnet 4 and GPT-4, enabling one-way synchronization of Microsoft Project to Atlassian Jira via Windows COM object library and Jira REST API with tkinter GUI and error handling. The app also generated an HTML diff report between MS Project and Jira for comparison. Fully customizable field mapping and robust error detection.",
        tech: ["Python", "tkinter", "MS Project", "Jira API", "COM", "Claude Sonnet 4", "GPT-4", "HTML"],
        icon: <CalendarDaysIcon />,
        image: jiraImg,
        link: "",
        status: "Completed",
        year: "2025"
    },
    {
        id: "periscope-motion",
        title: "Periscope 2-Axis Motion Prototype",
        fullDescription: "Worked with a team at L3Harris to design a first-of-its-kind periscope prototype that could be used to verify gyroscope and accelerometer movement in 2 axes (roll and pitch). With automatic tilt control, built-in rotation, mirror movement, and laser tracking. Advocated for budget and enhancements, developed harness schematics and block diagrams, and demonstrated to customer and engineering leadership.",
        tech: ["IMU", "Schematic Design", "Prototyping", "Visio", "3D Printing", "Motor Control", "Demo"],
        icon: <MoveIcon />,
        image: periscopeImg,
        link: "",
        status: "Completed",
        year: "2024"
    },
    {
        id: "covid-analytics",
        title: "COVID-19 Data Analytics",
        fullDescription: "Used Python HTTP grequests with Beautiful Soup 4 to scrape MA .gov archive of COVID-19 PDF and DOCX reports for data analytics.",
        tech: ["Python", "grequests", "Beautiful Soup", "Web Scraping"],
        icon: <MicroscopeIcon />,
        image: covidImg,
        link: "",
        status: "Completed",
        year: "2020"
    },
    {
        id: "student-loan-calc",
        title: "Student Loan Calculator",
        fullDescription: "Developed a Javascript tool with Google App Script on Google Sheets to model different student loan re-payment plans. The tool provided advice on the best way to pay off student loans such as highest interest, highest principal, and pro-rated approach.",
        tech: ["Javascript", "Google App Script", "Google Sheets", "Financial Modeling"],
        icon: <CircleDollarSignIcon />,
        image: loanImg,
        link: "",
        status: "Completed",
        year: "2019"
    },
    {
        id: "photo-filter",
        title: "Color Transparency Photo Filter",
        fullDescription: "Developed a Python application that allowed a user to upload an image and select a specific color in the image to become transparent. Used image processing techniques such as bilateral filtering and contour smoothing to output a PNG image.",
        tech: ["Python", "OpenCV", "Image Processing"],
        icon: <PaletteIcon />,
        image: photoImg,
        link: "",
        status: "Completed",
        year: "2019"
    },
    {
        id: "pool-monitor",
        title: "Smart Pool & Spa Monitor",
        fullDescription: "Led a team to build a 3D-printed floating WiFi pool monitor that alerted you of temperature and pH level. Won first prize at the HackUMass VI Major League Hacking DragonBoard competition. Developed a multi-threaded Python server hosted on Google Cloud communicating with a DragonBoard 410c client on the Qualcomm Snapdragon 400 SoC with Debian Linux. Read sensor data serially with an Arduino Uno relayed to the DragonBoard client. Send users SMS status messages with Twilio.",
        tech: ["Python", "Debian Linux", "Snapdragon 400", "Arduino UNO", "Google Cloud", "WiFi", "IoT", "Multi-threading", "Twilio SMS", "pH Sensor", "Temperature Sensor", "UART"],
        icon: <WavesLadderIcon />,
        image: poolImg,
        link: "",
        status: "Completed",
        year: "2018"
    },
    {
        id: "iotech-car-hub",
        title: "IoTECH (Internet of Things Extensible Car Hub)",
        fullDescription: "Led a team of four engineering students to design and develop an automotive IoT platform that interfaces via OBD-II, WiFi, Bluetooth (BLE), 3G, Google Cloud. Utilized an STM32 ARM Cortex-M3 Microcontroller. Developed code for suite of sensors including HD/infrared camera, GPS, temperature, motion, gas, alcohol, and smoke. Coordinated project budget and schedule to deliver PDR, MDR, and FDR for the Senior Design Project.",
        tech: ["C++", "OBD-II", "STM32 ARM Cortex-M3", "IoT", "Twilio MMS", "Google Cloud", "WiFi", "BLE", "HD/IR Camera", "3G", "GPS", "Temperature", "IR Motion", "Gas", "Alcohol", "Smoke"],
        icon: <CircleGaugeIcon />,
        image: iotechImg,
        link: "",
        status: "Completed",
        year: "2018"
    },
    {
        id: "network-graph-theory",
        title: "Cell Tower Network & Power Grid Graph Theory",
        fullDescription: "Developed a Python graph search algorithm using NumPy, OpenCV, pandas, Matplotlib, SciPy, and OpenCelliD to compute the length of fiber optic cabling needed to connect an existing power grid to the cell tower network.",
        tech: ["Python", "NumPy", "pandas", "Matplotlib", "SciPy", "OpenCV", "OpenCelliD", "Graph Theory"],
        icon: <WaypointsIcon />,
        image: networkImg,
        link: "",
        status: "Completed",
        year: "2017"
    },
    {
        id: "markov-tweet-gen",
        title: "Machine Learning Tweet Generator",
        fullDescription: "Developed a tweet generator with a team of 4 students at PennApps XVI hackathon during which I learned the Ruby programming language to implement a weighted probability word picker based on the Markov Chain algorithm, in addition to a word counter based on a hashed database of previous and current tweets. Created a front-end website to host the generated tweets and other relevant content. Connected to the Twitter API to upload tweets with a Twitter bot.",
        tech: ["Ruby", "Markov Chain", "Twitter API", "Machine Learning"],
        icon: <TwitterIcon />,
        image: tweetImg,
        link: "",
        status: "Completed",
        year: "2017"
    },
    {
        id: "firefighter-tracking",
        title: "Firefighter Local Positioning System",
        fullDescription: "Wrote an academic paper researching local positioning systems for live 3D tracking of first responders and firefighters. Implementations included radar, sonar, dead reckoning, magnetoquasistatic fields, and GPS/accelerometer networks.",
        tech: ["Research", "GPS", "Magnetoquasistatic Fields", "Dead Reckoning", "Sonar/Radar", "IMU"],
        icon: <FlameIcon />,
        image: fireImg,
        link: "",
        status: "Completed",
        year: "2017"
    },
    {
        id: "fpga-image-proc",
        title: "FPGA Image Processing",
        fullDescription: "Developed C & Verilog program on the Altera DE1-SoC FPGA with Altera QSYS, Quartus Prime, NIOS II for Eclipse, and ModelSim. Interfaced with an HD camera module to perform image compression, decompression, reversal, rotation, color inversion, and edge detection.",
        tech: ["Verilog", "C", "Altera QSYS", "Altera DE1-SoC FPGA", "NIOS II", "Quartus Prime", "ModelSim", "Image Processing", "HD Camera"],
        icon: <ApertureIcon />,
        image: fpgaImg,
        link: "",
        status: "Completed",
        year: "2017"
    },
    {
        id: "thermal-flow-model",
        title: "Quad-Core Thermal Flow Model",
        fullDescription: "Implemented the Runge-Kutta differential equation solver algorithm in C to model heat transfer in a quad-core processor system.",
        tech: ["C", "Runge-Kutta", "Simulation", "Differential Equations"],
        icon: <CpuIcon />,
        image: thermalImg,
        link: "",
        status: "Completed",
        year: "2016"
    },
    {
        id: "audio-func-gen",
        title: "Analog Audio Function Generator",
        fullDescription: "Built a power supply circuit and audio amplifier to create a function generator (sine, triangle, square) with low-pass and high-pass filtration. Performed signal analysis using circuits lab equipment (oscilloscope) and OrCAD PSpice for simulation and optimization.",
        tech: ["PSpice", "Analog Circuits", "Signal Processing", "Oscilloscope"],
        icon: <AudioWaveformIcon />,
        image: audioImg,
        link: "",
        status: "Completed",
        year: "2016"
    },
    {
        id: "arduino-synth",
        title: "Arduino Synthesizer",
        fullDescription: "Built a 555-timer chip circuit with several variable and photosensitive resistors to control input audio sample decay, pitch, and frequency. Later updated design to an Arduino UNO sketch to add more functionality and flexibility to the circuit.",
        tech: ["C++", "Arduino UNO", "555-Timer", "Photosensitive Resistors", "Audio Synthesis", "Analog Electronics"],
        icon: <KeyboardMusicIcon />,
        image: synthImg,
        link: "",
        status: "Completed",
        year: "2015"
    }
];
