FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY workers/discord ./workers/discord

# Build TypeScript
RUN npm run build:discord-worker

# Start the worker
CMD ["npm", "run", "start:discord-worker"]