# Docker Setup & Usage Guide for Lean Convo Backend

This guide explains how to build, configure, and run the Lean Convo NestJS backend using Docker and Docker Compose.

## Architecture Overview

The containerized environment includes:
1. **NestJS Backend API**: Built using a multi-stage [Dockerfile](file:///workspaces/lean-convo/backend/Dockerfile) running on Node 20 (Alpine) under a non-root `node` user.
2. **MongoDB Database**: Evaluated from the standard Mongo 7 image and initialized with database users and collection indexes via [mongo-init.js](file:///workspaces/lean-convo/scripts/mongo-init.js).
3. **Mongo Express**: A web-based admin client to view and modify your local database collections at `http://localhost:8081`.

---

## Configuration

The backend is configured via environment variables. The startup entrypoint [docker-entrypoint.sh](file:///workspaces/lean-convo/backend/docker-entrypoint.sh) is designed to accept either a single unified MongoDB URI or discrete connection parameters.

### 1. Unified Connection String
Set `MONGODB_URI` directly:
```env
MONGODB_URI=mongodb://lean_user:lean_pass@mongodb:27017/lean_convo?authSource=lean_convo
```

### 2. Discrete Configuration Parameters (Default)
If `MONGODB_URI` is not provided, the container dynamically builds it using the following parameters configured in [docker-compose.yaml](file:///workspaces/lean-convo/docker-compose.yaml):

| Variable | Description | Default / Compose Value |
|---|---|---|
| `MONGO_HOST` | Database host name / container service name | `mongodb` |
| `MONGO_PORT` | Port of the database service | `27017` |
| `MONGO_DB` | Application database name | `lean_convo` |
| `MONGO_USER` | Application database username | `lean_user` |
| `MONGO_PASSWORD`| Application database password | `lean_pass` |
| `MONGO_AUTH_SOURCE`| DB source for authentication | `lean_convo` |

---

## Docker Compose Commands

All commands should be executed from the root of the workspace.

### Start the entire stack
To compile the NestJS code, build the image, and boot all services (database, web UI, and backend API) in the background:
```bash
docker compose up -d --build
```

Once running:
- **Backend API**: Accessible at `http://localhost:3001`
- **Mongo Express UI**: Accessible at `http://localhost:8081`
- **MongoDB**: Accessible at `localhost:27017` (bound to host interface `127.0.0.1` only)

### View Logs
Monitor live output from all services:
```bash
docker compose logs -f
```
Or check only the backend application:
```bash
docker compose logs -f backend
```

### Stop Services
To stop running containers without destroying local database data:
```bash
docker compose down
```

### Reset Database Volume
To stop containers and completely wipe out the MongoDB volume (to start with a fresh DB next time):
```bash
docker compose down -v
```

---

## Dockerfile-only Operations

If you want to operate the backend Docker image independently:

### Build Backend Image
```bash
docker build -t lean-convo-backend ./backend
```

### Run Backend Image
Run the backend image standalone and connect to a MongoDB instance running on your host machine:
```bash
docker run -d \
  -p 3001:3001 \
  -e PORT=3001 \
  -e MONGO_HOST=host.docker.internal \
  -e MONGO_PORT=27017 \
  -e MONGO_DB=lean_convo \
  -e MONGO_USER=lean_user \
  -e MONGO_PASSWORD=lean_pass \
  -e MONGO_AUTH_SOURCE=lean_convo \
  -e JWT_SECRET=your_secret_key \
  lean-convo-backend
```
*(Ensure `host.docker.internal` is addressable from your container to access host-bound services)*
