# Personal Portfolio Website

A modern, interactive portfolio website showcasing software engineering projects and architectural photography. Built with React, featuring custom animations, interactive backgrounds, and a unique circuit-board aesthetic.

---

## 🤖 **100% Built with Agentic AI**
This entire project was conceived, architected, and coded by **Agentic AI** using **Google Antigravity**, an advanced AI-driven IDE. Every line of code, styling decision, and feature implementation was executed through a collaborative session with:

🚀 **Core Engine:** [**Gemini 3 Pro**](https://deepmind.google/technologies/gemini/) (Code Generation, Architecture, & UI/UX Polishing)  
✨ **Refinement:** [**Claude Opus 4.5**](https://www.anthropic.com/claude) (Logic & Performance Optimization)  

---

## ✨ Features

- **Interactive Circuit Background**: Dynamic particle system that follows mouse/touch interactions
- **Project Portfolio**: Expandable project cards with detailed descriptions, tech stacks, and integrated GitHub icons
- **Architecture Gallery**: Optimized responsive image gallery with lazy loading, custom lightbox, and smooth transitions
- **Custom Loaders**: Route-specific loading animations synchronizing initial HTML load with React hydration
  - **Binary Grid**: Matrix-style animation for the Home page
  - **Oscilloscope**: Gold wireframe signal wave for the Portfolio page
  - **Building Architecture**: Dynamic 3D wireframe construction for the Architecture page
- **Mobile-First Design**: Fully responsive layout using stable `dvh`/`dvw` units to prevent layout jumps on iOS/Android
- **Performance Optimized**: Code splitting with React Suspense, asset preloading, and SEO-friendly meta-tags

## 🛠️ Tech Stack

- **Framework**: React 19 with React Router
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS with custom CSS animations
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/nspaine/nspaine.github.io.git
cd nspaine.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `docs/` folder.

## 📁 Project Structure

```
nspaine.github.io/
├── src/
│   ├── components/
│   │   ├── Background/       # Interactive circuit background
│   │   ├── Layout/           # Layout components and loaders
│   │   ├── Loaders/          # Route-specific loading animations
│   │   └── Portfolio/        # Project card components
│   ├── pages/                # Route pages (Home, Portfolio, Architecture)
│   ├── hooks/                # Custom React hooks
│   ├── data/                 # Project data
│   └── assets/               # Images and static assets
├── public/                   # Public assets
└── docs/                     # Production build output
```

## 🎨 Design Philosophy

The site features a unique circuit-board aesthetic with:
- **Gold accent color** (#FFD700) throughout for a premium wireframe look
- **Monochromatic design** for loaders and UI elements to maintain a unified theme
- **Custom scrollbar** with gold accents and hover effects (desktop only)
- **Glassmorphism** panels with subtle borders and shadows for depth
- **Performance-driven transitions** using CSS animations and React's `useLayoutEffect`
- **Stable Viewport units** (`dvh`) for a reliable experience on mobile browsers

## 📱 Responsive Design

- **Desktop**: Full interactive experience with hover effects and custom scrollbar
- **Tablet**: Optimized layout with touch interactions
- **Mobile**: Streamlined UI with hidden scrollbar and tap-based interactions

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- ESLint configured with React best practices
- React Hooks linting enabled
- Strict mode enabled for development

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Nigel Paine**
- Website: [nspaine.github.io](https://nspaine.github.io)
- LinkedIn: [linkedin.com/in/nigel-paine](https://www.linkedin.com/in/nigel-paine/)

## 🤖 Built Entirely With Agentic AI

This website represents a milestone in **Agentic AI coding**, developed using:
- **Google Antigravity** - The Agentic AI IDE driving the development process.
- **Gemini 3 Pro** - The primary model used for full-stack architecture, complex logic, and React implementation.
- **Claude Opus 4.5** - Utilized for advanced UI/UX refinements, micro-animations, and visual polish.

By leveraging these state-of-the-art models, the project demonstrates the future of software engineering where AI agents handle the end-to-end development lifecycle.

---

Built with ❤️ using React and Vite
