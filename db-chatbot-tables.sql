-- SELA Cabinets - Chatbot Tables Setup
-- ======================================
-- Run this SQL to create the missing chatbot tables

-- 1. Chatbot Configuration Table
CREATE TABLE IF NOT EXISTS chatbot_config (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Bot identity
  bot_name TEXT DEFAULT 'SELA Cabinets',
  welcome_message TEXT DEFAULT 'Hi, welcome to SELA Cabinets. I can help with service areas, cabinet estimates, timelines, and consultations. How can I help today?',
  system_prompt TEXT DEFAULT 'You are the friendly and helpful assistant for SELA Cabinets, a premium kitchen cabinet company serving Detroit and surrounding areas. Your goal is to help customers learn about our services and capture leads.

Key information about SELA Cabinets:
- We serve Detroit and 15+ surrounding cities (Dearborn, Troy, Sterling Heights, Ann Arbor, Royal Oak, Farmington Hills, Livonia, Canton, Novi, Southfield, West Bloomfield, Rochester Hills, Plymouth, Westland, Redford Township)
- Estimates are based on measurements, cabinet style, finish, storage needs, and installation scope
- Professional installation timing is confirmed after inspection, supplier ordering, delivery, and site readiness review
- We offer in-home measurements and design guidance
- Phone: (313) 468-3225
- Website: selacabinets.com
- Email: info@selacabinets.com

Instructions:
- Be friendly, professional, and helpful
- Answer questions about estimates, service areas, inspection-based timing, and services
- When appropriate, encourage customers to book a consultation or start an estimate
- If they provide contact info (phone/email) or express interest in buying, they are a lead
- Keep responses concise (2-4 sentences max)',
  
  -- Feature flags
  is_active BOOLEAN DEFAULT true,
  lead_capture_enabled BOOLEAN DEFAULT true,
  email_notifications_enabled BOOLEAN DEFAULT true
);

-- Insert default config
INSERT INTO chatbot_config (bot_name, welcome_message, system_prompt)
VALUES (
  'SELA Cabinets',
  'Hi, welcome to SELA Cabinets. I can help with service areas, cabinet estimates, timelines, and consultations. How can I help today?',
  'You are the friendly assistant for SELA Cabinets. Help customers with cabinet styles, estimates, service areas, and consultation questions. Do not publish generic project prices or promise a fixed install time. Explain that timing is confirmed after inspection, supplier ordering, delivery, and site readiness review. Call (313) 468-3225.'
) ON CONFLICT DO NOTHING;

-- 2. Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Session identifier
  session_id TEXT UNIQUE NOT NULL,
  
  -- Metadata
  message_count INTEGER DEFAULT 0,
  
  -- Lead capture
  lead_captured BOOLEAN DEFAULT false,
  lead_id INTEGER REFERENCES leads(id),
  
  -- Contact info captured during chat
  captured_name TEXT,
  captured_phone TEXT,
  captured_email TEXT
);

-- 3. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Session reference
  session_id TEXT NOT NULL REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
  
  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'bot', 'system')),
  content TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS chat_sessions_session_id_idx ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS chat_sessions_created_at_idx ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at DESC);

-- Updated at trigger for chat_sessions
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL ON chatbot_config TO sela_app;
-- GRANT ALL ON chat_sessions TO sela_app;
-- GRANT ALL ON chat_messages TO sela_app;

COMMENT ON TABLE chatbot_config IS 'Stores chatbot configuration including system prompts and welcome messages';
COMMENT ON TABLE chat_sessions IS 'Tracks chat sessions with lead capture status';
COMMENT ON TABLE chat_messages IS 'Stores individual chat messages';
