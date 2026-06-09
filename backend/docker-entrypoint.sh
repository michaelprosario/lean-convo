#!/bin/sh
set -e

# If MONGODB_URI is not set, dynamically build it from components
if [ -z "$MONGODB_URI" ]; then
  echo "MONGODB_URI is not set. Constructing from discrete parameters..."
  
  HOST="${MONGO_HOST:-localhost}"
  PORT_NUM="${MONGO_PORT:-27017}"
  DB="${MONGO_DB:-lean_convo}"
  
  if [ -n "$MONGO_USER" ] && [ -n "$MONGO_PASSWORD" ]; then
    AUTH="${MONGO_USER}:${MONGO_PASSWORD}@"
  else
    AUTH=""
  fi
  
  QUERY=""
  if [ -n "$MONGO_AUTH_SOURCE" ]; then
    QUERY="?authSource=${MONGO_AUTH_SOURCE}"
  elif [ -n "$MONGO_USER" ]; then
    QUERY="?authSource=${DB}"
  fi
  
  export MONGODB_URI="mongodb://${AUTH}${HOST}:${PORT_NUM}/${DB}${QUERY}"
  
  # Hide credentials when printing to logs
  if [ -n "$MONGO_USER" ]; then
    echo "Constructed MONGODB_URI: mongodb://${MONGO_USER}:****@${HOST}:${PORT_NUM}/${DB}${QUERY}"
  else
    echo "Constructed MONGODB_URI: mongodb://${HOST}:${PORT_NUM}/${DB}${QUERY}"
  fi
else
  echo "Using existing MONGODB_URI configuration."
fi

# Run the CMD
exec "$@"
