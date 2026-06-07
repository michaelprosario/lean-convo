# Lean Convo – Technical Plan

## 1. Project Overview

Lean Convo is a real-time web application for facilitating **Lean Coffee** meetings. It enables organizers to create and manage sessions, and participants to propose and vote on discussion topics collaboratively. Key traits: real-time updates, anonymous participation, and a structured topic lifecycle (Todo → Active → Done).

---

## 2. Architecture: Clean Architecture (Ardalis/Smith Style)

The codebase follows the dependency rule strictly — **all dependencies point inward toward `core/`**. The three logical layers are:

| Layer | Folder | Responsibility |
|---|---|---|
| Core | `src/core/` | Domain entities, interfaces, use-case services, command/query objects, `AppResult<T>` |
| Infrastructure | `src/infra/` | MongoDB/Mongoose repositories, WebSocket gateway, any external services |
| Web/UI | `src/web/` | NestJS controllers, HTTP routing, DTO serialization, module wiring |
| Prototype UI | `public/` | Static HTML/CSS/JS screens served directly by NestJS |

### Key Rules Applied
- `core/` has **zero dependencies** on NestJS, Mongoose, or any infrastructure package.
- All data/external concerns are abstracted behind interfaces defined in `core/` and implemented in `infra/`.
- Every core use-case service accepts a **Command or Query object** as input.
- Every core use-case service returns an **`AppResult<T>`** object — never throws for expected business failures.
- All core services have corresponding **Jest unit tests** with `ts-mockito` mocks.
- **Controllers always return explicit DTO classes** — domain entities are never serialized directly to the HTTP response. This decouples the API contract from the internal model and makes the eventual Angular migration straightforward.

---

## 3. Tech Stack

| Concern | Technology |
|---|---|
| Runtime & Framework | Node.js + NestJS |
| Language | TypeScript |
| Database | MongoDB |
| ODM | `@nestjs/mongoose` + Mongoose |
| Real-Time | NestJS WebSocket Gateway (`socket.io`) |
| HTTP API style | HTTP POST for all mutation/query endpoints |
| Unit Testing | Jest |
| Mocking | ts-mockito |
| Auth | JWT (`@nestjs/jwt` + `@nestjs/passport`) |
| Validation | `class-validator` + `class-transformer` (NestJS pipes) |
| Front-End (prototype) | Vanilla HTML / CSS / JavaScript (static files served by NestJS) |
| Front-End (future) | Angular (SPA, consuming the same REST + WebSocket API) |

---

## 4. Folder Structure

