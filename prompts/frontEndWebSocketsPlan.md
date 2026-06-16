# Front-End WebSockets Plan (Angular)

## Goal

Migrate the Angular session experience from polling + HTTP topic mutations to Socket.IO-based real-time updates that align with the backend gateway in [prompts/backendWebSocket.md](prompts/backendWebSocket.md).

Targeted operations:
- `topics/propose`
- `topics/upvote`
- `topics/edit`
- `topics/delete`
- `topics/by-session` (as snapshot request)
- `topics/organizer/edit`
- `topics/organizer/set-status`
- `topics/organizer/delete`

Preserve existing UX while reducing refresh lag and duplicate manual reload calls.

---

## Current Angular State (What changes)

Current frontend implementation relies on HTTP endpoints in [frontend/src/app/core/services/topic.service.ts](frontend/src/app/core/services/topic.service.ts) and polling in [frontend/src/app/core/services/polling.service.ts](frontend/src/app/core/services/polling.service.ts):
- Participant page starts a 10-second polling loop in [frontend/src/app/features/sessions/participant-session/participant-session.component.ts](frontend/src/app/features/sessions/participant-session/participant-session.component.ts).
- Organizer page manually reloads topics after each mutation in [frontend/src/app/features/sessions/organizer-session/organizer-session.component.ts](frontend/src/app/features/sessions/organizer-session/organizer-session.component.ts).

This should be replaced by:
- a single shared socket connection for topic events,
- room subscription by session id,
- server push updates (`topics/updated`) after each mutation.

---

## Proposed Angular Architecture

## 1) Add a dedicated realtime service

Create a new service:
- `frontend/src/app/core/services/topics-realtime.service.ts`

Responsibilities:
- Initialize Socket.IO client for namespace `/topics`.
- Include auth token in handshake for organizer actions.
- Join and leave session room via `topics/subscribe` / `topics/unsubscribe`.
- Expose reactive topic state (`signal<Topic[]>` or RxJS `BehaviorSubject<Topic[]>`).
- Listen for `topics/updated` broadcasts and update local state.
- Provide request/ack wrappers for mutation events with `requestId` correlation.

Recommended model:
- Keep service state as Angular signals for consistency with existing components.
- Use one active session socket binding at a time.

---

## 2) Realtime request/ack contract in frontend

Backend expects envelope:
- `{ requestId, payload }`

Backend responds with ack:
- success: `{ requestId, success: true, data }`
- failure: `{ requestId, success: false, errorMessage }`

Frontend should standardize this with types:
- `SocketEnvelope<TPayload>`
- `SocketAck<TData>`

And helper:
- `emitWithAck(eventName, payload): Promise<SocketAck<T>>`

This keeps mutation handling similar to current HTTP `AppResult` flow.

---

## 3) Session room lifecycle

On entering participant/organizer session page:
1. connect to `/topics` namespace,
2. emit `topics/subscribe` with `{ sessionId, participantId? }`,
3. use returned snapshot as initial topics list.

On leaving component (`ngOnDestroy`):
1. emit `topics/unsubscribe`,
2. disconnect socket if no session page remains active.

Reconnect behavior:
- on reconnect, auto re-subscribe and request snapshot (`topics/request-snapshot`).

---

## Frontend File Changes

## 1) Dependencies and configuration

### `frontend/package.json`
Add dependency:
- `socket.io-client`

### `frontend/proxy.conf.json`
Keep existing `/topics` proxy for HTTP fallback.
For WebSocket dev proxy with Angular CLI, add websocket support on `/socket.io` route (Socket.IO transport path), for example:
- `/socket.io`: target backend, `ws: true`, `secure: false`, `changeOrigin: true`

Note:
- Namespace `/topics` still uses Socket.IO transport at `/socket.io` under the hood.

---

## 2) New models/types

Create:
- `frontend/src/app/core/models/topics-realtime.types.ts`

Suggested types:
- `SocketEnvelope<TPayload>`
- `SocketAck<TData>`
- `TopicsUpdatedEvent` (matching payload from backend `topics/updated`)

Optional:
- typed payload interfaces for each event (`ProposeTopicPayload`, etc.) to avoid duplicated inline object typing.

---

## 3) New realtime service

Create:
- `frontend/src/app/core/services/topics-realtime.service.ts`

Service API (suggested):
- `connect(sessionId: string, participantId?: string): Promise<SocketAck<Topic[]>>`
- `disconnect(sessionId?: string): void`
- `requestSnapshot(sessionId: string, participantId?: string): Promise<SocketAck<Topic[]>>`
- `proposeTopic(payload): Promise<SocketAck<Topic>>`
- `upvoteTopic(payload): Promise<SocketAck<Topic>>`
- `editTopicByParticipant(payload): Promise<SocketAck<Topic>>`
- `deleteTopic(payload): Promise<SocketAck<void>>`
- `editTopicByOrganizer(payload): Promise<SocketAck<Topic>>`
- `setTopicStatusByOrganizer(payload): Promise<SocketAck<Topic>>`
- `deleteTopicByOrganizer(payload): Promise<SocketAck<void>>`
- `readonly topics = signal<Topic[]>([])`
- `readonly connectionState = signal<'disconnected' | 'connecting' | 'connected'>('disconnected')`

