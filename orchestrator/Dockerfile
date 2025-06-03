FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build:orchestrator

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start:orchestrator"]