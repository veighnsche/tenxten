-- TENXTEN Certification Platform Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard', 'extreme');
CREATE TYPE track AS ENUM ('native', 'augmented');
CREATE TYPE attempt_status AS ENUM ('in_progress', 'submitted', 'passed', 'failed', 'timed_out');
CREATE TYPE certification_status AS ENUM ('pending', 'verified', 'expired', 'revoked');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  callsign TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  identity_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges table
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT NOT NULL,
  difficulty difficulty NOT NULL,
  track track NOT NULL,
  description TEXT NOT NULL,
  constraints TEXT[] DEFAULT '{}',
  hints TEXT[] DEFAULT '{}',
  time_limit_seconds INTEGER NOT NULL DEFAULT 2700, -- 45 minutes
  starter_code JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge examples (visible to users)
CREATE TABLE challenge_examples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  output TEXT NOT NULL,
  explanation TEXT,
  "order" INTEGER DEFAULT 0
);

-- Challenge test cases (some hidden)
CREATE TABLE challenge_test_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  is_hidden BOOLEAN DEFAULT FALSE,
  "order" INTEGER DEFAULT 0
);

-- Challenge attempts
CREATE TABLE challenge_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  status attempt_status DEFAULT 'in_progress',
  code TEXT DEFAULT '',
  language TEXT DEFAULT 'typescript',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  time_spent_seconds INTEGER,
  tests_passed INTEGER DEFAULT 0,
  tests_total INTEGER DEFAULT 0,
  ai_prompts_count INTEGER DEFAULT 0
);

-- Certifications
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  track track NOT NULL,
  status certification_status DEFAULT 'pending',
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  verification_hash TEXT UNIQUE,
  challenges_completed UUID[] DEFAULT '{}',
  UNIQUE(user_id, track)
);

-- Indexes
CREATE INDEX idx_challenges_track ON challenges(track);
CREATE INDEX idx_challenges_domain ON challenges(domain);
CREATE INDEX idx_challenge_attempts_user ON challenge_attempts(user_id);
CREATE INDEX idx_challenge_attempts_challenge ON challenge_attempts(challenge_id);
CREATE INDEX idx_certifications_user ON certifications(user_id);
CREATE INDEX idx_certifications_hash ON certifications(verification_hash);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Challenges: everyone can read
CREATE POLICY "Challenges are viewable by everyone" ON challenges
  FOR SELECT USING (true);

-- Challenge examples: everyone can read
CREATE POLICY "Challenge examples are viewable by everyone" ON challenge_examples
  FOR SELECT USING (true);

-- Test cases: only non-hidden are viewable, hidden only by service role
CREATE POLICY "Visible test cases are viewable by everyone" ON challenge_test_cases
  FOR SELECT USING (is_hidden = false);

-- Challenge attempts: users can CRUD own
CREATE POLICY "Users can view own attempts" ON challenge_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own attempts" ON challenge_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attempts" ON challenge_attempts
  FOR UPDATE USING (auth.uid() = user_id);

-- Certifications: users can read own, public can verify by hash
CREATE POLICY "Users can view own certifications" ON certifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can verify certifications by hash" ON certifications
  FOR SELECT USING (verification_hash IS NOT NULL AND status = 'verified');

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, callsign, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'callsign', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER challenges_updated_at
  BEFORE UPDATE ON challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
