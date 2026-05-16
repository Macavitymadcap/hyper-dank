ALTER TABLE walks ADD COLUMN user_id TEXT NOT NULL DEFAULT 'local-user';

CREATE INDEX IF NOT EXISTS idx_walks_user_id_created_at ON walks(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS invitations (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'revoked')),
  invited_by_user_id TEXT NOT NULL,
  accepted_by_user_id TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  accepted_at TEXT,
  revoked_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);
