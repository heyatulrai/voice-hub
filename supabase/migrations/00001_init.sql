CREATE EXTENSION pg_trgm;


-- Create voice_actors table
CREATE TABLE voice_actors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    profile_picture_url TEXT,
    demo_audio_url TEXT,
    skills TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    certifications TEXT[] DEFAULT '{}',
    audio_snippets TEXT[] DEFAULT '{}',
    bio TEXT,
    last_online TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_hired TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reply_time VARCHAR(50),
    completed_jobs INTEGER DEFAULT 0,
    past_clients TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voice_actor_id UUID REFERENCES voice_actors(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    voice_characteristics TEXT[] DEFAULT '{}',
    language VARCHAR(100) NOT NULL,
    accent VARCHAR(100),
    voice_gender VARCHAR(50),
    script_url TEXT,
    audio_length DECIMAL(10,2),
    deadline DATE,
    budget DECIMAL(10,2),
    approval_method TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voice_actor_id UUID REFERENCES voice_actors(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Add reviewer_id to reviews table
ALTER TABLE reviews ADD COLUMN reviewer_id UUID REFERENCES auth.users(id);

-- Create indexes for better query performance
CREATE INDEX idx_voice_actors_rating ON voice_actors(rating);
CREATE INDEX idx_voice_actors_location ON voice_actors(location);
CREATE INDEX idx_jobs_voice_actor_id ON jobs(voice_actor_id);
CREATE INDEX idx_reviews_voice_actor_id ON reviews(voice_actor_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating updated_at
CREATE TRIGGER update_voice_actors_updated_at
    BEFORE UPDATE ON voice_actors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for search
CREATE INDEX idx_voice_actors_name ON voice_actors USING gin (name gin_trgm_ops);
CREATE INDEX idx_voice_actors_skills ON voice_actors USING gin (skills);
CREATE INDEX idx_voice_actors_languages ON voice_actors USING gin (languages);

-- Enable the pg_trgm extension for better text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create a view for public user profiles
CREATE VIEW public.user_profiles AS
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'display_name', email) as display_name
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;