```markdown
# Digital Planner Creator

A professional React-based digital planner builder for therapists, featuring drag-and-drop editing, PDF export, and customizable templates.

## Features

- 🎨 Visual canvas editor with drag-and-drop
- 📅 Monthly and daily planner templates
- 🔒 License key authentication
- 📄 Smart PDF export with interactive links
- 🔄 Master PDF merge functionality
- 💾 Render caching for optimal performance
- 📱 Responsive design
- 🎯 Clinical and therapy-specific templates

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sarahdenkert01-hue/digital-planner-creator.git
cd digital-planner-creator
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your license keys to `.env`:
```
VITE_LICENSE_KEYS=YOUR_KEY_1,YOUR_KEY_2,YOUR_KEY_3
```

## Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
digital-planner-creator/
├── public/              # Static assets
│   ├── backgrounds/     # Background images
│   ├── covers/          # Cover templates
│   ├── headers/         # Month/day headers
│   ├── templates/       # Full-page templates
│   └── blocks/          # Reusable block elements
├── src/
│   ├── components/      # React components
│   │   ├── Auth/        # Authentication components
│   │   ├── Canvas/      # Canvas editing components
│   │   ├── Export/      # PDF export components
│   │   └── Sidebar/     # Sidebar UI components
│   ├── constants/       # Configuration and constants
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Root component
│   └── main. jsx         # Application entry
└── package.json         # Dependencies
```

## Usage

### 1. License Activation
Enter your license key from your Etsy purchase to unlock the builder. 

### 2. Page Management
- Add new pages with the "➕ Add" button
- Duplicate existing pages with "👯 Copy"
- Reorder pages using ▲▼ arrows
- Rename pages by clicking the ✏️ icon

### 3. Adding Elements
- Select templates from the sidebar
- Click to add backgrounds, headers, or content blocks
- Drag and resize elements on the canvas
- Lock elements to prevent accidental changes

### 4. Export
- Click "💾 EXPORT PDF BATCH" to create your planner
- Use "Master Merge" to combine multiple PDF batches
- Progress is shown during export with cancel option

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Konva** - Canvas editing
- **jsPDF** - PDF generation
- **pdf-lib** - PDF manipulation

## Troubleshooting

### Images not loading
Ensure all template files are in the `public/` directory with correct names. 

### Export fails
- Check browser console for errors
- Ensure sufficient memory (close other tabs)
- Try exporting smaller batches

### License key rejected
- Check for extra spaces
- Ensure key matches your Etsy order
- Contact support if issues persist

## License

Proprietary - Licensed for use with valid license key only

## Support

For issues or questions, contact support through your Etsy purchase. 
```
