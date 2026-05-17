FROM oven/bun:1.3.0-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1.3.0-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY . .
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production

CMD ["bun", "run", "start"]
