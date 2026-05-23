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
EXPOSE 3001
CMD ["npm", "run", "start:dev", "-w", "apps/auth-service"]

# 4. Builder stage
FROM dependencies AS builder
COPY . .
RUN npm run build -w apps/auth-service
RUN npm prune --omit=dev

# 5. Production stage
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
COPY apps/auth-service/package.json ./apps/auth-service/
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/auth-service/dist ./apps/auth-service/dist
EXPOSE 3001
CMD ["node", "apps/auth-service/dist/main"]
