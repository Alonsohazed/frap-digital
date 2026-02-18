-- Schema for Cloudflare D1 Database
-- FRAP Digital - Rescate Ensenada

-- FRAPs table
CREATE TABLE IF NOT EXISTS fraps (
    id TEXT PRIMARY KEY,
    folio TEXT UNIQUE,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_by_name TEXT NOT NULL
);

-- Folio sequence table
CREATE TABLE IF NOT EXISTS folio_sequence (
    id INTEGER PRIMARY KEY,
    next_folio INTEGER NOT NULL DEFAULT 1000
);

-- Initialize folio sequence
INSERT OR IGNORE INTO folio_sequence (id, next_folio) VALUES (1, 1000);

-- Create index for faster folio lookups
CREATE INDEX IF NOT EXISTS idx_fraps_folio ON fraps(folio);
CREATE INDEX IF NOT EXISTS idx_fraps_created_by ON fraps(created_by);
CREATE INDEX IF NOT EXISTS idx_fraps_created_at ON fraps(created_at);
