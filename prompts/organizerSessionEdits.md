# Organizer Session Edits Plan

## Goal

Enable organizer-only capabilities for:
- Editing session metadata.
- Editing all session topics (not only own topics).
- Setting topic workflow status (`Todo`, `Active`, `Done`).
- Exporting session and topic details.

This document focuses on both backend and frontend edits while preserving current Clean Architecture boundaries and DTO-first controller responses.

---

## Current State Summary

### What already exists
- Organizer can authenticate and create sessions.
- Organizer can list their own sessions (`/sessions/my-sessions`).
- Participant topic workflows exist (`propose`, `edit own`, `delete own`, `upvote`, `list by session`).
- Topic domain already includes `status` enum with `Todo`, `Active`, and `Done`.

### Gaps for organizer features
- No organizer endpoint to edit an existing session.
- No organizer endpoint to edit any topic by session ownership.
- No organizer endpoint to set topic status explicitly.
- No export endpoint or export UI.
- Dashboard and session UI do not expose organizer management tools.

---

## Backend Edits

## 1) Organizer Edit Session

### New command and use case
- Add `EditSessionCommand` in `src/core/commands/`:
  - `sessionId`
  - `organizerId`
  - `title`
  - `description`
  - `videoLink`
  - `maxUpvotesPerParticipant`

- Add `EditSessionUseCase` in `src/core/use-cases/sessions/`:
  - Load session by `sessionId`.
  - Validate session exists.
  - Validate `session.organizerId === command.organizerId`.
  - Validate required fields and value ranges.
  - Call `sessionRepo.update(...)`.
  - Return `AppResult<SessionEntity>`.

### Web layer
- Add DTO `EditSessionDto` in `src/web/sessions/dto/`.
- Add endpoint in `src/web/sessions/sessions.controller.ts`:
  - `POST /sessions/edit`
  - `@UseGuards(JwtAuthGuard)`
  - Organizer inferred from JWT, not request body.
  - Return `AppResult<SessionResponseDto>`.

### Module wiring
- Register `EditSessionUseCase` in `src/web/sessions/sessions.module.ts`.

---

## 2) Organizer Edit Session Topics

### New command and use case
- Add `OrganizerEditTopicCommand` in `src/core/commands/`:
  - `topicId`
  - `organizerId`
  - `title`
  - `description`

- Add `OrganizerEditTopicUseCase` in `src/core/use-cases/topics/`:
  - Load topic by `topicId`.
  - Validate topic exists.
  - Load session by `topic.sessionId`.
  - Validate `session.organizerId === command.organizerId`.
  - Update topic fields.
  - Return `AppResult<TopicEntity>`.

### Web layer
- Add DTO `OrganizerEditTopicDto` in `src/web/topics/dto/`.
- Add endpoint in `src/web/topics/topics.controller.ts`:
  - `POST /topics/organizer/edit`
  - `@UseGuards(JwtAuthGuard)`
  - Uses organizer id from JWT.
  - Return `AppResult<TopicResponseDto>`.

### Why separate from participant edit
Keep organizer topic editing separate from participant self-edit to preserve explicit authorization boundaries and avoid mixing business rules in one endpoint.

---

## 3) Organizer Set Topic Status

### New command and use case
- Add `SetTopicStatusCommand` in `src/core/commands/`:
  - `topicId`
  - `organizerId`
  - `status` (`Todo | Active | Done`)

- Add `SetTopicStatusUseCase` in `src/core/use-cases/topics/`:
  - Load topic by id.
  - Load owning session.
  - Validate organizer ownership.
  - Validate status value.
  - Optional policy: enforce only one `Active` topic per session.
  - Persist status update.
  - Return `AppResult<TopicEntity>`.

### Web layer
- Add DTO `SetTopicStatusDto` in `src/web/topics/dto/`.
- Add endpoint in `src/web/topics/topics.controller.ts`:
  - `POST /topics/organizer/set-status`
  - `@UseGuards(JwtAuthGuard)`
  - Return `AppResult<TopicResponseDto>`.

---

## 4) Organizer Export Session and Topic Details

### Export format recommendation
Start with CSV for v1:
- Easy to generate and test.
- Works for spreadsheets and reporting.
- No extra heavy dependencies.

