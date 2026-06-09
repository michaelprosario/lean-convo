# --- Base Node Image ---
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# --- Dependency Installer for Production ---
FROM base AS prod-deps
COPY package*.json ./
RUN npm ci --omit=dev

# --- Builder Stage ---
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Production Runner Stage ---
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3001

# Default environment variables for database configurations
ENV MONGO_HOST=localhost
ENV MONGO_PORT=27017
ENV MONGO_DB=lean_convo
ENV MONGO_USER=""
ENV MONGO_PASSWORD=""
ENV MONGO_AUTH_SOURCE=""

# Allow optional full URI override
ENV MONGODB_URI=""

# Application JWT secret
ENV JWT_SECRET="change-me-in-production-use-a-strong-secret"

# Create application directory and set correct permissions
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
WORKDIR /usr/src/app

# Copy production dependencies, built code, static assets, and entrypoint
COPY --chown=node:node --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/public ./public
COPY --chown=node:node docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh

USER node

EXPOSE 3001

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main"]
