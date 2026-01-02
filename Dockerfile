# Use Node.js LTS Alpine for smaller image size
FROM node:20-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Set working directory
WORKDIR /app

# Create data directory for persistent storage
RUN mkdir -p /app/data

# Copy package files first for better caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application files
COPY . .

# Copy data.json to the data directory as well (backup)
RUN cp data.json /app/data/data.json 2>/dev/null || true

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]