Implementation notes:
- Pull JWT from sessionStorage (`accessToken`) and pass via `auth: { token: 'Bearer ...' }`.
- Maintain incremental `requestId` counter or UUID for ack correlation.
- Register listener for `topics/updated` once per socket instance.

---

## 4) Update participant session component

File:
- [frontend/src/app/features/sessions/participant-session/participant-session.component.ts](frontend/src/app/features/sessions/participant-session/participant-session.component.ts)

Changes:
- Replace `PollingService` usage with `TopicsRealtimeService`.
- Remove `startPolling`, `stopPolling`, and manual `forceRefresh` dependence.
- On init:
  - connect + subscribe using `sessionId` and `participantId`.
  - set topics from subscribe/snapshot result.
- Mutations (`addTopic`, `upvoteTopic`, `saveEdit`, `deleteTopic`):
  - emit socket event,
  - rely on `topics/updated` push for list refresh.
- Keep existing computed values (`orderedTopics`, `votesUsed`, `votesRemaining`) but source from realtime service state.

Optional UX enhancement:
- show connection badge (`Live`, `Reconnecting`, `Offline`).

---

## 5) Update organizer session component

File:
- [frontend/src/app/features/sessions/organizer-session/organizer-session.component.ts](frontend/src/app/features/sessions/organizer-session/organizer-session.component.ts)

Changes:
- Connect to realtime service on init (sessionId only is enough).
- Subscribe to room and bind `topics` from realtime signal.
- Replace mutation calls in organizer topic actions with socket emissions:
  - `topics/organizer/edit`
  - `topics/organizer/set-status`
  - `topics/organizer/delete`
- Remove `loadTopics()` calls after each mutation (updates arrive via `topics/updated`).
- Keep export and session metadata edit via HTTP for now (no backend socket events for these yet).

---

## 6) Topic service strategy

File:
- [frontend/src/app/core/services/topic.service.ts](frontend/src/app/core/services/topic.service.ts)

Migration recommendation:
- Keep HTTP methods temporarily as fallback.
- Add comments or deprecation note for topic mutations once socket path is stable.
- Eventually split responsibilities:
  - `TopicHttpService` for non-realtime endpoints,
  - `TopicsRealtimeService` for live topic interactions.

---

## Rollout Plan (Frontend)

## Phase A: Foundation

1. Add `socket.io-client` and websocket proxy update.
2. Add realtime models and `TopicsRealtimeService`.
3. Implement connect/subscribe/snapshot + `topics/updated` listener.

## Phase B: Participant migration

1. Migrate participant page to realtime state.
2. Switch participant propose/upvote/edit/delete to socket emits.
3. Remove polling dependency from participant page.

## Phase C: Organizer migration

1. Migrate organizer page topic list to realtime state.
2. Switch organizer topic mutations to socket emits.
3. Remove post-mutation full HTTP reload calls.

## Phase D: Cleanup

1. Remove unused polling service if no longer referenced.
2. Keep HTTP fallback behind feature flag or temporary branch window.
3. Update docs and QA checklist.

---

## Error Handling and UX Rules

- Any failed ack should surface `errorMessage` exactly where current HTTP errors are shown.
- Mutations should disable relevant action buttons until ack returns.
- On disconnect:
  - keep latest known topic list visible,
  - show non-blocking reconnect status,
  - retry subscribe/snapshot automatically after reconnect.
- Avoid optimistic topic list mutations initially; prefer server-authoritative updates via `topics/updated`.

---

## Security Notes

- Organizer socket calls depend on JWT handshake token.
- Participant calls still use `participantId` for now (short-term backend model).
- When backend introduces participant tokens, update realtime service handshake/payloads accordingly.

---

## Testing Plan (Angular)

## Unit tests

Add tests for `TopicsRealtimeService`:
- connect + subscribe success path updates topics.
- `topics/updated` event updates topics state.
- ack failure propagates error message.
- reconnect triggers re-subscribe snapshot flow.

Update component tests:
- participant actions call realtime service methods.
- organizer actions call realtime service methods.
- list updates are driven by realtime event stream, not polling.

## Manual validation checklist

1. Open two participant browsers in same session.
2. Propose topic in browser A.
3. Verify browser B updates immediately without refresh.
4. Upvote/edit/delete from one browser and verify synchronized update in the other.
5. Open organizer page and set a topic to `Active`; verify participant view updates immediately.
6. Validate organizer edit/delete topic sync across all connected clients.

---

## Suggested First Frontend Increment

Implement this first to match backend Phase 1:
1. Introduce `TopicsRealtimeService` with `connect`, `topics/subscribe`, `topics/request-snapshot`, and `topics/propose`.
2. Update participant session screen to consume realtime state and remove polling for initial topic load.
3. Keep all other topic actions on HTTP until this path is stable.

After validation, migrate upvote/edit/delete and organizer topic actions in the same pattern.
