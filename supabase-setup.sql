-- Basel Hub Database Setup
-- Run this in your Supabase SQL Editor

-- Conversations table (AI chat history)
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'basel',
  persona TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Memories table (for each AI to remember about user)
CREATE TABLE IF NOT EXISTS ai_memories (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'basel',
  persona TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'basel',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  color TEXT DEFAULT '#1e40af',
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys wallet (user's own keys)
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'basel',
  name TEXT NOT NULL,
  service TEXT NOT NULL,
  key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table (10 slots for URLs)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'basel',
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  slot INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizer items (tasks, events, reminders)
CREATE TABLE IF NOT EXISTS organizer_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'basel',
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  time TIME,
  priority TEXT DEFAULT 'medium',
  completed BOOLEAN DEFAULT FALSE,
  repeat_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Passwords table (encrypted)
CREATE TABLE IF NOT EXISTS passwords (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'basel',
  title TEXT NOT NULL,
  username TEXT,
  password TEXT NOT NULL,
  website TEXT,
  notes TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents table (custom AI agents)
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'basel',
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  model TEXT NOT NULL,
  tools JSONB DEFAULT '[]',
  api_keys JSONB DEFAULT '[]',
  temperature FLOAT DEFAULT 0.7,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Income Ideas table
CREATE TABLE IF NOT EXISTS income_ideas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'basel',
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  potential_income TEXT,
  effort_level TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'idea',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_memories_user_persona ON ai_memories(user_id, persona);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_organizer_user ON organizer_items(user_id);
CREATE INDEX IF NOT EXISTS idx_passwords_user ON passwords(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_user ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_income_ideas_user ON income_ideas(user_id);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_ideas ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for service role)
CREATE POLICY "Allow all for service role" ON conversations FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON ai_memories FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON notes FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON api_keys FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON organizer_items FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON passwords FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON agents FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON income_ideas FOR ALL USING (true);

-- Done!
SELECT 'Basel Hub database setup complete!' AS status;