```
src/
├── core/
│   ├── domain/                    # Pure domain entities & value types
│   │   ├── user.entity.ts
│   │   ├── session.entity.ts
│   │   ├── topic.entity.ts
│   │   └── participant.entity.ts
│   ├── interfaces/                # Repository & service contracts
│   │   ├── user.repository.interface.ts
│   │   ├── session.repository.interface.ts
│   │   ├── topic.repository.interface.ts
│   │   └── participant.repository.interface.ts
│   ├── commands/                  # Input command objects (mutations)
│   │   ├── create-account.command.ts
│   │   ├── login.command.ts
│   │   ├── create-session.command.ts
│   │   ├── edit-session.command.ts
│   │   ├── set-topic-status.command.ts
│   │   ├── propose-topic.command.ts
│   │   ├── upvote-topic.command.ts
│   │   ├── join-session.command.ts
│   │   └── edit-topic.command.ts
│   ├── queries/                   # Input query objects (reads)
│   │   ├── get-session.query.ts
│   │   ├── get-session-topics.query.ts
│   │   └── export-session.query.ts
│   ├── results/
│   │   └── app-result.ts          # AppResult<T> shared result type
│   └── use-cases/
│       ├── auth/
│       │   ├── create-account.use-case.ts
│       │   ├── create-account.use-case.spec.ts
│       │   ├── login.use-case.ts
│       │   └── login.use-case.spec.ts
│       ├── sessions/
│       │   ├── create-session.use-case.ts
│       │   ├── create-session.use-case.spec.ts
│       │   ├── edit-session.use-case.ts
│       │   ├── edit-session.use-case.spec.ts
│       │   ├── export-session.use-case.ts
│       │   └── export-session.use-case.spec.ts
│       ├── topics/
│       │   ├── edit-topic.use-case.ts
│       │   ├── edit-topic.use-case.spec.ts
│       │   ├── set-topic-status.use-case.ts
│       │   ├── set-topic-status.use-case.spec.ts
│       │   ├── propose-topic.use-case.ts
│       │   ├── propose-topic.use-case.spec.ts
│       │   ├── upvote-topic.use-case.ts
│       │   └── upvote-topic.use-case.spec.ts
│       └── participants/
│           ├── join-session.use-case.ts
│           └── join-session.use-case.spec.ts
├── infra/
│   ├── database/
│   │   └── mongoose/
│   │       ├── schemas/
│   │       │   ├── user.schema.ts
│   │       │   ├── session.schema.ts
│   │       │   ├── topic.schema.ts
│   │       │   └── participant.schema.ts
│   │       └── repositories/
│   │           ├── user.mongoose.repository.ts
│   │           ├── session.mongoose.repository.ts
│   │           ├── topic.mongoose.repository.ts
│   │           └── participant.mongoose.repository.ts
│   └── real-time/
│       └── session.gateway.ts     # WebSocket gateway (socket.io)
├── web/
│   ├── dtos/                          # Response & request DTO classes
│   │   ├── auth/
│   │   │   ├── register-request.dto.ts
│   │   │   ├── login-request.dto.ts
│   │   │   └── auth-token.dto.ts
│   │   ├── sessions/
│   │   │   ├── create-session-request.dto.ts
│   │   │   ├── edit-session-request.dto.ts
│   │   │   └── session.dto.ts
│   │   ├── topics/
│   │   │   ├── propose-topic-request.dto.ts
│   │   │   ├── upvote-topic-request.dto.ts
│   │   │   ├── set-topic-status-request.dto.ts
│   │   │   └── topic.dto.ts
│   │   └── participants/
│   │       ├── join-session-request.dto.ts
│   │       └── participant.dto.ts
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   ├── sessions/
│   │   ├── sessions.controller.ts
│   │   └── sessions.module.ts
│   ├── topics/
│   │   ├── topics.controller.ts
│   │   └── topics.module.ts
│   └── participants/
│       ├── participants.controller.ts
│       └── participants.module.ts
├── public/                            # Prototype HTML/CSS/JS screens
│   ├── index.html                     # Landing / join page
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html                 # Organizer session list
│   ├── session.html                   # Live session view (organizer)
│   ├── participate.html               # Live session view (participant)
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── api.js                     # Thin fetch-based API client
│       └── socket.js                  # socket.io client helpers
├── app.module.ts
└── main.ts
```

---

## 5. Domain Model

### User
```typescript
class User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}
```

### Session
```typescript
class Session {
  id: string;
  title: string;
  description: string;
  videoLink?: string;
  shareCode: string;          // short unique code for joining
  maxVotesPerParticipant: number;
  organizerId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Topic
```typescript
enum TopicStatus { Todo = 'Todo', Active = 'Active', Done = 'Done' }

class Topic {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  status: TopicStatus;        // default: Todo
  voteCount: number;          // default: 0
  proposedByName: string;     // participant display name
  createdAt: Date;
}
```

### Participant
```typescript
class Participant {
  id: string;
  sessionId: string;
  userId?: string;            // null for anonymous participants
  name: string;
  linkedInLink?: string;
  remainingVotes: number;     // initialized from session.maxVotesPerParticipant
  joinedAt: Date;
}
```

---

## 6. `AppResult<T>` Pattern

All use-case services return `AppResult<T>`. No exceptions are thrown for expected business rule violations.

```typescript
// src/core/results/app-result.ts
export class AppResult<T = void> {
  readonly success: boolean;
  readonly data?: T;
  readonly message?: string;
  readonly errors?: string[];

