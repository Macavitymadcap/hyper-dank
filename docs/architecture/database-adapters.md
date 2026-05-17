# Database Adapters

The template keeps persistence behind `DatabaseProvider`, `WalkRepository`, and
`InviteRepository` contracts in `apps/walking-pace/src/db/model.ts` and
`apps/walking-pace/src/services/invitations/model.ts`. Shared database lifecycle and migration
primitives live in `libs/database`.

## Provider Contract

Every provider should:

- expose a stable `kind`
- run migrations idempotently
- create walk and invitation repositories
- return both repositories from `createRepositories()`
- close owned connections in `close()`

Add provider conformance coverage with `describeDatabaseProviderContract()` from
`apps/walking-pace/src/db/contracts/repository-contracts.ts`.

## Repository Contracts

Walk repositories must:

- return newest walks first
- calculate speed and pace consistently
- return aggregate count, average speed, and median pace
- scope reads and mutations by user id
- report whether delete and clear mutations changed rows
- enforce the database-level walk constraints

Invitation repositories must:

- normalize invitation email addresses
- find only pending invitations by token hash
- transition pending invitations to accepted or revoked states
- leave accepted invitations non-revokable
- count pending invitations consistently

Use `describeWalkRepositoryContract()` and `describeInviteRepositoryContract()` for adapter
conformance. SQLite runs these contracts in-memory by default. Postgres contract suites run when
`TEST_DATABASE_URL` points at a disposable test database.

## Adding An Adapter

1. Implement the provider and repositories behind the existing interfaces.
2. Add migrations for the new backend.
3. Register provider selection in `apps/walking-pace/src/db/providers/provider.ts`.
4. Add focused unit tests for backend-specific mapping or SQL behaviour.
5. Add the shared provider, walk repository, and invitation repository contract suites.
6. Document required environment variables and any local setup script.
