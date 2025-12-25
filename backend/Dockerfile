# ===================================
# BUILD STAGE
# ===================================
FROM node:20.15-alpine3.19 AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache --virtual .build-deps \
    python3 make g++ && \
    apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY . .

# ===================================
# RUNTIME STAGE
# ===================================
FROM node:20.15-alpine3.19

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run application with dumb-init
ENTRYPOINT ["/sbin/dumb-init", "--"]
CMD ["node", "src/server.js"]
