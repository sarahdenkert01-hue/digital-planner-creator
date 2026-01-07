```markdown
# Digital Planner Creator

A professional React-based digital planner builder for therapists, featuring drag-and-drop editing, interactive PDF export with clickable links, and customizable templates.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sarahdenkert01-hue/digital-planner-creator)

## Features

- 🎨 **Visual Canvas Editor** - Drag-and-drop interface powered by React Konva
- 📅 **Monthly & Daily Templates** - Pre-built layouts for therapy planning
- 🔗 **Interactive PDFs** - Clickable month tabs and calendar dates
- 🔒 **License Key Authentication** - Secure access control
- 💾 **Smart PDF Export** - Optimized rendering with caching
- 🔄 **Master PDF Merge** - Combine multiple PDF batches
- 📱 **Responsive Design** - Works on desktop and tablet
- 🎯 **Clinical Templates** - Session notes, billing, CEU tracking, and more
- ⚡ **Performance Optimized** - Code splitting and lazy loading

## Live Demo

[View Demo](https://digital-planner-creator.netlify.app) (requires license key)

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/sarahdenkert01-hue/digital-planner-creator.git
cd digital-planner-creator
npm install
```

### 2. Configure Environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and add your license keys:

```env
VITE_LICENSE_KEYS=YOUR_KEY_1,YOUR_KEY_2,YOUR_KEY_3
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

### Deploy to Netlify (Recommended)

Click the button below for instant deployment:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sarahdenkert01-hue/digital-planner-creator)

Or follow the [comprehensive deployment guide](./DEPLOYMENT.md).

**Important:** After deployment, add your license keys as environment variables in Netlify dashboard:
1. Go to Site settings → Environment variables
2. Add `VITE_LICENSE_KEYS` with your comma-separated keys
3. Redeploy the site

### Manual Build

```bash
npm run build      # Creates production build in dist/
npm run preview    # Preview production build locally
```

## Project Structure

```
digital-planner-creator/
├── public/                    # Static assets
│   ├── backgrounds/           # Background images
│   ├── covers/                # Cover templates
│   ├── headers/               # Month/day headers
│   └── templates/             # Full-page and block templates
├── src/
│   ├── components/            # React components
│   │   ├── Auth/              # License authentication
│   │   ├── Canvas/            # Canvas editing components
│   │   ├── Export/            # PDF export components
│   │   └── Sidebar/           # UI sidebar components
│   ├── constants/             # Configuration and library items
│   │   ├── canvasConfig.js    # Canvas dimensions and configs
│   │   ├── libraryitems.js    # Template library definitions
│   │   ├── months.js          # Month names and offsets
│   │   ├── styles.js          # Reusable style objects
│   │   └── index.js           # Central export
│   ├── hooks/                 # Custom React hooks
│   │   ├── usePDFExport.js    # PDF export logic
│   │   ├── usePageManagement.js # Page state management
│   │   └── useImageBlock.js   # Image block management
│   ├── utils/                 # Utility functions
│   │   ├── blockHelpers.js    # Block creation/manipulation
│   │   ├── pageHelpers.js     # Page management
│   │   ├── pdfHelpers.js      # PDF export with links
│   │   ├── renderCache.js     # Render caching
│   │   └── debounce.js        # Performance utilities
│   ├── App.jsx                # Root component
│   ├── main.jsx               # Application entry
│   └── index.css              # Global styles
├── index.html                 # HTML entry point
├── vite.config.js             # Vite configuration
├── netlify.toml               # Netlify deployment config
├── package.json               # Dependencies and scripts
├── DEPLOYMENT.md              # Deployment guide
└── README.md                  # This file
```

## Usage Guide

### 1. License Activation
Enter your license key from your Etsy purchase to unlock the builder.

### 2. Page Management
- **Add Pages**: Click "➕ Add" to create a new blank page
- **Duplicate**: Click "👯 Copy" to duplicate current page with all elements
- **Reorder**: Use ▲▼ arrows to move pages up/down
- **Rename**: Click ✏️ icon to rename a page
- **Delete**: Clear page contents or remove pages

### 3. Adding Elements

#### Backgrounds
- Select from 13 themed backgrounds
- Apply to current page or all pages at once

#### Templates
- **Covers**: 13 matching cover designs
- **Headers**: Month and day headers
- **Clinical**: Session notes, billing, CEU tracking, insurance, thought logs
- **Notes**: Bullet, Cornell, lined, and dot grid formats
- **Blocks**: Half-page, quarter-page, and eighth-page modular elements

#### Drag and Drop
- Click any template to add it to the canvas
- Drag elements to reposition
- Drag corners to resize
- Lock elements to prevent accidental changes

### 4. Monthly & Daily Pages

#### Creating Month Pages
1. Click "Month Grid (Mon/Sun Start)"
2. Select the month header
3. Add clinical or note templates as needed

#### Creating Daily Pages
- Daily pages automatically link from calendar grids
- Organize by month sections
- Use headers to label each day

### 5. Export Options

#### Single PDF Export
1. Click "💾 EXPORT PDF BATCH"
2. Wait for progress bar to complete
3. PDF downloads automatically with clickable links

#### Master Merge
1. Export multiple PDF batches separately
2. Click "📦 Master Merge"
3. Select all PDF files
4. Merged PDF downloads with all interactive links preserved

#### Interactive PDF Features
- **Month Tabs**: Click tabs on pages to jump to specific months
- **Calendar Dates**: Click dates in month view to jump to daily pages
- **Week Start Options**: Toggle Sunday/Monday start for calendars

## Scripts

```bash
npm run dev       # Start development server (localhost:5173)
npm run build     # Create production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint on source files
```

## Technologies

- **React 18** - Modern UI framework with hooks
- **Vite 6** - Lightning-fast build tool and dev server
- **React Konva** - Canvas manipulation and drag-and-drop
- **Konva 9** - High-performance 2D canvas library
- **jsPDF 4** - Client-side PDF generation (latest secure version)
- **pdf-lib** - PDF manipulation and merging
- **use-image** - React hook for image loading

## Configuration

### Canvas Settings
Edit `src/constants/canvasConfig.js`:
- Canvas dimensions: 1620x2160 (standard planner size)
- View scale: 0.35 (optimal for editing)
- Grid settings for alignment

### Template Library
Edit `src/constants/libraryitems.js`:
- Add new templates
- Organize by category
- Link to files in `public/` directory

### PDF Export
Edit `src/constants/canvasConfig.js`:
- Month tab positions
- Calendar grid layout
- Link configurations

## Performance Features

### Render Caching
- Automatically caches rendered pages
- Validates against block changes
- Improves export speed by 3-5x

### Code Splitting
- Vendor chunks for React, Konva, and PDF libraries
- Smaller initial bundle size
- Faster page loads

### Optimized Export
- Generator-based rendering for memory efficiency
- Progress tracking with cancel option
- Smart caching prevents redundant renders

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Note**: PDF export works best in Chrome/Edge due to better canvas performance.

## Troubleshooting

### Images Not Loading
- Ensure files are in `public/` directory
- Check file names match exactly (case-sensitive)
- Verify file paths in `libraryitems.js`

### Export Fails
- Close unnecessary browser tabs (reduce memory usage)
- Try smaller page batches
- Check browser console for errors
- Ensure canvas renders properly before export

### License Key Rejected
- Remove extra spaces from key
- Verify key matches your Etsy purchase
- Check environment variable is set (in .env or Netlify)
- Contact support if issues persist

### Slow Performance
- Reduce number of unlocked blocks
- Lock elements you're not editing
- Clear render cache periodically
- Close other applications

### Canvas Elements Not Dragging
- Ensure element is unlocked
- Click directly on the image (not transparent areas)
- Check browser console for errors
- Refresh the page and try again

## Development Tips

### Adding New Templates
1. Add image file to `public/`
2. Register in `src/constants/libraryitems.js`:
   ```javascript
   { id: 'mytemplate.svg', label: 'My Template' }
   ```
3. Rebuild and test

### Custom Styling
- Modify `src/index.css` for global styles
- Edit `src/constants/styles.js` for component styles
- Use inline styles for dynamic styling

### Debugging
- Enable React DevTools
- Check browser console for warnings
- Use Konva Inspector for canvas debugging
- Monitor network tab for asset loading

## Security

### License Keys
- Never commit license keys to repository
- Use environment variables only
- Rotate keys periodically
- Limit key distribution

### Dependencies
- Regularly run `npm audit`
- Update dependencies monthly
- Review security advisories

## Contributing

This is a proprietary application. For feature requests or bug reports:
1. Contact through Etsy purchase
2. Provide detailed reproduction steps
3. Include browser and version info

## License

**Proprietary License** - Licensed for use with valid license key only.

Unauthorized distribution, modification, or use without a valid license key is prohibited.

## Support

For support:
- **Deployment Issues**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Template Questions**: Check [public/README.md](./public/README.md)
- **License Issues**: Contact through Etsy purchase
- **Bug Reports**: Provide browser info and console errors

## Changelog

### Version 1.0.0 (January 2026)
- Initial release
- React + Vite setup
- Netlify deployment optimization
- Interactive PDF export with clickable links
- Complete template library
- License key authentication
- Master PDF merge functionality
- Render caching for performance

---

**Built with ❤️ for therapists**

For more information, see [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions. 
```
