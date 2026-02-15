# Docker Build Fix - Summary

## Changes Made

### 1. Dockerfile Updates
- Added `python3`, `make`, and `g++` to Alpine for native module compilation
- Added `NODE_OPTIONS="--max-old-space-size=4096"` to prevent memory issues
- Added `NEXT_DEBUG_BUILD=1` for verbose output during build
- Added build error handling to capture more information on failure

### 2. next.config.js Updates
- Set `images.unoptimized: true` to avoid Sharp/native module issues
- Added `experimental.optimizeCss: false` to prevent CSS optimization issues
- Increased `staticPageGenerationTimeout` to 300 seconds
- Added `trailingSlash: false` and `poweredByHeader: false`

## If Build Still Fails

### Check in Coolify:

1. **Build Logs**: Look for specific error messages in the Coolify build logs
2. **Memory**: Ensure the build container has at least 2GB RAM (4GB recommended)
3. **Environment Variables**: Make sure these are set in Coolify:
   - `NEXT_PUBLIC_CALENDLY_PHONE_CONSULTATION`
   - `NEXT_PUBLIC_CALENDLY_INHOME_MEASUREMENT`  
   - `NEXT_PUBLIC_CALENDLY_VIRTUAL_DESIGN`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`

4. **Network Access**: Ensure the build container can access:
   - `https://images.unsplash.com` (for placeholder images)
   - npm registry for package installation

### Alternative: Use Non-Alpine Node Image

If issues persist, try changing the Dockerfile base image from `node:20-alpine` to `node:20-slim`:

```dockerfile
FROM node:20-slim AS deps
# Remove the apk add lines, use apt-get instead if needed
```

### Debugging Build in Coolify

Add this to the Dockerfile before the build step to debug:

```dockerfile
RUN echo "Node version:" && node --version
RUN echo "NPM version:" && npm --version
RUN echo "Env vars:" && env | grep NEXT_PUBLIC || echo "No NEXT_PUBLIC vars set"
```

### Common Exit Code 255 Causes

1. **Out of Memory**: Increase container memory limit
2. **Native Module Compilation Failed**: Missing build tools (fixed with python3/make/g++)
3. **Network Timeout**: External images failing to download
4. **Type Errors**: Even with ignoreBuildErrors, some errors can still crash the build

## Local Testing

To test the Docker build locally:

```bash
docker build -t sela-cabinets-test .
```

This will help identify if the issue is specific to the Coolify environment.
