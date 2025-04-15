-- Insert sample voice actors
INSERT INTO voice_actors (
    name, 
    location, 
    profile_picture_url, 
    demo_audio_url,
    skills,
    languages,
    rating, 
    review_count, 
    certifications, 
    bio, 
    reply_time, 
    completed_jobs, 
    past_clients,
    audio_snippets
) VALUES
    (
        'John Smith', 
        'New York, USA',
        'https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/headshots/pexels-royalanwar-450214.jpg',
        'https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/audios/sound-design-elements-sfx-ps-022-302865.mp3',
        ARRAY['Character Voices', 'Narration', 'Commercial'],
        ARRAY['English', 'Spanish'],
        4.8, 
        156, 
        ARRAY['Animation', 'Commercial'], 
        'Professional voice actor with 10+ years of experience in animation and commercial work.',
        '< 24 hours',
        342,
        ARRAY['Disney', 'Netflix'],
        ARRAY['https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/audios/sound-design-elements-sfx-ps-022-302865.mp3', 'https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/audios/astral-creepy-dark-logo-254198.mp3', 'https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/audios/riser-hit-sfx-001-289802.mp3']
    ),
    (
        'Sarah Johnson',
        'London, UK',
        'https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/headshots/pexels-emmy-e-1252107-2381069.jpg',
        'https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/audios/astral-creepy-dark-logo-254198.mp3',
        ARRAY['Audiobook Narration', 'Documentary', 'E-Learning'],
        ARRAY['English', 'French'],
        4.9,
        203,
        ARRAY['Audiobook', 'Documentary'],
        'Award-winning narrator specializing in non-fiction and documentaries.',
        '< 12 hours',
        415,
        ARRAY['Audible', 'BBC'],
        ARRAY['https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/audios/sound-design-elements-sfx-ps-022-302865.mp3', 'https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/audios/astral-creepy-dark-logo-254198.mp3', 'https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/audios/riser-hit-sfx-001-289802.mp3']
    ),
    (
        'Michael Chen',
        'Toronto, Canada',
        'https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/headshots/pexels-alimadad-997512.jpg',
        'https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/audios/riser-hit-sfx-001-289802.mp3',
        ARRAY['Video Game Voices', 'Animation', 'Action'],
        ARRAY['English', 'Mandarin', 'Cantonese'],
        4.7,
        89,
        ARRAY['Video Games', 'Animation'],
        'Voice actor passionate about bringing game characters to life.',
        '< 48 hours',
        167,
        ARRAY['EA Games', 'Ubisoft'],
        ARRAY['https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/audios/sound-design-elements-sfx-ps-022-302865.mp3', 'https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/audios/astral-creepy-dark-logo-254198.mp3', 'https://lpovovpclyuktjjeofzv.supabase.co/storage/v1/object/public/voicehub/audios/riser-hit-sfx-001-289802.mp3']
    );

-- Insert sample reviews
INSERT INTO reviews (voice_actor_id, rating, review_text)
SELECT 
    id,
    5,
    'Excellent work and very professional!'
FROM voice_actors
WHERE name = 'John Smith'
UNION ALL
SELECT 
    id,
    5,
    'Amazing voice quality and quick turnaround!'
FROM voice_actors
WHERE name = 'Sarah Johnson'; 