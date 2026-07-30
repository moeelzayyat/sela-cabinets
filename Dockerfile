# Simple single-stage build for SELA Cabinets
FROM node:22

WORKDIR /app

# Copy the audited dependency manifest and lockfile first for better caching.
COPY package.json yarn.lock ./

# Install dependencies with memory optimization
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN corepack enable && yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build the application. Next evaluates server modules during page collection, so
# provide non-secret placeholders only for this build process. Coolify injects the
# real values at runtime; none of these are Docker build arguments.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN ADMIN_SECRET="build-only-admin-secret-not-for-runtime-000000" \
    USER_AUTH_SECRET="build-only-user-secret-not-for-runtime-111111" \
    DATABASE_URL="postgresql://build:build@db.build.invalid/build?sslmode=verify-full" \
    DATABASE_CA_CERT="-----BEGIN CERTIFICATE-----\nMIIBsynthetic-only-for-build-contract\n-----END CERTIFICATE-----" \
    yarn build

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
