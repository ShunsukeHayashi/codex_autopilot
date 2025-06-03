FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY orchestrator ./orchestrator

# Build TypeScript
RUN npm run build:orchestrator

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start:orchestrator"]