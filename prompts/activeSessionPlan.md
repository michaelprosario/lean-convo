# Active Session Plan – Participant Features

## Goal

Enable participants to join a Lean Coffee session using a session code, then propose topics, upvote topics, and edit or delete their own topics. All changes are visible to every participant in the session.

---

## Use Cases Addressed

| ID | Name | Actor |
|---|---|---|
| UC-09 | Join Session via Link or Code | Participant |
| UC-10 | Propose Topic | Participant |
| UC-11 | Upvote Topic | Participant |
| UC-05 (partial) | Edit / Delete Own Topic | Participant |

---

## Architecture Overview (Clean Architecture)

```
public/
  join.html           ← Enter session code + display name to join
  session.html        ← Live participant view: topics list, propose, upvote

src/core/
  domain/
    topic.entity.ts         ← Topic domain entity (id, sessionId, title, description, status, upvoteCount, upvotedBy[], proposedBy)
    participant.entity.ts   ← Participant domain entity (id, sessionId, name, linkedInUrl)
  interfaces/
    topic.repository.interface.ts
    participant.repository.interface.ts
  commands/
    join-session.command.ts
    propose-topic.command.ts
    upvote-topic.command.ts
    edit-topic.command.ts
    delete-topic.command.ts
  use-cases/
    sessions/
      get-session-by-code.use-case.ts   ← resolve session from join code (public)
    topics/
      propose-topic.use-case.ts
      upvote-topic.use-case.ts
      edit-topic.use-case.ts
      delete-topic.use-case.ts
      get-session-topics.use-case.ts
    participants/
      join-session.use-case.ts

src/infra/
  schemas/
    topic.schema.ts
    participant.schema.ts
  repositories/
    topic.repository.ts
    participant.repository.ts

src/web/
  sessions/
    dto/
      session-by-code.dto.ts       ← { joinCode: string }
  topics/
    topics.controller.ts
    topics.module.ts
    dto/
      propose-topic.dto.ts
      upvote-topic.dto.ts
      edit-topic.dto.ts
      delete-topic.dto.ts
      topic-response.dto.ts
  participants/
    participants.controller.ts
    participants.module.ts
    dto/
      join-session.dto.ts
      participant-response.dto.ts
```

---

## API Endpoints

### Sessions (existing module, new endpoint)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/sessions/by-code` | None | Resolve session from join code |

### Topics (new module)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/topics/propose` | None | Propose a new topic |
| POST | `/topics/upvote` | None | Upvote a topic |
| POST | `/topics/edit` | None | Edit own topic (verifies proposedBy) |
| POST | `/topics/delete` | None | Delete own topic (verifies proposedBy) |
| GET  | `/topics/by-session/:sessionId` | None | List all topics for a session |

### Participants (new module)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/participants/join` | None | Join session; creates participant record; returns participantId |

---

## Domain Models

### TopicEntity
```typescript
enum TopicStatus { Todo = 'Todo', Active = 'Active', Done = 'Done' }

class TopicEntity {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  proposedBy: string;       // participantId
  upvoteCount: number;
  upvotedBy: string[];      // participantIds that already voted
  status: TopicStatus;
  createdAt: Date;
}
```

### ParticipantEntity
```typescript
class ParticipantEntity {
  id: string;
  sessionId: string;
  name: string;
  linkedInUrl?: string;
  createdAt: Date;
}
```

---

## Business Rules

1. **Join**: Any visitor can join a session by entering a valid join code and a display name.
2. **Propose**: Any participant (with a valid `participantId`) can add topics to a session.
3. **Upvote**: Each participant may vote for a topic at most once. Total votes per participant across the session must not exceed `session.maxUpvotesPerParticipant`.
4. **Edit**: A participant may only edit topics they proposed (`topic.proposedBy === participantId`).
5. **Delete**: A participant may only delete topics they proposed.

---

## Frontend Flow

```
/join.html
  └─ POST /sessions/by-code  (validate code)
  └─ POST /participants/join  (create participant)
  └─ Store { sessionId, sessionTitle, participantId, participantName } in sessionStorage
  └─ Redirect → /session.html

/session.html
  └─ Load topics: GET /topics/by-session/:sessionId
  └─ Propose topic: POST /topics/propose
  └─ Upvote topic:  POST /topics/upvote
  └─ Edit topic:    POST /topics/edit   (only own topics)
  └─ Delete topic:  POST /topics/delete (only own topics)
  └─ Poll every 5 seconds to refresh topic list (WebSocket can be added later)
```

---

## Future Enhancements

- WebSocket real-time updates via NestJS Gateway (`socket.io`) so all participants see changes instantly without polling.
- Organizer controls: promote topic to Active, mark Done, export session.
- Rate-limiting on upvote and propose endpoints.
- Optionally require a login for participants (currently anonymous join is supported).
