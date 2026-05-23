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
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
CMD ["npm", "run", "dev", "-w", "apps/web-portal"]

# 4. Builder stage
FROM dependencies AS builder
COPY . .
ENV NODE_ENV=production
RUN npm run build -w apps/web-portal

# 5. Production runner stage
FROM base AS production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy next.js assets
COPY --from=builder /usr/src/app/apps/web-portal/public ./apps/web-portal/public
COPY --from=builder /usr/src/app/apps/web-portal/.next/standalone ./
COPY --from=builder /usr/src/app/apps/web-portal/.next/static ./apps/web-portal/.next/static

EXPOSE 3000
CMD ["node", "apps/web-portal/server.js"]
