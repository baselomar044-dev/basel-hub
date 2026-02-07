import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bfbsitiqmnhehhyxqkrn.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmYnNpdGlxbW5oZWhoeXhxa3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2ODAzNDksImV4cCI6MjA4MTI1NjM0OX0.Xj80cpsgb94qMnuO0aFLGMrlS0wI6-i72ZI5W1DqK-o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface UserProfile {
  id: string
  name: string
  email?: string
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  persona_id: string
  title: string
  messages: any[]
  created_at: string
  updated_at: string
}

export interface AIMemory {
  id: string
  user_id: string
  persona_id: string
  facts: string[]
  preferences: string[]
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface ApiKey {
  id: string
  user_id: string
  name: string
  service: string
  key: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  url: string
  description?: string
  created_at: string
  updated_at: string
}

export interface OrganizerItem {
  id: string
  user_id: string
  category: 'task' | 'event' | 'reminder'
  title: string
  description?: string
  date?: string
  time?: string
  is_completed: boolean
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

export interface Password {
  id: string
  user_id: string
  service: string
  username: string
  password: string
  url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  user_id: string
  name: string
  description: string
  system_prompt: string
  model: string
  tools: string[]
  api_keys: string[]
  created_at: string
  updated_at: string
}

// Database Schema SQL (run this in Supabase SQL Editor)
export const DB_SCHEMA = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile (extends Supabase auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'basel',
  persona_id TEXT NOT NULL,
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Memories table
CREATE TABLE IF NOT EXISTS ai_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'basel',
  persona_id TEXT NOT NULL UNIQUE,
  facts TEXT[] DEFAULT '{}',
  preferences TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'basel',
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys wallet (user's saved keys)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'basel',
  name TEXT NOT NULL,
  service TEXT NOT NULL,
  key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'basel',
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizer items
CREATE TABLE IF NOT EXISTS organizer_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'basel',
  category TEXT NOT NULL CHECK (category IN ('task', 'event', 'reminder')),
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  time TIME,
  is_completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Passwords table
CREATE TABLE IF NOT EXISTS passwords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'basel',
  service TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'basel',
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  model TEXT DEFAULT 'gemini-1.5-flash',
  tools TEXT[] DEFAULT '{}',
  api_keys TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Income ideas table
CREATE TABLE IF NOT EXISTS income_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'basel',
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  potential_income TEXT,
  effort_level TEXT,
  status TEXT DEFAULT 'idea',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies (disable for now since we use single user)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_ideas ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (single user app)
CREATE POLICY "Allow all" ON conversations FOR ALL USING (true);
CREATE POLICY "Allow all" ON ai_memories FOR ALL USING (true);
CREATE POLICY "Allow all" ON notes FOR ALL USING (true);
CREATE POLICY "Allow all" ON api_keys FOR ALL USING (true);
CREATE POLICY "Allow all" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all" ON organizer_items FOR ALL USING (true);
CREATE POLICY "Allow all" ON passwords FOR ALL USING (true);
CREATE POLICY "Allow all" ON agents FOR ALL USING (true);
CREATE POLICY "Allow all" ON income_ideas FOR ALL USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_persona ON conversations(persona_id);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_organizer_date ON organizer_items(date);
`

// Helper functions
export async function initializeDatabase() {
  // This would be run in Supabase SQL editor
  console.log('Database schema:', DB_SCHEMA)
}

export async function saveData(table: string, data: any) {
  const { error } = await supabase.from(table).upsert(data)
  if (error) throw error
}

export async function loadData(table: string, userId = 'basel') {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function deleteData(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}
