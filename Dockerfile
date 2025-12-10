# Multi-stage build for optimized production image

# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Setup production environment
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only (pg doesn't need native build tools)
RUN npm ci --omit=dev

# Copy backend server files
COPY server.js .
COPY database.js .
COPY index.html .
COPY vite.config.js .

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose the port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "server.js"]
