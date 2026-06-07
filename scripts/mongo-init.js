// scripts/mongo-init.js
// Executed once by MongoDB on first container boot.
// Creates the application user with read/write access to the lean_convo database.

db = db.getSiblingDB('lean_convo');

db.createUser({
  user: 'lean_user',
  pwd: 'lean_pass',
  roles: [{ role: 'readWrite', db: 'lean_convo' }],
});

// Create initial indexes required by the application.
db.sessions.createIndex({ shareCode: 1 }, { unique: true });
db.topics.createIndex({ sessionId: 1 });
db.participants.createIndex({ sessionId: 1 });
db.users.createIndex({ email: 1 }, { unique: true });

print('lean_convo database and user initialised.');
