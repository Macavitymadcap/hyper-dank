CREATE TABLE IF NOT EXISTS walks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  miles REAL NOT NULL CHECK (miles > 0),
  minutes INTEGER NOT NULL CHECK (minutes >= 0),
  seconds INTEGER NOT NULL CHECK (seconds >= 0 AND seconds < 60),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CHECK (minutes > 0 OR seconds > 0)
);
