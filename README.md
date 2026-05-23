# DevOps & Clean Architecture Microservices Workspace

A clean, production-ready boilerplate playground for experimenting with Docker orchestration, npm workspaces, Dependabot, and Clean Architecture patterns.

---

## 🏗️ Architecture Overview

This project is structured as a **monorepo** using **npm workspaces**. Rather than isolated configurations, all services share a unified dependency lockfile (`package-lock.json`) at the root, making package resolution fast, consistent, and easy to maintain.

```
joyful-bardeen/
├── .github/
│   └── dependabot.yml       # Dependabot configuration (workspaces & Docker files)
├── apps/
│   ├── auth-service/        # NestJS Microservice 1 (Port 3001)
│   ├── user-service/        # NestJS Microservice 2 (Port 3002)
│   └── web-portal/          # Next.js Frontend App (Port 3000)
├── docker-compose.yml       # Docker Compose dev environment orchestration
└── package.json             # Root monorepo configuration
```

### Port Mapping Matrix

In order to simulate real-world hosting where apps are routed or exposed on specific ports directly on the server host:

| Service | Technology | Internal Port | Host Port | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `web-portal` | Next.js 16 | `3000` | `3000` | Frontend dashboard & portal |
| `auth-service` | NestJS 11 | `3001` | `3001` | Authentication / Login endpoints |
| `user-service` | NestJS 11 | `3002` | `3002` | User profiles / Settings |

---

## 🚀 Running the Services

### Prerequisites
Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.

### Method 1: Using Docker Compose (Recommended)
This starts all three services in hot-reloading development containers:

```bash
# Start all containers in the foreground
docker compose up

# Start all containers in the background
docker compose up -d

# Stop all running containers
docker compose down
```

Once running, open your browser and navigate to:
- 💻 **Frontend Web Portal**: [http://localhost:3000](http://localhost:3000)
- 🔒 **Auth Service Health**: [http://localhost:3001/health](http://localhost:3001/health)
- 👤 **User Service Health**: [http://localhost:3002/health](http://localhost:3002/health)

### Method 2: Running Locally on Host
If you want to run the applications directly on your host machine:

```bash
# Install all dependencies across the entire workspace
npm install

# Start each service individually in dev mode
npm run dev -w apps/web-portal       # Runs Next.js on localhost:3000
npm run start:dev -w apps/auth-service  # Runs NestJS on localhost:3001
npm run start:dev -w apps/user-service  # Runs NestJS on localhost:3002
```

---

## 🤖 Dependabot Integration

The repository contains a Dependabot configuration in `.github/dependabot.yml`. 
Dependabot is fully configured to track:
1. **Root `package-lock.json`**: Keeps all shared workspace npm dependencies secure and up-to-date.
2. **Individual `Dockerfile` files**: Monitors Docker base images (`node:22-alpine`) and flags updates automatically.

This ensures you can test automated dependency bump pull requests directly on your GitHub repository.

---

## 🧪 Experiments Ideas to Run Here
This workspace is designed to be easily extensible. Here are some concepts you can experiment with:

1. **Clean Architecture separation**: Move NestJS controllers to a separate folder, keeping the `core/domain` package independent of NestJS decorators.
2. **Add a Shared Library workspace**: Create `apps/shared-dtos` or `packages/common` and import it into both NestJS and Next.js projects to share TypeScript interfaces.
3. **Database Integration**: Add a PostgreSQL or MongoDB container in `docker-compose.yml` and wire it up with Prisma or TypeORM in the backend services.
4. **CI/CD Pipelines**: Create a `.github/workflows/ci.yml` file to run tests and build images automatically on pull requests.
5. **Event-driven communication**: Integrate a RabbitMQ or Redis Broker inside the docker-compose to let `auth-service` trigger events that `user-service` listens to.
