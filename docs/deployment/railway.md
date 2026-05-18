# Railway Server Deployment Runbook

Hyper-Dank's public site deploys to GitHub Pages, but downstream server apps can still use the
Railway-style deployment pattern demonstrated by the Walking Pace Hono app.

## Supported Server Shape

- Build with the workspace `Dockerfile`.
- Run migrations before traffic with `bun run db:migrate`.
- Start the server with `bun run start`.
- Use `/healthz` as the HTTP health check.
- Seed the first admin with `bun run seed:admin` after deployment variables are configured.

## Environment

Typical server deployments need:

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP port supplied by Railway |
| `DATABASE_URL` | Postgres connection string for production persistence |
| `BETTER_AUTH_SECRET` | Better Auth signing/encryption secret |
| `BETTER_AUTH_URL` | Public base URL for auth and invite links |
| `RESEND_API_KEY` | Invitation email delivery when paired with `EMAIL_FROM` |
| `EMAIL_FROM` | Verified invitation sender address |
| `USER_LIMIT` | Maximum users, including pending invitations |
| `ADMIN_EMAIL` | Email for `bun run seed:admin` |
| `ADMIN_PASSWORD` | Password for `bun run seed:admin` |
| `ADMIN_NAME` | Optional display name for the first admin |

## Example Railway Config

Copy [`railway.example.json`](./railway.example.json) into a server app repository as
`railway.json`, then adjust service-specific variables in Railway.

Hyper-Dank itself does not keep an active root `railway.json` because its production workflow now
publishes static docs, demo, and Storybook through GitHub Pages.
