FROM node:20

WORKDIR /app

# Copy dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN pnpm install

# Copy WebSocket backend code
COPY . .

# Generate Prisma Client from the shared database package
WORKDIR /app/../packages/database
RUN npx prisma generate

# Expose WebSocket port
EXPOSE 8080

# Start WebSocket server
CMD ["node", "dist/server.js"]