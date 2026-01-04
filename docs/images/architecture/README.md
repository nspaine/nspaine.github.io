# Architecture Images

This folder contains images for the Architecture gallery page.

## Adding Images

1. Place your architecture photos in this directory
2. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
3. Recommended naming: Use descriptive names (e.g., `brooklyn-bridge.jpg`, `one-world-trade.jpg`)

## Image Guidelines

- **Resolution**: Recommended minimum 1920x1080 for best quality
- **File Size**: Optimize images to keep them under 2MB each for faster loading
- **Aspect Ratio**: Any aspect ratio works, but consistent ratios look better in galleries

- Images are **automatically loaded** from this directory by the Architecture page component using dynamic imports.
- Simply add images to this folder, and (optionally) add a corresponding thumbnail in the `thumbs` subfolder.
- **Gallery Behavior**: Only images with a matching thumbnail in the `thumbs` folder will appear in the main grid (to ensure fast loading).
- **Lightbox Behavior**: All images in this folder are accessible in the lightbox view, even if they don't have a thumbnail (you can swipe to them).
- No manual code updates are required when adding new images.
