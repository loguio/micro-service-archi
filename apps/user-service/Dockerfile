# 1. Base stage
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# 2. Dependencies stage
FROM base AS dependencies
COPY package*.json ./
COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/user-service/package.json ./apps/user-service/
COPY apps/web-portal/package.json ./apps/web-portal/
RUN npm ci

# 3. Development stage (targets dev in docker-compose)
FROM dependencies AS development
COPY . .
EXPOSE 3002
CMD ["npm", "run", "start:dev", "-w", "apps/user-service"]

# 4. Builder stage
FROM dependencies AS builder
COPY . .
RUN npm run build -w apps/user-service
RUN npm prune --omit=dev

# 5. Production stage
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
COPY apps/user-service/package.json ./apps/user-service/
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/user-service/dist ./apps/user-service/dist
EXPOSE 3002
CMD ["node", "apps/user-service/dist/main"]
