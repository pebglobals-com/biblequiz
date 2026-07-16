ALTER TABLE sermons ADD COLUMN slug TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_sermons_slug ON sermons(slug);
