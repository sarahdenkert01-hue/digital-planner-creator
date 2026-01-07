# Deployment Guide - Digital Planner Creator

This guide provides step-by-step instructions for deploying the Digital Planner Creator to Netlify.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Deploy](#quick-deploy)
- [Manual Deployment](#manual-deployment)
- [Environment Variables](#environment-variables)
- [Custom Domain Setup](#custom-domain-setup)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:
- A GitHub account
- A Netlify account (free tier available at [netlify.com](https://netlify.com))
- Your license keys ready for configuration
- All template assets uploaded to the `public/` directory

## Quick Deploy

The fastest way to deploy is using the Deploy to Netlify button:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sarahdenkert01-hue/digital-planner-creator)

This will:
1. Clone the repository to your GitHub account
2. Create a new site on Netlify
3. Configure build settings automatically
4. Start the first deployment

**Important:** You must add environment variables after deployment (see [Environment Variables](#environment-variables) section).

## Manual Deployment

### Step 1: Push Code to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/digital-planner-creator.git
git push -u origin main
```

### Step 2: Connect to Netlify

1. Log in to [Netlify](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select the `digital-planner-creator` repository

### Step 3: Configure Build Settings

Netlify will auto-detect the settings from `netlify.toml`, but verify:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

These are already configured in `netlify.toml`, so you can use the defaults.

### Step 4: Deploy

Click **"Deploy site"** to start your first deployment.

The build process will:
1. Install dependencies (`npm install`)
2. Build the production bundle (`npm run build`)
3. Deploy the `dist` folder to Netlify's CDN

Initial deployment typically takes 2-3 minutes.

### Step 5: Configure Environment Variables

**Critical:** The app requires license keys to function.

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add the following:
   - **Key**: `VITE_LICENSE_KEYS`
   - **Value**: Your comma-separated license keys (e.g., `KEY1,KEY2,KEY3`)
4. Click **"Save"**

### Step 6: Redeploy

After adding environment variables:
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for the new build to complete

Your app is now live with license key authentication enabled!

## Environment Variables

### Required Variables

#### `VITE_LICENSE_KEYS`
- **Description**: Comma-separated list of valid license keys
- **Example**: `PLANNER_2024_ABC,PLANNER_2024_DEF,PLANNER_2024_XYZ`
- **Format**: Case-insensitive, spaces are trimmed automatically
- **Security**: Never commit keys to your repository
- **Location**: Netlify dashboard → Site settings → Environment variables

### Adding/Updating Variables

To modify license keys:
1. Navigate to Site settings → Environment variables
2. Click on `VITE_LICENSE_KEYS`
3. Update the value
4. Save and trigger a new deployment

**Note:** Environment variables are only applied during build time for Vite apps. You must redeploy after changing them.

## Custom Domain Setup

### Using Netlify Subdomain (Free)

Your site automatically gets a URL like: `https://random-name-123.netlify.app`

To customize it:
1. Go to **Site settings** → **Domain management**
2. Click **"Options"** → **"Edit site name"**
3. Enter your preferred name (e.g., `my-planner-creator`)
4. Your site will now be at `https://my-planner-creator.netlify.app`

### Using Custom Domain

To use your own domain (e.g., `planner.yourdomain.com`):

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow the DNS configuration instructions provided by Netlify

**Common DNS Configurations:**

For subdomain (e.g., `planner.yourdomain.com`):
- Add a CNAME record pointing to your Netlify site

For apex domain (e.g., `yourdomain.com`):
- Add A records pointing to Netlify's load balancer IPs
- Or use Netlify DNS for easier management

Netlify provides free SSL certificates via Let's Encrypt.

## Asset Management

### Uploading Assets

Template assets should be placed in the `public/` directory before deployment:

```
public/
├── backgrounds/
├── covers/
├── templates/
└── blocks/
```

### Adding Assets After Deployment

1. Add new files to the `public/` directory in your repository
2. Commit and push to GitHub:
   ```bash
   git add public/
   git commit -m "Add new template assets"
   git push
   ```
3. Netlify will automatically detect the change and redeploy

### Asset Optimization

For best performance:
- Compress images before uploading (use tools like TinyPNG, ImageOptim)
- Use appropriate formats (SVG for graphics, JPG for photos)
- Target file sizes under 1MB for backgrounds
- Use WebP format when possible (with fallbacks)

## Continuous Deployment

Netlify automatically deploys when you push to your repository:

1. Make changes locally
2. Commit and push to GitHub
3. Netlify detects the change
4. Automatic build and deployment begins
5. Live site updates within 2-3 minutes

### Deploy Previews

Every pull request gets a unique preview URL:
- Great for testing changes before merging
- Share preview links with team members
- Preview URLs are automatically deleted when PR is closed

## Build Optimization

The build is optimized for performance:

### Code Splitting
- React, Konva, and PDF libraries are split into separate chunks
- Faster initial page loads
- Better caching

### Asset Caching
- Static assets cached for 1 year (configured in `netlify.toml`)
- Automatic cache busting with hashed filenames

### Security Headers
- XSS protection
- Content type sniffing prevention
- Frame denial
- Strict referrer policy

All configured in `netlify.toml`.

## Monitoring and Analytics

### Build Logs

To view build logs:
1. Go to **Deploys** tab
2. Click on any deployment
3. View detailed logs

Common issues:
- Missing dependencies (check `package.json`)
- Build script errors (check `vite.config.js`)
- Environment variable issues (ensure variables are set)

### Site Analytics

Enable Netlify Analytics (paid feature):
1. Go to **Analytics** tab
2. Enable Analytics
3. View traffic, performance, and bandwidth data

## Rollback

To rollback to a previous deployment:
1. Go to **Deploys** tab
2. Find the working deployment
3. Click **"Publish deploy"**
4. Confirm rollback

This instantly switches traffic to the previous version.

## Troubleshooting

### Build Fails with "Command not found"

**Solution**: Ensure Node version is set correctly in `netlify.toml`:
```toml
[build.environment]
  NODE_VERSION = "18"
```

### License Key Not Working

**Checklist**:
- [ ] Environment variable `VITE_LICENSE_KEYS` is set
- [ ] Keys are comma-separated without quotes
- [ ] Site was redeployed after adding variables
- [ ] No extra spaces or special characters in keys

### Images Not Loading

**Possible causes**:
- Files not in `public/` directory
- Incorrect file names in `libraryitems.js`
- File extension case mismatch (use lowercase)

**Solution**: Verify file paths and redeploy.

### PDF Export Fails

**Common issues**:
- Browser memory limits (try smaller batches)
- Missing canvas elements (check console errors)
- CORS issues with images (ensure `crossOrigin="anonymous"`)

### Slow Build Times

**Optimization tips**:
- Clear cache: Settings → Build & deploy → Clear cache and retry deploy
- Reduce asset sizes in `public/`
- Check for large dependencies in `package.json`

### 404 on Page Refresh

If you get 404 errors when refreshing on routes:
- ✓ Already configured in `netlify.toml` with redirect rules
- All routes redirect to `index.html` for client-side routing

## Security Best Practices

### License Keys
- Never commit keys to repository
- Use Netlify environment variables exclusively
- Rotate keys periodically
- Limit key distribution

### Dependencies
- Regularly update dependencies
- Monitor for security vulnerabilities
- Use `npm audit` to check for issues

### Access Control
- Use Netlify Teams for multiple collaborators
- Set up branch deploy controls
- Enable deploy notifications

## Performance Tips

1. **Monitor Bundle Size**: Check build logs for bundle analysis
2. **Lazy Load Routes**: Implement code splitting for routes
3. **Optimize Images**: Use appropriate formats and compression
4. **CDN Caching**: Assets are automatically cached at edge locations
5. **Enable Gzip**: Already configured in Netlify

## Support

For deployment issues:
- Check [Netlify Documentation](https://docs.netlify.com)
- Visit [Netlify Support](https://www.netlify.com/support/)
- Check build logs for specific errors

For application issues:
- Review browser console for errors
- Check GitHub Issues
- Contact support through Etsy purchase

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Production Build](https://reactjs.org/docs/optimizing-performance.html)
- [Konva Performance Tips](https://konvajs.org/docs/performance/All_Performance_Tips.html)

---

## Quick Reference

### Essential Commands

```bash
# Local development
npm install
npm run dev

# Production build
npm run build
npm run preview

# Linting
npm run lint
```

### Essential URLs

After deployment, bookmark these:
- Site URL: `https://your-site.netlify.app`
- Admin: `https://app.netlify.com/sites/your-site`
- Build logs: `https://app.netlify.com/sites/your-site/deploys`
- Settings: `https://app.netlify.com/sites/your-site/settings`

---

**Last Updated**: January 2026
**Version**: 1.0.0
