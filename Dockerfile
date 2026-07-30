# Simple single-stage build for SELA Cabinets
FROM node:20

WORKDIR /app

# Copy the audited dependency manifest and lockfile first for better caching.
COPY package.json yarn.lock ./

# Install dependencies with memory optimization
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN corepack enable && yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN yarn build

# Next standalone output does not include browser assets automatically.
RUN cp -r /app/.next/static /app/.next/standalone/.next/static && \
    cp -r /app/public /app/.next/standalone/public

# Copy pdfkit font files to the standalone build location
RUN mkdir -p /app/.next/server/chunks/data && \
    cp /app/node_modules/pdfkit/js/data/* /app/.next/server/chunks/data/ 2>/dev/null || true

# Create non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs

# Set permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
