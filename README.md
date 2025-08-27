AI Studio Simulator
A React + TypeScript application that simulates an AI-powered image generation studio with drag-and-drop uploads, style transformations, and generation history.

🚀 Features
Drag & Drop Image Upload - Supports JPG/PNG files up to 10MB

AI Style Generation - Multiple artistic styles (Realistic, Artistic, Fantasy, Minimalist, Vintage)

Live Previews - Real-time image and prompt preview

Generation History - Stores up to 5 most recent generations with thumbnails

Responsive Design - Works on desktop, tablet, and mobile

Accessibility - Full keyboard navigation and screen reader support

Error Handling - Graceful error handling with retry logic

PWA Ready - Installable as a desktop/mobile app

🛠 Tech Stack
Frontend: React 18 + TypeScript

Build Tool: Vite

Styling: Tailwind CSS

Testing: Jest + React Testing Library

Storage: LocalStorage for history persistence

Icons: Heroicons (SVG)

📦 Installation
bash
# Clone the repository
git clone <your-repo-url>
cd ai-studio-simulator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
🎨 Design Notes
Architecture
Component-Based: Modular React components with TypeScript interfaces

Custom Hooks: useGenerationApi for API state management, useHistory for localStorage persistence

Utility Functions: Image processing and validation utilities

Mock API: Simulated backend with realistic delays and error handling

User Experience
Progressive Enhancement: Works without JavaScript for basic functionality

Loading States: Clear feedback during image processing and generation

Error Recovery: Automatic retries with exponential backoff

Undo/Redo: History restoration for previous generations

Accessibility
Keyboard Navigation: Full tab navigation and keyboard shortcuts

Screen Reader Support: ARIA labels and live regions

Focus Management: Clear focus indicators and logical tab order

Color Contrast: WCAG AA compliant color scheme

Performance
Image Optimization: Client-side downscaling before upload

Memoization: Optimized re-renders with React.memo and useCallback

Lazy Loading: Code splitting for larger components

Efficient Storage: Thumbnail generation for history items

🧪 Testing
Unit Tests
bash
# Run all tests
npm test

# Run specific test file
npm test -- --testPathPattern="LoadingSpinner.test.tsx"

# Run tests with coverage
npm run test:coverage
Test Structure
Component Tests: Verify rendering and user interactions

Hook Tests: Test custom hook logic and state management

Utility Tests: Validate image processing and validation functions

Integration Tests: Test component interactions

📱 PWA Features
The app includes basic PWA capabilities:

Web App Manifest for mobile installation

Service Worker for offline caching (optional)

App-like experience on mobile devices

🎯 Future Enhancements
Real AI integration (Stable Diffusion API)

Advanced style parameters (contrast, brightness, saturation)

Batch processing for multiple images

Social sharing capabilities

Cloud synchronization across devices

Advanced history management with search/filter

Plugin system for custom styles

📄 License
MIT License - feel free to use this project for learning and development purposes.

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

🐛 Troubleshooting
Common Issues
Image Upload Fails

Check file type (JPG/PNG only)

Verify file size < 10MB

Tests Fail to Run

Ensure all dependencies are installed

Check TypeScript configuration

Build Errors

Verify Node.js version (18+ recommended)

Check TypeScript compiler options

Browser Support
Chrome/Edge 88+

Firefox 85+

Safari 14+

Mobile browsers (iOS Safari, Chrome Mobile)

Note: This is a simulation app - image "generation" applies visual filters rather than true AI generation. For real AI capabilities, integrate with services like OpenAI DALL-E, Stable Diffusion, or Midjourney API.