FROM node:20

RUN npm install -g pnpm

WORKDIR /app

COPY ../../package.json ../../pnpm-lock.yaml ./

RUN pnpm install --filter backend-node...

COPY . .

RUN pnpm build

WORKDIR /app/packages/database
RUN pnpx prisma generate

WORKDIR /app

EXPOSE 3000

CMD ["node", "dist/index.js"]