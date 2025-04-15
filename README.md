# 🎤 Voice Actor Marketplace

A web-based platform to discover, listen to, and hire professional voice actors. Users can browse voice talent, filter by categories, listen to audio samples, view detailed profiles, and invite them to voice-over jobs.

---

## 🧭 User Journeys

### 1. Marketplace Browsing
- Land on homepage
- Use search or filters to find voice actors
- Browse voice actor cards
- Click "View Details" to view profile

### 2. Profile Exploration
- View full profile with audio samples, activity stats, and past clients
- Click "Invite to Job" CTA

### 3. Job Invitation
- Fill out job details in a modal form
- Submit to create a job entry in Supabase

---

## 🎨 Features

### ✅ Homepage / Marketplace
- Search bar: name, skill, language
- Category filters: Animation, Commercial, Audiobook, etc.
- Voice actor cards with:
  - Profile picture, name
  - Rating (e.g., 4.7/5)
  - Review count (e.g., 25 reviews)
  - Playable audio snippet
  - CTA: "View Details"

### ✅ Voice Actor Profile Page
- Profile: Name, location, rating, total reviews
- Embedded portfolio (audio samples)
- Bio section
- Widgets:
  - Invite to Job
  - Past Clients
  - Activity (last online, reply time, completed jobs)
  - Detailed review/rating breakdown

### ✅ Invite to Job Modal
- Fields:
  - Project Name
  - Category (radio)
  - Voice Character (e.g., comedic, deep)
  - Language, Accent, Voice Gender
  - Script Upload
  - Audio Length
  - Deadline, Budget
  - Approval method (checkbox/notes)
- Submitted data is stored in Supabase `jobs` table

### ✅ Search & Filter
- Realtime keyword search and category filtering

---

## 💾 Tech Stack

| Layer        | Technology           |
|--------------|----------------------|
| Frontend     | React                |
| Database     | Supabase (PostgreSQL)|
| File Storage | Supabase Storage     |

---

## 🧩 Data Models

### 🗂 `voice_actors`
| Field             | Type       |
|------------------|------------|
| id               | UUID       |
| name             | String     |
| location         | String     |
| rating           | Float      |
| review_count     | Integer    |
| certifications   | String[]   |
| audio_snippets   | File[]     |
| bio              | Text       |
| last_online      | Timestamp  |
| reply_time       | String     |
| completed_jobs   | Integer    |
| past_clients     | String[]   |

### 🗂 `jobs`
| Field                | Type       |
|----------------------|------------|
| id                   | UUID       |
| voice_actor_id       | UUID (FK)  |
| project_name         | String     |
| category             | String     |
| voice_characteristics| String[]   |
| language             | String     |
| accent               | String     |
| gender               | String     |
| script_url           | String     |
| audio_length         | Float      |
| deadline             | Date       |
| budget               | Float      |
| approval_method      | Text       |

### 🗂 `reviews`
| Field         | Type      |
|---------------|-----------|
| id            | UUID      |
| voice_actor_id| UUID (FK) |
| rating        | Float     |
| review_text   | Text      |
| created_at    | Timestamp |

---

## ⚙️ State Management

- Supabase real-time or reload-based sync
- Full handling for loading, error, and success states

---

## 🤖 AI Tools Used

- **lovable / Cursor / ChatGPT**
  - Schema design
  - Component generation (cards, modal, widgets)
  - UI layout brainstorming
  - Code scaffolding and documentation

---

## 🧪 Running the App Locally

### ✅ Prerequisites
- Django >= 5.0
- Supabase account/project
- Git

### 🚀 Setup Instructions

```bash
cd voice-actor-marketplace
npm install
# Create `.env.local` and set Supabase URL + anon key
npm run dev
