# Use a Node.js base image
FROM node:20

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy package files from the build context's root folder to the container
COPY ../../package.json ../../pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the WebSocket backend code into the container
COPY . .

# Set the correct path to generate Prisma client
WORKDIR /app/packages/database

# Generate Prisma Client
RUN pnpx prisma generate

# Return to the app root directory
WORKDIR /app

# Expose WebSocket backend port
EXPOSE 8080

# Start the WebSocket server
CMD ["node", "dist/server.js"]