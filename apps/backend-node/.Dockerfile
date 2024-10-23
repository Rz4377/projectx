# Use a Node.js base image
FROM node:20

WORKDIR /app

# Copy dependencies files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the backend code
COPY . .

# Generate Prisma Client
WORKDIR /app/../packages/database
RUN npx prisma generate

# Expose backend port
EXPOSE 3000

# Start backend service
CMD ["pnpm", "start"]