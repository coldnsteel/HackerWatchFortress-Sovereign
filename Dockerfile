# STAGE 1: Builder (Fetch deps, no dilution)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# STAGE 2: Runner (Non-root, air-gapped)
FROM node:22-alpine
LABEL maintainer="Captain Sovereign"
LABEL description="Sovereign E.I. Observability - Local/Read-Only"
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 3000
CMD ["node", "server.js"]
