# =============================================
# SELA Cabinets - Production Dockerfile
# =============================================
# Multi-stage build for optimized Next.js deployment

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Install ALL dependencies (including dev deps needed for build)
# Use --max-old-space-size to prevent memory issues
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Add verbose output for debugging
ENV NEXT_DEBUG_BUILD=1

# Build the application with error handling
RUN npm run build || (echo "=== BUILD FAILED - Checking for errors ===" && cat /app/.next/build-manifest.json 2>/dev/null || echo "No build manifest found" && exit 1)

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
