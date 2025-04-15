# Supabase Setup Instructions

This directory contains the database setup files for the Voice Actor Marketplace.

## Structure
- `migrations/`: Contains database schema and policy definitions
  - `00001_init.sql`: Initial schema setup
  - `00002_policies.sql`: Row Level Security policies
- `seed.sql`: Sample data for development

## Setup Steps

1. Create a new Supabase project at https://app.supabase.com

2. Get your project URL and anon key from the project settings

3. Create a `.env` file in the root directory with:
   ```
   REACT_APP_SUPABASE_URL=your_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Run the migrations in order:
   - Execute `00001_init.sql`
   - Execute `00002_policies.sql`

5. (Optional) Run `seed.sql` to populate the database with sample data

## Database Schema

### voice_actors
- Main table for voice actor profiles
- Includes basic info, stats, and portfolio details

### jobs
- Stores job invitations and details
- Links to voice actors through voice_actor_id

### reviews
- Stores voice actor reviews and ratings
- Links to voice actors through voice_actor_id

## Security

Row Level Security (RLS) is enabled on all tables with the following policies:
- Public read access to all tables
- Public write access to jobs and reviews
- Protected write access to voice_actor profiles 