  private constructor(success: boolean, data?: T, message?: string, errors?: string[]) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.errors = errors;
  }

  static ok<T>(data?: T, message?: string): AppResult<T> {
    return new AppResult<T>(true, data, message);
  }

  static fail<T = void>(message: string, errors?: string[]): AppResult<T> {
    return new AppResult<T>(false, undefined, message, errors);
  }
}
```

---

## 7. Use Case to Service Mapping

| Use Case | Core Service | Command/Query |
|---|---|---|
| UC-01 Create Account | `CreateAccountUseCase` | `CreateAccountCommand` |
| UC-02 Login | `LoginUseCase` | `LoginCommand` |
| UC-03 Create Session | `CreateSessionUseCase` | `CreateSessionCommand` |
| UC-04 Edit Session | `EditSessionUseCase` | `EditSessionCommand` |
| UC-05 Edit Session Topics | `EditTopicUseCase` | `EditTopicCommand` |
| UC-06 Set Topic Status | `SetTopicStatusUseCase` | `SetTopicStatusCommand` |
| UC-07 Export Session | `ExportSessionUseCase` | `ExportSessionQuery` |
| UC-08/12 Real-Time View | WebSocket gateway (push) | — |
| UC-09 Join Session | `JoinSessionUseCase` | `JoinSessionCommand` |
| UC-10 Propose Topic | `ProposeTopicUseCase` | `ProposeTopicCommand` |
| UC-11 Upvote Topic | `UpvoteTopicUseCase` | `UpvoteTopicCommand` |

---

## 8. HTTP API Design

All mutation and query endpoints use **HTTP POST** as per tech stack conventions.

### DTO Convention
Every controller method maps its input to a request DTO (validated by NestJS `ValidationPipe`) and maps the use-case result to an explicit **response DTO** before returning. Domain entities are never returned directly from controllers. This keeps the API contract stable and independent of internal model changes, and ensures the prototype HTML/JS clients and a future Angular client consume the same typed contract.

Example shape:
```
POST /sessions/create
  ← CreateSessionRequestDto  { title, description, videoLink?, maxVotesPerParticipant }
  → SessionDto               { id, title, description, videoLink, shareCode, maxVotesPerParticipant, createdAt }
