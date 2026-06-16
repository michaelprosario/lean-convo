# Backend WebSocket Plan (Topics)

## Goal

Add a NestJS WebSocket gateway for real-time topic collaboration so these operations no longer depend on polling:
- `topics/propose`
- `topics/upvote`
- `topics/edit`
- `topics/delete`
- `topics/by-session`
- `topics/organizer/edit`
- `topics/organizer/set-status`
- `topics/organizer/delete`

Keep existing clean architecture boundaries by reusing current commands and use cases.

---

## Current State

- Topic mutations and reads are currently HTTP endpoints in `TopicsController`.
- Topic rules already live in core use cases (`ProposeTopicUseCase`, `UpvoteTopicUseCase`, etc.).
- Organizer actions use JWT (`JwtAuthGuard` in HTTP).
- Participant actions currently use `participantId` from request DTOs.
- Frontend appears to rely on polling for `topics/by-session` updates.

This is a good fit for adding a gateway at the web layer while leaving domain logic unchanged.

---

## Proposed Architecture

## 1) New WebSocket module and gateway

Add a new module under the web layer:
- `src/web/topics-realtime/topics-realtime.module.ts`
- `src/web/topics-realtime/topics.gateway.ts`
- `src/web/topics-realtime/dto/*.ts`

Gateway shape:
- `@WebSocketGateway({ namespace: '/topics', cors: { origin: true, credentials: true } })`
- Transport: Socket.IO (Nest default for gateways with `@nestjs/platform-socket.io`).
- Rooms: one room per session, naming convention `session:<sessionId>`.

## 2) Room-based subscription model

Introduce subscription events:
- Client emits `topics/subscribe` with `{ sessionId, participantId? }`.
- Server validates session access and calls `client.join('session:<sessionId>')`.
- Server returns initial snapshot (replacement for first call to `topics/by-session`).

Optional companion event:
- `topics/unsubscribe` with `{ sessionId }`.

## 3) Event mapping for existing operations

Map each current HTTP action to a gateway event that calls the same use case.

Participant-level events:
- `topics/propose`
- `topics/upvote`
- `topics/edit`
- `topics/delete`

Organizer-only events:
- `topics/organizer/edit`
- `topics/organizer/set-status`
- `topics/organizer/delete`

Read event (replacing HTTP list behavior in real-time flow):
- `topics/by-session` event or `topics/request-snapshot` event.

Recommended naming for clarity:
- Keep compatibility aliases matching existing endpoint names.
- Add internal canonical names later (for example `topics:propose`, `topics:updated`) if desired.

---

## Auth and Authorization Strategy

## 1) Organizer auth

For organizer events, require JWT in socket handshake:
- `handshake.auth.token` or `Authorization` header.
- Validate with `JwtService` and same secret used by `JwtStrategy`.
- Attach user context to `client.data.user`.

For organizer mutations:
- Ignore organizer id from client payload.
- Use `client.data.user.userId` when creating organizer commands.
- Keep ownership checks in existing use cases.

## 2) Participant auth (short-term)

Short-term to match current behavior:
- Continue accepting `participantId` in event payload.
- Use existing use-case validation (participant exists, belongs to session, owns topic, vote limits).

Recommended next step (hardening):
- Issue participant session tokens on `participants/join`.
- Validate participant token at socket level for participant events.
- Stop trusting raw participant ids from payload.

---

## Event Contract Design

Use request/response + broadcast pattern.

## 1) Client request envelope

Example:
- `{ requestId, payload }`

`requestId` allows caller correlation and easier UI reconciliation.

## 2) Ack response envelope

Example:
- Success: `{ requestId, success: true, data }`
- Failure: `{ requestId, success: false, errorMessage }`

Match existing `AppResult` semantics so UI behavior stays consistent.

## 3) Broadcast events

After successful mutation, emit to room `session:<sessionId>`:
- `topics/updated` with one of:
  - full ordered list (simple, robust)
  - delta payload (`type`, `topic`, `topicId`) (lighter, more complex)

Recommended v1:
- Broadcast full ordered list using existing `GetSessionTopicsUseCase`.
- Optimize to deltas only if needed.

---

## Use Case Integration (No Domain Rewrite)

Gateway should remain an orchestration layer only:
- Convert incoming DTO -> existing command.
- Execute existing use case.
- Convert entity -> existing response DTO shape.
- Emit room broadcast if mutation succeeds.

This keeps core logic unchanged and avoids duplicated business rules.

---

## Files to Add or Update

## New dependencies (backend)

Add to `backend/package.json` dependencies:
- `@nestjs/websockets`
- `@nestjs/platform-socket.io`
- `socket.io`

(Optional for type support):
- `@types/socket.io` if needed by tooling.

## Backend files

Add:
- `src/web/topics-realtime/topics-realtime.module.ts`
- `src/web/topics-realtime/topics.gateway.ts`
- `src/web/topics-realtime/dto/` (event DTOs)
- `src/web/topics-realtime/auth/ws-jwt.service.ts` (or guard/interceptor equivalent)

Update:
- `src/app.module.ts` to import `TopicsRealtimeModule`.
- Potentially `src/main.ts` CORS setup if socket origin settings need explicit config.

No required changes to:
- core commands
- core use cases
- repositories

---

## Rollout Plan

## Phase 1: Introduce gateway with dual-path support

- Add WebSocket gateway while keeping all HTTP endpoints.
- Keep frontend working as-is.
- Add a small test client to verify event flow.

## Phase 2: Switch UI from polling to sockets

- On session screen, connect to `/topics` namespace.
- Subscribe to `session:<id>` room.
- Replace polling loop for `topics/by-session` with:
  - initial snapshot event
  - `topics/updated` broadcast handling.

## Phase 3: Migrate mutations to socket events

- Move propose/upvote/edit/delete flows to socket emits.
- Move organizer edit/set-status/delete to socket emits.
- Keep HTTP routes as fallback during stabilization.

## Phase 4: Harden participant identity

- Introduce participant token issuance and validation.
- Require participant token on participant mutation events.
- Deprecate trusting raw `participantId` from payload.

## Phase 5: Optional cleanup

- Mark legacy topic HTTP mutation endpoints deprecated.
- Keep a read-only HTTP fallback if desired.

---

## Error Handling and Reliability

- Return per-event ack with `success/errorMessage` (no silent failures).
- Emit only after successful mutation persistence.
- Normalize not-found/forbidden error messages to avoid leaking sensitive details.
- Handle disconnect/reconnect by re-subscribing room and requesting snapshot.

Potential enhancement:
- Add idempotency handling for repeated client retries via `requestId`.

---

## Testing Plan

## Unit tests

- Gateway handler tests for each event:
  - valid payload executes expected use case
  - invalid payload returns failure ack
  - success triggers room broadcast


## Non-functional checks

- Verify multiple clients in same room receive updates.
- Verify other session rooms do not receive cross-session events.

---

## Risks and Mitigations

- Risk: mixed HTTP + socket state drift.
- Mitigation: broadcast canonical list from server after each mutation.

- Risk: participant spoofing with plain `participantId`.
- Mitigation: participant tokens in hardening phase.

- Risk: extra load from full-list broadcasts.
- Mitigation: start with full list for correctness, optimize to deltas later.

---

## Suggested First Increment (Practical)

Implement this first:
1. Add gateway with `topics/subscribe`, `topics/request-snapshot`, and `topics/propose`.
2. Broadcast `topics/updated` full list on successful propose.
3. Keep all HTTP endpoints unchanged.
4. Validate with two browser clients in same session.

Once stable, add upvote/edit/delete and organizer events in the same pattern.
