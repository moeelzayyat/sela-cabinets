-- SELA Cabinets - Supabase Database Setup
-- ==========================================
-- Run this SQL in your Supabase SQL Editor

-- 1. Create the estimate_requests table
CREATE TABLE IF NOT EXISTS estimate_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact info
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Address
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  zip TEXT NOT NULL,
  
  -- Project details
  timeline TEXT NOT NULL,
  budget TEXT NOT NULL,
  style TEXT NOT NULL,
  notes TEXT,
  
  -- Photos
  photo_urls TEXT[] DEFAULT '{}',
  
  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'closed', 'cancelled')),
  
  -- Internal notes (for owner)
  internal_notes TEXT
);

-- 2. Create an index for faster queries
CREATE INDEX IF NOT EXISTS estimate_requests_status_idx ON estimate_requests(status);
CREATE INDEX IF NOT EXISTS estimate_requests_created_at_idx ON estimate_requests(created_at DESC);

-- 3. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_estimate_requests_updated_at
    BEFORE UPDATE ON estimate_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE estimate_requests ENABLE ROW LEVEL SECURITY;

-- 5. Create policy to allow inserts from the website (using anon key)
CREATE POLICY "Allow anonymous inserts" ON estimate_requests
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- 6. Create policy for authenticated users (admin) to do everything
CREATE POLICY "Allow authenticated full access" ON estimate_requests
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. Create storage bucket for estimate photos
-- Note: Run this in the Supabase Dashboard > Storage > Create Bucket
-- Bucket name: estimates
-- Public: Yes (or configure RLS as needed)

-- Storage policies (if you want to restrict uploads):
-- These are created in the Supabase Dashboard under Storage > Policies

COMMENT ON TABLE estimate_requests IS 'Stores estimate requests from the SELA Cabinets website';

