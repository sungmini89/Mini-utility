# Web Development Utilities

A collection of useful tools for web developers, built with React, TypeScript, and Tailwind CSS.

## 🎨 Favicon Generator

Create multi-size favicons from images, text, or emojis with custom colors and transparency.

### Features

- **Multiple Input Modes**: Upload images, enter text, or use emojis
- **Custom Sizes**: Generate icons in various sizes (16x16 to 256x256)
- **Color Customization**: Set background colors and transparency
- **Multiple Formats**: PNG format with HTML code generation
- **ZIP Download**: Download all generated icons as a ZIP file
- **Real-time Preview**: See your icons before downloading
- **History**: Save and manage your previous generations
- **Keyboard Shortcuts**: Quick access to common actions

### Keyboard Shortcuts

- `Alt + G`: Generate icons
- `Ctrl/Cmd + Shift + C`: Copy HTML code
- `Ctrl/Cmd + Shift + Z`: Download ZIP file
- `Ctrl/Cmd + Shift + S`: Save to history
- `Ctrl/Cmd + Shift + R`: Reset options

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd favicon-generator
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **PWA**: Vite PWA Plugin
- **Testing**: Jest + Testing Library

## 📱 PWA Features

- Offline support
- App manifest
- Service worker
- Installable as a native app

## 🎯 Features

### Favicon Generator

- **Image Upload**: Drag and drop or click to upload images
- **Text Input**: Create favicons from text with custom fonts
- **Emoji Support**: Use emojis as favicon content
- **Size Selection**: Choose from 16x16, 32x32, 48x48, 64x64, 96x96, 128x128, 256x256
- **Color Customization**:
  - Background color picker
  - Transparency slider
  - Text/emoji color picker
- **Real-time Preview**: See changes instantly
- **Download Options**:
  - Individual PNG files
  - ZIP archive with all sizes
  - HTML code for easy integration
- **History Management**: Save and restore previous generations
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: Toggle between light and dark themes

## 🏗 Project Structure

```
src/
├── components/
│   └── FaviconGenerator/
│       ├── index.tsx          # Main component
│       ├── types.ts           # TypeScript types
│       └── utils.ts           # Utility functions
├── hooks/
│   ├── useClipboard.ts        # Clipboard functionality
│   ├── useDarkMode.ts         # Dark mode management
│   ├── useLocalStorage.ts     # Local storage persistence
│   └── useZipDownload.ts      # ZIP download functionality
├── pages/
│   ├── HomePage.tsx           # Landing page
│   └── FaviconGeneratorPage.tsx # Favicon generator page
├── utils/
│   └── common.ts              # Common utility functions
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

## 🚀 Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with default settings

### Netlify

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [JSZip](https://stuk.github.io/jszip/) - ZIP file generation
