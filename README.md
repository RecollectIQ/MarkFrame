<p align="center">
  <img src="./images/rounded-banner.png" alt="MarkFrame logo" width="600" />
</p>

<h1 align="center">MarkFrame</h1>

<p align="center">
  A beautiful website that generates stunning images from your markdown.<br />
  Transform your markdown into shareable, visually appealing images <br >with customizable
  backgrounds, typography, and glass morphism effects.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MarkFrame-v0.1.5-blue" />
  <img src="https://img.shields.io/badge/React-19.2.0-61dafb" />
  <img src="https://img.shields.io/badge/Tailwind-3.4.15-38bdf8" />
</p>

---

## Features

- **Glass Morphism Design** - Beautiful frosted glass effect with customizable blur and opacity
- **Markdown Support** - Full markdown rendering with syntax highlighting
- **Math Rendering** - LaTeX math equations support via KaTeX
- **Code Highlighting** - Syntax highlighting for code blocks
- **Customizable Backgrounds** - Choose from preset gradients, create custom gradients, or upload your own images
- **Typography Options** - Multiple font families (Modern, Elegant, Code)
- **Color Customization** - Extensive text color presets and custom color picker
- **Export to PNG** - Export your beautiful markdown frames as high-quality images
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RecollectIQ/MarkFrame.git
cd MarkFrame
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Usage

1. **Edit Tab**: Enter your markdown content in the input area
2. **Style Tab**: Customize the appearance:
   - Choose background (gradients or upload image)
   - Select font family
   - Pick text color
   - Adjust glass properties (blur, opacity, padding, roundness)
3. **Preview**: See your markdown rendered in real-time with glass morphism effects
4. **Export**: Click the download button to generate and download your markdown as a beautiful PNG image

### Markdown Features

- **Bold text**: `**bold**`
- **Code blocks**: Triple backticks with language
- **Math equations**: 
  - Inline: `$E = mc^2$`
  - Block: `$$E = mc^2$$`

## Built With

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Marked](https://marked.js.org/) - Markdown parser
- [KaTeX](https://katex.org/) - Math rendering
- [Highlight.js](https://highlightjs.org/) - Code syntax highlighting
- [dom-to-image](https://github.com/tsayen/dom-to-image) - PNG export
- [Lucide React](https://lucide.dev/) - Icons

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Customization

### Background Options

- **Preset Gradients**: Choose from 8 beautiful preset gradients
- **Custom Gradient**: Create your own gradient with color pickers and direction controls
- **Image Upload**: Upload your own background image with brightness control

### Glass Properties

- **Blur**: Control the backdrop blur effect (0-60px)
- **Opacity**: Adjust card transparency (0-100%)
- **Padding**: Set internal spacing (16-128px)
- **Roundness**: Control border radius (0-48px)

### Typography

- **Fonts**: Inter (Modern), Playfair Display (Elegant), JetBrains Mono (Code)
- **Colors**: 9 preset colors plus custom color picker

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by glass morphism design trends
- Built with Create React App

---

Made by [RecollectIQ](https://github.com/RecollectIQ)
