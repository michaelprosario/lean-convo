# Lean Convo

A real-time web application for facilitating **Lean Coffee** meetings — structured, agenda-less meetings where participants collaboratively propose, discuss, and vote on topics.

Lean Convo enables an organizer to create a session, share a join link/code, and run a structured discussion. Participants propose topics, vote on their favorites, and the organizer drives the topic lifecycle (`Todo` ➔ `Active` ➔ `Done`).

---

## Table of Contents

1. [Architecture & Design Principles](#architecture--design-principles)
2. [Domain Entities](#domain-entities)
3. [Key Backend Services & Use Cases](#key-backend-services--use-cases)
4. [Prerequisites](#prerequisites)
5. [Getting Started for Developers](#getting-started-for-developers)
   - [1. Clone the Repository](#1-clone-the-repository)
   - [2. Start MongoDB Locally](#2-start-mongodb-locally)
   - [3. Configure & Run the Backend](#3-configure--run-the-backend)
   - [4. Run the Frontend (Angular Dev Server)](#4-run-the-frontend-angular-dev-server)
   - [5. Build and Deploy Co-located App (Optional)](#5-build-and-deploy-co-located-app-optional)
6. [Repository Structure](#repository-structure)
7. [API Design & Endpoints](#api-design--endpoints)
8. [Testing Guide](#testing-guide)
9. [Tech Stack](#tech-stack)

---

## Architecture & Design Principles

The application is built using **Clean Architecture** principles, ensuring that business rules are decoupled from database technologies, frameworks, and delivery mechanisms.

```
                  ┌──────────────────────────────┐
                  │          Web Layer           │
                  │   (Controllers, DTOs, Auth)  │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │         Core Layer           │
                  │ (Use Cases, Commands, Domain)│
                  └──────────────▲───────────────┘
                                 │
                  ┌──────────────┴───────────────┐
                  │     Infrastructure Layer     │
                  │   (Mongoose, Repos, JWTs)    │
                  └──────────────────────────────┘
```

### Key Architectural Rules

1. **Inward Dependencies**: The Core layer (`backend/src/core/`) has **zero** dependencies on external frameworks (e.g., NestJS, Mongoose, or database packages). Everything points inward toward the domain and contracts.
2. **Commands & Results**: Every use-case accepts a **Command** object and returns a custom **`AppResult<T>`** envelope instead of throwing exceptions for expected business failures. This ensures consistent handling of validation and logical errors.
3. **Data Protection**: Controller actions receive Request DTOs and return explicit Response DTOs. Domain entities are never serialized directly to clients.

---

## Domain Entities

The core domain model is composed of four primary entities defined in [backend/src/core/domain/](./backend/src/core/domain/):

### 1. User (`UserEntity`)
Represents registered organizers who can host and manage sessions.
* **Fields**:
  * `id` (`string`): Unique identifier.
  * `email` (`string`): Unique email address used for login.
  * `passwordHash` (`string`): BCRYPT hashed password.
  * `displayName` (`string`): Public-facing name.
  * `createdAt` (`Date`): Timestamp of creation.

### 2. Session (`SessionEntity`)
Represents an active or planned Lean Coffee meeting session.
* **Fields**:
  * `id` (`string`): Unique identifier.
  * `title` (`string`): The main title (e.g., "Sprint 5 Retro").
  * `description` (`string`): Brief context or guidelines.
  * `organizerId` (`string`): FK reference to the hosting `UserEntity`.
  * `joinCode` (`string`): Alphanumeric join code used by participants.
  * `videoLink` (`string`, optional): Meet/Zoom/Teams link.
  * `maxUpvotesPerParticipant` (`number`): The vote limit per user.
  * `createdAt` (`Date`): Timestamp of creation.

### 3. Participant (`ParticipantEntity`)
Represents an unauthenticated guest who joins a session via a join code.
* **Fields**:
  * `id` (`string`): Unique identifier.
  * `sessionId` (`string`): FK reference to the active `SessionEntity`.
  * `name` (`string`): Display name of the participant.
  * `linkedInUrl` (`string`, optional): Optional professional link.
  * `createdAt` (`Date`): Timestamp of joining.

### 4. Topic (`TopicEntity`)
Represents a discussion item proposed by a participant.
* **Fields**:
  * `id` (`string`): Unique identifier.
  * `sessionId` (`string`): FK reference to the parent `SessionEntity`.
  * `title` (`string`): Title/summary of the topic.
  * `description` (`string`): Optional detailed context.
  * `proposedBy` (`string`): FK reference to the proposing `ParticipantEntity` ID.
  * `upvoteCount` (`number`): Total votes.
  * `upvotedBy` (`string[]`): Array of `ParticipantEntity` IDs who upvoted it.
  * `status` (`TopicStatus`): Discussing state (`Todo`, `Active`, `Done`).
  * `createdAt` (`Date`): Timestamp of creation.

---

## Key Backend Services & Use Cases

The backend logic is structured into modular use-cases within [backend/src/core/use-cases/](./backend/src/core/use-cases/):

### Authentication (`auth/`)
* **`CreateAccountUseCase`**: Regulates organizer sign-ups, checks email duplicates, hashes passwords, and saves the new User.
* **`LoginUseCase`**: Validates credentials against password hashes and issues JWT authentication tokens.

### Sessions (`sessions/`)
* **`CreateSessionUseCase`**: Creates a new discussion workspace, automatically generating a 6-character alphanumeric `joinCode`.
* **`EditSessionUseCase`**: Enables organizers to update the metadata or upvote limit of a session.
* **`GetMySessionsUseCase`**: Fetches all active and historic sessions hosted by the authenticated organizer.
* **`GetSessionByCodeUseCase`**: Resolves session details from a public join code, letting guests onboard.
* **`ExportSessionDetailsUseCase`**: Compiles session metadata, participant rosters, and all proposed topics/votes into a structured format for export.

### Participants (`participants/`)
* **`JoinSessionUseCase`**: Validates a join code, registers a guest, and creates a `ParticipantEntity`.

### Topics (`topics/`)
* **`ProposeTopicUseCase`**: Adds a new topic in `Todo` status for a participant.
* **`EditTopicUseCase` / `DeleteTopicUseCase`**: Allows the proposing participant to modify or withdraw their topic.
* **`OrganizerEditTopicUseCase` / `OrganizerDeleteTopicUseCase`**: Grants organizers admin overrides to modify or delete any topic.
* **`UpvoteTopicUseCase`**: Enforces voting limits, toggling upvotes on and off based on session rules.
* **`SetTopicStatusUseCase`**: Progresses a topic's life-cycle (`Todo` ➔ `Active` ➔ `Done`).
* **`GetSessionTopicsUseCase`**: Queries all topic list states for a session.

---

## Prerequisites

Ensure you have the following installed locally:

| Dependency | Required Version | Verification Command |
|---|---|---|
| **Node.js** | v20 LTS | `node --version` |
| **npm** | v10+ | `npm --version` |
| **Docker** | v24+ | `docker --version` |
| **Docker Compose** | v2+ | `docker compose version` |

---

## Getting Started for Developers

Follow these steps to run a local development environment.

### 1. Clone the Repository

```bash
git clone https://github.com/michaelprosario/lean-convo.git
cd lean-convo
```

### 2. Start MongoDB Locally

Navigate to the `local-mongodb-setup` folder and start the containerized database stack:

```bash
cd local-mongodb-setup
docker compose up -d
```

This starts:
1. **MongoDB**: Listens on `localhost:27017`. Persists data inside a Docker named volume (`mongo_data`). Initializes schema indexes using [mongo-init.js](./scripts/mongo-init.js).
2. **Mongo Express**: A web administration dashboard at [http://localhost:8081](http://localhost:8081).

To tear down the stack and erase all database records:
```bash
docker compose down -v
```

### 3. Configure & Run the Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd ../backend
   ```
2. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
   Confirm the values match your database:
   ```env
   MONGODB_URI=mongodb://lean_user:lean_pass@localhost:27017/lean_convo?authSource=lean_convo
   JWT_SECRET=local-dev-secret-change-in-production
   PORT=3001
   ```
3. Install dependencies and start the NestJS API server in dev/watch mode:
   ```bash
   npm install
   npm run start:dev
   ```
   The API server will launch at [http://localhost:3001](http://localhost:3001).

### 4. Run the Frontend (Angular Dev Server)

1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular dev server:
   ```bash
   npm run start
   ```
   The web app will run at [http://localhost:4200](http://localhost:4200). 
   *Note: API calls made to `/auth/*`, `/sessions/*`, etc., are automatically proxied to the backend via [proxy.conf.json](./frontend/proxy.conf.json).*

### 5. Build and Deploy Co-located App (Optional)

If you want to test how the application behaves when the frontend is compiled and hosted directly by NestJS:

1. Run the deployment script from the root of the workspace:
   ```bash
   ./deploy-frontend.sh
   ```
2. This script compiles the production bundle of the Angular application and places it inside the `backend/public/` directory.
3. Start your backend in standard or dev mode. NestJS will now host the entire application (both the client UI and API routes) on [http://localhost:3001](http://localhost:3001).

---

## Repository Structure

```
lean-convo/
├── backend/                   # NestJS Application
│   ├── public/                # Static public folder served by NestJS
│   ├── src/
│   │   ├── core/              # Domain logic & Use Cases (Pure TypeScript)
│   │   │   ├── commands/      # Input command DTOs
│   │   │   ├── domain/        # Domain entities (User, Session, etc.)
│   │   │   ├── interfaces/    # Repository and Utility interfaces
│   │   │   ├── results/       # AppResult wrappers
│   │   │   └── use-cases/     # Executable business rules
│   │   ├── infra/             # Schema definitions & database repo adapters
│   │   └── web/               # Controller routes & NestJS wiring
│   └── test/                  # E2E test configuration
├── frontend/                  # Angular 21 Single Page Application
├── local-mongodb-setup/       # Local database configuration
│   └── docker-compose.yaml    # Docker infrastructure
└── scripts/                   # Database seed and deployment scripts
```

---

## API Design & Endpoints

All responses from the backend API follow a standardized envelope structure represented by `AppResult<T>`:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Failure Response:**
```json
{
  "success": false,
  "errorMessage": "Detailed validation or business logic failure description"
}
```

### Key API Endpoints

| Category | Endpoint | Method | Authentication | Payload |
|---|---|---|---|---|
| **Auth** | `/auth/create-account` | `POST` | None | `{ email, password, displayName }` |
| **Auth** | `/auth/login` | `POST` | None | `{ email, password }` |
| **Sessions** | `/sessions/create` | `POST` | Bearer JWT | `{ title, description, maxUpvotesPerParticipant, videoLink }` |
| **Sessions** | `/sessions/join` | `POST` | None | `{ joinCode, name, linkedInUrl }` |
| **Topics** | `/topics/propose` | `POST` | Participant Header | `{ title, description }` |
| **Topics** | `/topics/upvote` | `POST` | Participant Header | `{ topicId }` |

---

## Testing Guide

### Backend Tests (Jest & ts-mockito)
The core business rules are heavily tested in isolation without spawning any HTTP servers or databases:

```bash
cd backend
npm test                          # Run all unit tests
npm run test:cov                  # Run tests with HTML coverage reporting
```

### Frontend Tests (Vitest)
The Angular application uses Vitest for lighting fast component and service unit testing:

```bash
cd frontend
npm test                          # Run Vitest test suite
```

---

## Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Runtime & Framework** | Node.js 20 + NestJS 11 | Backend HTTP API application layer |
| **Language** | TypeScript | Strong typing across both frontend and backend |
| **Database** | MongoDB 7 | Document-oriented data storage |
| **ODM / DB Driver** | Mongoose | Node.js MongoDB modeling library |
| **Frontend Framework** | Angular 21 | Responsive client SPA |
| **Authentication** | JWT & Passport | Secure, stateless authentication flow |
| **Backend Testing** | Jest + ts-mockito | Mocking and unit test framework |
| **Frontend Testing** | Vitest | Component/Service testing |