```

### Auth (`/auth`)
| Endpoint | Use Case | Request Body |
|---|---|---|
| `POST /auth/register` | UC-01 | `{ email, password }` |
| `POST /auth/login` | UC-02 | `{ email, password }` → returns JWT |

### Sessions (`/sessions`)
| Endpoint | Use Case | Auth Required |
|---|---|---|
| `POST /sessions/create` | UC-03 | Organizer (JWT) |
| `POST /sessions/edit` | UC-04 | Organizer (JWT) |
| `POST /sessions/get` | Read | Optional |
| `POST /sessions/export` | UC-07 | Organizer (JWT) |

### Topics (`/topics`)
| Endpoint | Use Case | Auth Required |
|---|---|---|
| `POST /topics/propose` | UC-10 | Participant session token |
| `POST /topics/upvote` | UC-11 | Participant session token |
| `POST /topics/edit` | UC-05 | Organizer (JWT) |
| `POST /topics/set-status` | UC-06 | Organizer (JWT) |
| `POST /topics/list` | Read | Optional |

### Participants (`/participants`)
| Endpoint | Use Case | Auth Required |
|---|---|---|
| `POST /participants/join` | UC-09 | None (anonymous allowed) |

---

## 9. Real-Time Communication (WebSocket Gateway)

A single `SessionGateway` handles all real-time events. Clients join a **room** per session using the session ID.

### Gateway Room: `session:{sessionId}`

#### Server → Client Events (broadcasts)
| Event | Triggered By | Payload |
|---|---|---|
| `topic:proposed` | UC-10 Propose Topic | `{ topic }` |
| `topic:upvoted` | UC-11 Upvote Topic | `{ topicId, voteCount }` |
| `topic:status-changed` | UC-06 Set Topic Status | `{ topicId, status }` |
| `topic:updated` | UC-05 Edit Topic | `{ topic }` |
| `session:updated` | UC-04 Edit Session | `{ session }` |

#### Client → Server Events
| Event | Description |
|---|---|
| `join-session` | Client requests to join a session room |
| `leave-session` | Client leaves session room |

### Architecture Note
The `SetTopicStatusUseCase`, `ProposeTopicUseCase`, and `UpvoteTopicUseCase` accept an optional **event publisher interface** (`ISessionEventPublisher`) defined in `core/interfaces/`. The `SessionGateway` in `infra/real-time/` implements this interface and is injected at the module level — keeping `core/` unaware of WebSocket internals.

---

## 10. MongoDB Collections & Schemas

| Collection | Key Fields |
|---|---|
| `users` | `_id`, `email`, `passwordHash`, `createdAt` |
| `sessions` | `_id`, `title`, `description`, `videoLink`, `shareCode`, `maxVotesPerParticipant`, `organizerId`, `createdAt`, `updatedAt` |
| `topics` | `_id`, `sessionId`, `title`, `description`, `status`, `voteCount`, `proposedByName`, `createdAt` |
| `participants` | `_id`, `sessionId`, `userId`, `name`, `linkedInLink`, `remainingVotes`, `joinedAt` |

**Indexes:**
- `sessions.shareCode` — unique index for fast lookup by join code
- `topics.sessionId` — index for listing topics by session
- `participants.sessionId` — index for listing participants by session
- `users.email` — unique index

---

## 11. Authentication & Authorization

- **Registration/Login** use bcrypt for password hashing; JWT is issued on successful login.
- **Organizer routes** require a valid JWT via `JwtAuthGuard`.
- **Participants** receive a lightweight session token (short-lived JWT or signed cookie) after joining, encoding `{ participantId, sessionId }`. This token is used to authorize topic proposal and voting.
- Anonymous join is allowed — no account required; only a display name.

---

## 12. Testing Strategy

| Layer | What to Test | Tools |
|---|---|---|
| `core/use-cases/` | All business logic, business rule enforcement, `AppResult` outcomes | Jest + ts-mockito |
| `infra/` | Repository integration tests against a test MongoDB instance | Jest + `@testcontainers/mongodb` or `mongodb-memory-server` |
| `web/` | Controller-level HTTP integration tests | NestJS `supertest` |

Every use-case service spec file is co-located alongside its implementation (`*.use-case.spec.ts`). Repository interfaces are mocked with `ts-mockito` so core tests never touch a real database.

---

## 13. Export Feature (UC-07)

The `ExportSessionUseCase` compiles:
- Session metadata (title, description, video link, date)
- Participant list (name, LinkedIn if provided)
- Topic list (title, description, final vote count, status)

Output format: **CSV** (initial implementation). A JSON format may also be offered. The export logic lives entirely in `core/` using plain TypeScript string/array manipulation — no infrastructure dependencies.

---

## 14. Development Milestones

| Phase | Deliverables |
|---|---|
| 1 – Foundation | Project scaffold, folder structure, `AppResult<T>`, domain entities, repository interfaces, DTO classes |
| 2 – Auth | UC-01, UC-02 with JWT; `UserMongooseRepository`; auth DTOs |
| 3 – Session Management | UC-03, UC-04, UC-09; session and participant repositories; session/participant DTOs |
| 4 – Topics (HTTP) | UC-05, UC-06, UC-10, UC-11 over HTTP; topic DTOs |
| 5 – Prototype UI | Static HTML/CSS/JS screens in `public/` wired to the REST API |
| 6 – Real-Time | `SessionGateway`, WebSocket integration for UC-06, UC-10, UC-11, UC-08/12 |
| 7 – Export | UC-07 CSV export |
| 8 – Testing & Polish | Full unit test coverage for all core use cases, integration tests |
| Future – Angular | Replace `public/` prototype with an Angular SPA; API contract unchanged |

---

## 15. Front-End Strategy

### Current: HTML / CSS / JavaScript Prototype

Prototype screens are plain static files served by NestJS from the `public/` directory (`ServeStaticModule`). They use the `fetch` API to call the REST endpoints and `socket.io-client` for real-time updates. No build step is required for the prototype.

**Screens planned:**

| File | Purpose |
|---|---|
| `index.html` | Landing page; join session by code |
| `register.html` | UC-01 Create Account |
| `login.html` | UC-02 Login |
| `dashboard.html` | Organizer's session list |
| `session.html` | Organizer live session view (topic lifecycle, status controls) |
| `participate.html` | Participant live session view (propose, upvote, real-time feed) |

### Future: Angular SPA

When the product matures, the `public/` prototype will be replaced by an Angular application. Because:
- All controllers return **DTOs** (not domain entities), the API contract is already clean and typed.
- Real-time communication is handled by a dedicated WebSocket gateway — Angular will simply swap in `socket.io-client` services.
- JWT auth is stateless, so the Angular `HttpInterceptor` pattern applies without backend changes.

The NestJS backend requires **no structural changes** for the Angular migration.
