# Lean Convo

A real-time web application for facilitating **Lean Coffee** meetings — structured, agenda-less meetings where participants collaboratively propose and vote on discussion topics.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Repository Structure](#repository-structure)
4. [Prerequisites](#prerequisites)
5. [Getting Started](#getting-started)
   - [1. Clone the repo](#1-clone-the-repo)
   - [2. Start MongoDB locally](#2-start-mongodb-locally)
   - [3. Configure the backend](#3-configure-the-backend)
   - [4. Install dependencies and run](#4-install-dependencies-and-run)
6. [Available Scripts](#available-scripts)
7. [API Endpoints](#api-endpoints)
8. [Prototype UI](#prototype-ui)
9. [Running Tests](#running-tests)
10. [Environment Variables](#environment-variables)
11. [Tech Stack](#tech-stack)

---

## Project Overview

Lean Convo enables an **organizer** to create a session, share a join link, and run a Lean Coffee-style meeting. Participants propose topics, vote on what to discuss, and the organizer drives the topic lifecycle (Todo → Active → Done).

---

## Architecture

The codebase follows **Clean Architecture** (Ardalis/Smith style). All dependencies point inward toward `core/`.

| Layer | Folder | Responsibility |
|---|---|---|
| Core | `src/core/` | Domain entities, interfaces, use-case services, command objects, `AppResult<T>` |
| Infrastructure | `src/infra/` | Mongoose schemas, repository implementations, bcrypt & JWT services |
| Web | `src/web/` | NestJS controllers, DTOs, auth guards, module wiring |
| Prototype UI | `public/` | Static HTML/CSS/JS pages served directly by NestJS |

Key rules:
- `core/` has **zero** dependencies on NestJS, Mongoose, or any infrastructure package.
- Every use-case accepts a **Command** object and returns an **`AppResult<T>`** — never throws for expected business failures.
- Controllers always return explicit **DTO classes** — domain entities are never serialized directly.

---

## Repository Structure

```
lean-convo/
├── backend/                   # NestJS application
│   ├── public/                # Prototype HTML/CSS/JS UI
│   │   ├── css/auth.css
│   │   ├── register.html      # Create Account screen
│   │   ├── login.html         # Sign In screen
│   │   └── dashboard.html     # Post-login landing page
│   └── src/
│       ├── core/              # Pure domain logic (no framework deps)
│       │   ├── commands/
│       │   ├── domain/
│       │   ├── interfaces/
│       │   ├── results/
│       │   └── use-cases/
│       ├── infra/             # Mongoose + external service implementations
│       │   ├── repositories/
│       │   ├── schemas/
│       │   └── services/
│       └── web/               # NestJS controllers, DTOs, modules
│           ├── auth/
│           ├── guards/
│           ├── sessions/
│           └── strategies/
├── local-mongodb-setup/       # Docker Compose for local MongoDB
│   ├── docker-compose.yaml
│   └── scripts/mongo-init.js
└── prompts/                   # Architecture & planning reference docs
```

---

## Prerequisites

| Tool | Minimum version | Notes |
|---|---|---|
| Node.js | 20 LTS | `node --version` |
| npm | 10 | Included with Node 20 |
| Docker | 24 | For local MongoDB |
| Docker Compose | v2 (plugin) | `docker compose version` |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/michaelprosario/lean-convo.git
cd lean-convo
```

### 2. Start MongoDB locally

```bash
cd local-mongodb-setup
docker compose up -d
```

This starts two containers:

| Container | Purpose | URL |
|---|---|---|
| `lean_convo_mongo` | MongoDB 7 | `localhost:27017` |
| `lean_convo_mongo_express` | Web-based DB admin UI | http://localhost:8081 |

MongoDB data is persisted in the `mongo_data` Docker volume and survives restarts. To tear down and wipe data:

```bash
docker compose down -v
```

### 3. Configure the backend

```bash
cd ../backend
cp .env.example .env   # or create .env manually (see below)
```

Minimum `.env` for local development:

```env
MONGODB_URI=mongodb://admin:password@localhost:27017/lean-convo?authSource=admin
JWT_SECRET=local-dev-secret-change-in-production
PORT=3000
```

> **Note:** Never commit `.env` to source control. It is already listed in `.gitignore`.

### 4. Install dependencies and run

```bash
cd backend          # if not already there
npm install
npm run start:dev   # watch mode – auto-reloads on file changes
```

The API and UI are both served at **http://localhost:3000**.

---

## Available Scripts

Run these from the `backend/` directory.

| Command | Description |
|---|---|
| `npm run start:dev` | Start in watch mode (development) |
| `npm run start` | Start without watch |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start:prod` | Run the compiled build |
| `npm test` | Run all unit tests |
| `npm run test:cov` | Run tests with coverage report |
| `npm run lint` | Lint and auto-fix with ESLint |

---

## API Endpoints

All endpoints accept and return `application/json`. Mutations use `POST`.

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/create-account` | None | Register a new organizer account |
| `POST` | `/auth/login` | None | Authenticate and receive a JWT |

**Create Account** request body:
```json
{ "email": "jane@example.com", "password": "mypassword", "displayName": "Jane Smith" }
```

**Login** request body:
```json
{ "email": "jane@example.com", "password": "mypassword" }
```

**Login** response `data`:
```json
{ "accessToken": "<jwt>", "userId": "...", "displayName": "Jane Smith", "email": "jane@example.com" }
```

### Sessions

Include the JWT in the `Authorization` header: `Bearer <accessToken>`.

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/sessions/create` | JWT required | Create a new Lean Coffee session |

**Create Session** request body:
```json
{
  "title": "Sprint Retro",
  "description": "Team retrospective",
  "maxUpvotesPerParticipant": 3,
  "videoLink": "https://zoom.us/j/..."
}
```

All responses follow the `AppResult<T>` envelope:
```json
{ "success": true, "data": { ... } }
{ "success": false, "errorMessage": "..." }
```

---

## Prototype UI

Static HTML pages are served from `backend/public/` by NestJS via `ServeStaticModule`.

| URL | Screen |
|---|---|
| http://localhost:3000/register.html | Create Account |
| http://localhost:3000/login.html | Sign In |
| http://localhost:3000/dashboard.html | Organizer dashboard (placeholder) |

After login the JWT is stored in `sessionStorage` and used for authenticated API calls.

---

## Running Tests

```bash
cd backend
npm test                          # all tests
npm test -- --testPathPattern auth   # auth use-cases only
npm test -- --testPathPattern session # session use-cases only
npm run test:cov                  # with HTML coverage report
```

Unit tests live alongside their use-cases in `src/core/use-cases/**/*.spec.ts` and use **Jest** + **ts-mockito** mocks. The `core/` layer has no NestJS or Mongoose dependencies, so tests run fast with no database required.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb://admin:password@localhost:27017/lean-convo?authSource=admin` | MongoDB connection string |
| `JWT_SECRET` | `change-me-in-production` | Secret used to sign JWTs — **must be changed in any shared environment** |
| `PORT` | `3000` | HTTP port the NestJS server listens on |

---

## Tech Stack

| Concern | Technology |
|---|---|
| Runtime & Framework | Node.js 20 + NestJS 11 |
| Language | TypeScript |
| Database | MongoDB 7 |
| ODM | `@nestjs/mongoose` + Mongoose |
| Auth | JWT (`@nestjs/jwt` + Passport) |
| Validation | `class-validator` + `class-transformer` |
| Unit Testing | Jest |
| Mocking | ts-mockito |
| Prototype UI | Vanilla HTML / CSS / JavaScript |
| Future UI | Angular (planned) |
