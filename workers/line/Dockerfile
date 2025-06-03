FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY workers/line ./workers/line

# Build TypeScript
RUN npm run build:line-worker

# Start the worker
CMD ["npm", "run", "start:line-worker"]