#!/bin/bash

# Start Redis if not already running
if ! docker ps | grep -q "codex-mcp-hub-redis"; then
  echo "Starting Redis..."
  docker-compose -f docker-compose.dev.yml up -d
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start development server
echo "Starting development server..."
npm run dev