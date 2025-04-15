# Voice Actor Marketplace - Product Requirements Document (PRD)

## 1. Overview
A web-based platform connecting voice actors with potential clients. The platform enables discovery, evaluation, and hiring of professional voice talent through a streamlined interface.

## 2. Target Users
### Voice Actors
- Professional voice talent
- Multilingual performers
- Specialized in various categories (Animation, Commercial, Audiobook, etc.)

### Clients
- Content creators
- Production companies
- Business owners
- Individual project managers

## 3. Core Features

### 3.1 Authentication System
- **User Registration**
  - Email-based signup
  - Required fields: Name, Email, Password
  - User role selection (Voice Actor/Client)
  - Email verification required

- **User Login**
  - Email/Password authentication
  - Persistent session management
  - Protected routes for authenticated users
  - Secure logout functionality

### 3.2 Voice Actor Discovery
- **Homepage/Marketplace**
  - Search functionality
    - Name-based search
    - Category filtering
    - Language filtering
  - Voice actor cards displaying:
    - Profile picture
    - Name
    - Rating (integer-based, 1-5 stars)
    - Review count
    - Languages
    - Categories/Specializations

### 3.3 Profile System
- **Voice Actor Profiles**
  - Professional information
    - Name and location
    - Bio/About section
    - Languages spoken
    - Specialization categories
  - Portfolio
    - Audio samples
    - Playable audio snippets
  - Statistics
    - Overall rating
    - Total reviews
    - Last online status
    - Response time
    - Completed jobs count
  - Client Reviews
    - Star ratings (1-5, whole numbers only)
    - Written feedback
    - Reviewer name display
    - Review date

### 3.4 Job System
- **Job Invitation Process**
  - Project details
    - Project name
    - Category selection
    - Voice characteristics
    - Language requirements
    - Script upload capability
  - Project specifications
    - Audio length
    - Deadline
    - Budget
    - Approval method
  - Status tracking
    - Invitation sent
    - Acceptance status
    - Project progress

## 4. Technical Requirements

### 4.1 Frontend
- React-based SPA
- Responsive design (mobile-first approach)
- Ant Design component library
- TypeScript for type safety

### 4.2 Backend
- Supabase for:
  - Authentication
  - Database
  - File storage
  - Real-time updates

### 4.3 Database Schema
- **Users Table** (auth.users)
  - Standard auth fields
  - User metadata (display_name, role)

- **Voice Actors Table**
  ```sql
  - id (UUID)
  - name (String)
  - location (String)
  - profile_picture_url (Text)
  - demo_audio_url (Text)
  - skills (Text[])
  - languages (Text[])
  - rating (Integer)
  - review_count (Integer)
  - certifications (String[])
  - audio_snippets (File[])
  - bio (Text)
  - last_online (Timestamp)
  - last_hired (Timestamp)
  - reply_time (String)
  - completed_jobs (Integer)
  - past_clients (String[])
  ```

- **Jobs Table**
  ```sql
  - id (UUID)
  - voice_actor_id (UUID, FK)
  - project_name (String)
  - category (String)
  - voice_characteristics (String[])
  - language (String)
  - accent (String)
  - gender (String)
  - script_url (String)
  - audio_length (Float)
  - deadline (Date)
  - budget (Float)
  - approval_method (Text)
  - status (Text)
  ```

- **Reviews Table**
  ```sql
  - id (UUID)
  - voice_actor_id (UUID, FK)
  - reviewer_id (UUID, FK)
  - rating (Integer)
  - review_text (Text)
  - created_at (Timestamp)
  ```

## 5. Security Requirements
- Protected routes for authenticated users
- Secure file upload/download
- Rate limiting for API calls
- Input validation and sanitization
- Secure password handling
- XSS protection

## 6. Performance Requirements
- Page load time < 3 seconds
- Audio playback start < 1 second
- Real-time updates for reviews and ratings
- Efficient caching for static content
- Optimized image and audio delivery

## 7. Future Enhancements
- Direct messaging system
- Payment integration
- Advanced search filters
- Voice actor availability calendar
- Project milestone tracking
- Portfolio customization
- Social media integration
- Analytics dashboard

## 8. Success Metrics
- User registration rate
- Active user engagement
- Job completion rate
- Review submission rate
- Platform response time
- User satisfaction scores
- Search result relevancy 