# Multi-stage Dockerfile for Talent Acquisition & Retention App

# ==========================================
# Stage 1: Build Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Build Backend
# ==========================================
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm install

COPY backend/ ./
RUN npm run build

# ==========================================
# Stage 3: Production Server
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install production dependencies only
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm install --omit=dev && npx prisma generate

# Copy compiled backend
COPY --from=backend-builder /app/backend/dist ./dist

# Copy built frontend assets to backend static directory
COPY --from=frontend-builder /app/frontend/dist ./dist/public

EXPOSE 4000

CMD ["node", "dist/server.js"]
