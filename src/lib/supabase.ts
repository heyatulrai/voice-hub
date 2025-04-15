import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export type VoiceActor = {
  id: string;
  name: string;
  location: string;
  profile_picture_url: string;
  demo_audio_url: string;
  skills: string[];
  languages: string[];
  rating: number;
  review_count: number;
  certifications: string[];
  audio_snippets: string[];
  bio: string;
  last_online: string;
  last_hired: string;
  reply_time: string;
  completed_jobs: number;
  past_clients: string[];
  reviews?: Review[];
};

export type Job = {
  id: string;
  voice_actor_id: string;
  project_name: string;
  category: string;
  voice_characteristics: string[];
  language: string;
  accent: string;
  voice_gender: string;
  script_url: string;
  audio_length: number;
  deadline: string;
  budget: number;
  approval_method: string;
  created_at: string;
};

export type Review = {
  id: string;
  voice_actor_id: string;
  rating: number;
  review_text: string;
  created_at: string;
}; 