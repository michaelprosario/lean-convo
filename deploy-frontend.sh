#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Project root paths
PROJECT_ROOT="/workspaces/lean-convo"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"
BACKEND_PUBLIC="$BACKEND_DIR/public"
BACKEND_BACKUP="$BACKEND_DIR/public_prototype_backup"
FRONTEND_DIST="$FRONTEND_DIR/dist/frontend/browser"

echo "=== Starting Co-located Front-End Deployment (Strategy A) ==="

# 1. Build the Angular project
echo "--> Navigating to frontend directory..."
cd "$FRONTEND_DIR"

echo "--> Installing frontend dependencies..."
npm install

echo "--> Compiling production build of Angular application..."
npm run build

# Verify build output exists
if [ ! -d "$FRONTEND_DIST" ]; then
  echo "Error: Angular build output directory not found at $FRONTEND_DIST" >&2
  exit 1
fi

# 2. Backup old prototype code (only if backup does not already exist)
if [ -d "$BACKEND_PUBLIC" ]; then
  if [ ! -d "$BACKEND_BACKUP" ]; then
    echo "--> Backing up prototype frontend pages to $BACKEND_BACKUP..."
    cp -r "$BACKEND_PUBLIC" "$BACKEND_BACKUP"
  else
    echo "--> Backup folder $BACKEND_BACKUP already exists. Skipping backup."
  fi
fi

# 3. Clear public folder
echo "--> Clearing old public folder assets..."
mkdir -p "$BACKEND_PUBLIC"
rm -rf "${BACKEND_PUBLIC:?}"/*

# 4. Copy build assets over
echo "--> Copying compiled Angular production bundle to NestJS public folder..."
cp -r "$FRONTEND_DIST"/* "$BACKEND_PUBLIC/"

echo "=== Front-end deployment completed successfully! ==="
echo "The modern Angular app will now be served by NestJS at the root URL (/). "
echo "Old prototype files have been backed up in $BACKEND_BACKUP."