### New query/use case
- Add `ExportSessionDetailsUseCase` in `src/core/use-cases/sessions/`:
  - Input: `sessionId`, `organizerId`.
  - Validate ownership.
  - Load session + all topics.
  - Return export-ready model (structured object, not raw string).

### Web layer
Two clean options:

1. API-first JSON export (recommended first)
- `GET /sessions/:sessionId/export`
- Guarded by JWT.
- Returns `AppResult<SessionExportResponseDto>` including metadata + topics.
- Frontend converts JSON to CSV and downloads.

2. Direct file response (second phase)
- `GET /sessions/:sessionId/export.csv`
- Guarded by JWT.
- Returns `text/csv` attachment.

Recommended rollout:
- Implement option 1 first for predictable DTO behavior.
- Add option 2 later if direct CSV endpoint is preferred.

### Suggested `SessionExportResponseDto`
- `session`: `{ id, title, description, joinCode, videoLink, maxUpvotesPerParticipant, createdAt }`
- `topics`: `[{ id, title, description, status, upvoteCount, proposedBy, createdAt }]`
- `generatedAt`

---

## Authorization and Security Rules

- All organizer management endpoints require `JwtAuthGuard`.
- Organizer identity always sourced from JWT (`req.user.userId`).
- Never trust organizer id sent from client payload.
- Ownership checks happen in core use cases (not only controller layer).
- Export endpoints should return generic not-found/forbidden messaging (do not leak session ownership details).

---

## Frontend Edits

## 1) Dashboard Enhancements

In `public/dashboard.html`:
- Add "Manage" button per session card, linking to organizer session page:
  - Example route: `/session.html?mode=organizer&sessionId=<id>`
- Keep current "Join" button for participant-style preview if needed.

## 2) Organizer Session View

Reuse `public/session.html` with organizer mode branching or create dedicated `public/organizer-session.html`.

Recommended approach: dedicated page for clarity.

### Organizer page capabilities
- Session metadata panel (title, description, video link, vote limit) with inline edit + save.
- Topic table/cards showing:
  - title
  - description
  - votes
  - status badge
  - proposed by
- Organizer actions per topic:
  - Edit topic
  - Set status (`Todo`, `Active`, `Done`)
- Export actions:
  - `Export JSON`
  - `Export CSV`

### Client API calls
- `POST /sessions/edit`
- `POST /topics/organizer/edit`
- `POST /topics/organizer/set-status`
- `GET /topics/by-session/:sessionId`
- `GET /sessions/:sessionId/export` (or CSV route later)

### UX details
- Disable save buttons while requests are in flight.
- Show success/error alerts near modified section.
- Optimistic status updates are optional; safe default is refresh after mutation.
- Keep responsive layout for desktop and mobile.

---

## DTO and Endpoint Additions (Summary)

### Sessions DTOs
- `edit-session.dto.ts`
- `session-export-response.dto.ts`

### Topics DTOs
- `organizer-edit-topic.dto.ts`
- `set-topic-status.dto.ts`

### New/updated endpoints
- `POST /sessions/edit` (new)
- `GET /sessions/:sessionId/export` (new)
- `POST /topics/organizer/edit` (new)
- `POST /topics/organizer/set-status` (new)

---

## Testing Plan

## Core unit tests (Jest + ts-mockito)
- `edit-session.use-case.spec.ts`
- `organizer-edit-topic.use-case.spec.ts`
- `set-topic-status.use-case.spec.ts`
- `export-session-details.use-case.spec.ts`

### Critical test scenarios
- Organizer can edit own session.
- Organizer cannot edit another organizer's session.
- Organizer can edit any topic in owned session.
- Organizer cannot edit topic in non-owned session.
- Status transitions validate enum values.
- Export returns full topic list with status and votes.

## Controller-level tests
- Guarded endpoints return 401 without token.
- Successful responses always return DTO shape in `AppResult.data`.

---

## Delivery Plan (Incremental)

1. Backend organizer session edit.
2. Backend organizer topic edit + status update.
3. Backend export JSON endpoint.
4. Organizer UI page with session/topic edits.
5. Add CSV download behavior in frontend.
6. Add automated tests for all new use cases.

This sequencing delivers value quickly while keeping risk low and preserving clean architecture boundaries.

---

## Notes for Future Real-Time Support

When WebSocket support is added, publish organizer actions to session clients:
- `session.updated`
- `topic.updated`
- `topic.status.changed`

This will keep participant and organizer views synchronized without polling.