# Static Export Guide

This document explains how to work with the static export configuration of JobsDoor360.

## Overview

JobsDoor360 is configured to generate a fully static website that can be deployed to any static hosting provider without requiring a Node.js server. This makes deployment simpler and more cost-effective.

## Configuration

The static export is configured in `next.config.ts` with:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  // Other configuration options...
};
```

Key configuration settings:

- `output: 'export'`: Generates static HTML/CSS/JS files
- `trailingSlash: true`: Ensures URLs end with `/` for better compatibility with static hosts
- `images.unoptimized: true`: Required for static image exports
- Experimental flags properly configured for Next.js 15.x compatibility

## Working With The Static Export

### Building

```bash
npm run export
```

This command will:
1. Run the Next.js build process
2. Generate all static files in the `out` directory

### Previewing Locally

```bash
npm run serve:static
```

This starts a local web server to preview the static site.

### API Limitations

Static exports don't support:
- API routes (`/api/*`)
- Server components that use server-only features
- Server-side rendering

All backend functionality must be handled client-side using Firebase, or through external serverless functions/services.

### Firebase Usage

For the static export:
- Firebase authentication and Firestore are used client-side only
- All server-side Firebase code has been removed
- Firebase security rules (in `firestore.rules`) control access to data
- For development, Firebase emulators can be used with `firebase emulators:start`

### Deployment

The `out` directory can be deployed to:

1. **Firebase Hosting**:
   ```bash
   firebase deploy --only hosting
   ```

2. **GitHub Pages**:
   - Copy contents of `out` to the GitHub Pages branch

3. **Netlify/Vercel**:
   - Point to the `out` directory in your deployment settings

4. **AWS S3 + CloudFront**:
   - Upload contents of `out` to an S3 bucket configured for static website hosting

## Troubleshooting

- If images don't appear, check that `unoptimized: true` is set in the Next.js config
- If pages show a 404, ensure `trailingSlash: true` is configured correctly
- For client-side Firebase errors, verify that initialization occurs only in client components
