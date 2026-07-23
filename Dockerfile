# Production image for the Ukstylishclub Management console (Next.js standalone).
# Runs on any container host — Render, Railway, Fly, or plain Docker.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Bind to all interfaces — the Next.js standalone server otherwise listens on
# localhost inside the container, which the host's router can't reach (502).
ENV HOSTNAME=0.0.0.0
# Standalone output bundles a minimal server + only the deps it needs.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
