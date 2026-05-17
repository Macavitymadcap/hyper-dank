FROM oven/bun:1.3.0-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/walking-pace/package.json apps/walking-pace/package.json
COPY libs/components/package.json libs/components/package.json
COPY libs/database/package.json libs/database/package.json
COPY libs/http/package.json libs/http/package.json
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1.3.0-alpine

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/walking-pace/package.json apps/walking-pace/package.json
COPY libs/components/package.json libs/components/package.json
COPY libs/database/package.json libs/database/package.json
COPY libs/http/package.json libs/http/package.json
RUN bun install --frozen-lockfile --production

COPY . .
COPY --from=build /app/apps/walking-pace/dist ./apps/walking-pace/dist
COPY --from=build /app/libs/components/dist ./libs/components/dist
COPY --from=build /app/libs/database/dist ./libs/database/dist
COPY --from=build /app/libs/http/dist ./libs/http/dist
COPY --from=build /app/storybook-static ./storybook-static

ENV NODE_ENV=production

CMD ["bun", "run", "start"]
