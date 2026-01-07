# Digital Planner Creator - Public Assets

This directory contains all static assets for the digital planner creator application.

## Asset Structure

The assets are organized by type and function:

### Backgrounds
- Background images for planner pages
- File pattern: `*background*.{png,jpg}`
- Examples: `backgroundwithtabs.png`, `bluebackground.jpg`, `mermaid.png`

### Covers
- Cover page designs matching background themes
- File pattern: `*cover*.{svg,jpg}`
- Examples: `standardcover.svg`, `glittercover.svg`

### Headers
- Month and day headers for calendar pages
- File pattern: `{month}header.svg`
- Examples: `janheader.svg`, `febheader.svg`

### Calendar Layouts
- Monthly calendar grids with different start days
- File patterns:
  - Monday start: `{month}mondaystart.svg`
  - Sunday start: `{month}sundaystart.svg`
- Examples: `janmondaystart.svg`, `jansundaystart.svg`

### Templates
Full-page and block templates for various use cases:

#### Clinical Templates
- Session notes, billing trackers, CEU trackers, etc.
- File pattern: `*temp.svg`
- Examples: `sessionnotetemp.svg`, `billingtemp.svg`

#### Note Templates
- Various note-taking formats
- Examples: `notetemp.svg`, `cornelltemp.svg`, `bulletnotetemp.svg`

#### Block Templates
Different sizes for modular content:
- **Half-page**: Self-care trackers, week planners
  - Examples: `monselfcare.svg`, `sunselfcare.svg`
- **Quarter-page**: Grids, lists, notes
  - Examples: `quarterdots.svg`, `quartergrid.svg`
- **Eighth-page**: Mini months, habit trackers, to-do lists
  - Examples: `hometodo.svg`, `smallhabittracker.svg`

## Adding New Assets

When adding new template assets:

1. **File Naming**: Use descriptive, lowercase names with no spaces
   - Good: `sessionnotetemp.svg`, `bluebackground.jpg`
   - Bad: `Session Note Template.svg`, `Blue Background.JPG`

2. **File Formats**:
   - Backgrounds: PNG or JPG (1620x2160px recommended)
   - Templates: SVG preferred for scalability
   - Covers: SVG or high-res JPG

3. **Register in Code**: Add new items to `src/constants/libraryitems.js`
   ```javascript
   { id: 'yourfile.svg', label: 'Display Name' }
   ```

4. **Optimization**:
   - Compress images before uploading
   - Use appropriate file formats (SVG for graphics, JPG for photos)
   - Target reasonable file sizes (< 1MB for backgrounds)

## Asset Requirements

- Canvas dimensions: 1620px × 2160px (portrait orientation)
- Color mode: RGB
- Resolution: 72-150 DPI for screen use
- Ensure assets have appropriate transparency where needed (PNG/SVG)

## Deployment Notes

When deploying to Netlify:
1. All files in this directory are automatically deployed
2. Assets are served from the root `/` path
3. File references in code should use `/${filename}` format
4. Large assets are cached according to `netlify.toml` configuration
