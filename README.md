# Personal Portfolio Website

A modern, interactive portfolio website showcasing software engineering projects and architectural photography. Built with React, featuring custom animations, interactive backgrounds, and a unique circuit-board aesthetic.

🌐 **Live Site:** [nspaine.github.io](https://nspaine.github.io)

> 🤖 **Built with AI:** Developed using Google Antigravity IDE with Gemini 3 Pro and Claude Sonnet 4.5

## ✨ Features

- **Interactive Circuit Background**: Dynamic particle system that follows mouse/touch interactions
- **Project Portfolio**: Expandable project cards with detailed descriptions and tech stacks
- **Architecture Gallery**: Responsive image gallery with lazy loading and optimized thumbnails
- **Custom Loaders**: Route-specific loading animations (binary matrix, square wave, skyline)
- **Mobile-First Design**: Fully responsive with touch-optimized interactions
- **Performance Optimized**: Code splitting, lazy loading, and optimized asset delivery

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
personal-website/
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
- **Gold accent color** (#FFD700) throughout
- **Dark theme** optimized for readability
- **Custom scrollbar** (desktop only)
- **Smooth animations** powered by Framer Motion
- **Interactive elements** that respond to user input

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

## 🤖 Built With AI

This website was developed with assistance from:
- **Google Antigravity** - Agentic AI IDE
- **Gemini 3 Pro** - AI model for code generation and architecture
- **Claude Sonnet 4.5** - AI model for refinement and optimization

---

Built with ❤️ using React and Vite
