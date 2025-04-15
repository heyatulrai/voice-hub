-- Enable RLS on all tables
ALTER TABLE voice_actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Voice Actors policies
CREATE POLICY "Voice actors are viewable by everyone"
    ON voice_actors FOR SELECT
    USING (true);

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone"
    ON jobs FOR SELECT
    USING (true);

CREATE POLICY "Jobs can be created by anyone"
    ON jobs FOR INSERT
    WITH CHECK (true);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Reviews can be created by anyone"
    ON reviews FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public uploads to voicehub bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'voicehub');

CREATE POLICY "Allow public reads from voicehub bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'voicehub');