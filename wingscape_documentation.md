# Wingscape Technical Documentation

Welcome to the **Wingscape** technical overview. This document serves as a comprehensive guide to understanding the architecture, workflows, and implementation details of the platform.

---

## 1. Project Overview
Wingscape is a premium travel discovery and booking platform. Unlike traditional travel apps, Wingscape combines a strict **Direct Flight Booking** engine with a unique **Mood-Based Discovery** system, allowing users to find escapes based on how they feel (e.g., Stressed, Romantic, Adventurous).

---

## 2. Tech Stack

### Frontend
- **Framework**: React.js (via Vite)
- **Styling**: Vanilla CSS with a Custom Design System (Glassmorphism aesthetics)
- **Animations**: Framer Motion (page transitions, hover effects, overlays)
- **Icons**: Lucide React
- **API Client**: Axios (with interceptors for JWT)
- **State Management**: React Context API (`AuthContext`)

### Backend
- **Framework**: Flask (Python 3.14+)
- **Architecture**: Modular Blueprints
- **Authentication**: JWT (JSON Web Tokens) with `bcrypt` password hashing
- **Database**: MongoDB (via `pymongo`)

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Configuration**: [.env](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/backend/.env) for environment-specific secrets

---

## 3. Core Architecture

### Backend: Modular Blueprints
The backend is split into specialized modules for maintainability:
- **`auth_bp`**: Handles user registration, login, and password management.
- **`search_bp`**: Manages airport searching and flight availability.
- **`booking_bp`**: The core logic for creating bookings, generating PNR codes, and managing user trips.
- **`user_bp`**: Profile management, loyalty points tracking, and price alerts.
- **`emotion_bp`**: The recommendation engine that maps user moods to curated destinations.

### Frontend: Structure
- **Pages**:
  - [Home.jsx](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/frontend/src/pages/Home.jsx): Dual search modes (Route vs. Mood).
  - [FlightResults.jsx](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/frontend/src/pages/FlightResults.jsx): Lists available flights with filtering.
  - [BookingDetails.jsx](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/frontend/src/pages/BookingDetails.jsx): Multi-passenger details form with add-ons.
  - [Confirmation.jsx](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/frontend/src/pages/Confirmation.jsx): Post-booking summary with PNR display.
  - [Dashboard.jsx](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/frontend/src/pages/Dashboard.jsx): User profile, trip tracker, and loyalty status.
- **Components**:
  - [RecommendationOverlay.jsx](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/frontend/src/components/RecommendationOverlay.jsx): Premium popup for mood-based results.
  - [FlightCard.jsx](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/frontend/src/components/FlightCard.jsx): Reusable card for flight information.
  - [Hero.jsx](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/frontend/src/components/Hero.jsx): The primary flight search form.

---

## 4. Key Workflows

### A. The Booking Process
1. **Search**: Users enter Origin/Destination (IATA codes like JFK to LHR).
2. **Selection**: Users choose a flight from the results list.
3. **Details**: Users enter names, emails, and phone numbers for each passenger.
4. **Add-ons**: Users select optional services (Baggage, Insurance, Meals) which update the total price in real-time.
5. **Execution**: The `/api/bookings/create` endpoint:
   - Validates the flight and user.
   - Generates a unique **PNR Code** (e.g., `B3A9C1`).
   - Calculates and awards **Loyalty Points**.
   - Stores the booking in MongoDB.

### B. Mood-Based Search
1. User selects a mood icon (e.g., "Foodie" 🍴).
2. The frontend triggers [RecommendationOverlay](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/frontend/src/components/RecommendationOverlay.jsx#7-114).
3. The backend uses a MongoDB **Aggregation Pipeline** to find destinations tagged with that emotion.
4. User clicks "View Flights" on a recommendation, which pre-fills the flight search for that destination.

### C. Authentication Flow
- **Registration**: Passwords are salted and hashed using `bcrypt` before storage.
- **Login**: A JWT is generated containing `user_id`, `email`, and `name`.
- **Authorization**: The [token_required](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/backend/middleware.py#10-33) decorator sits on protected routes. It verifies the bearer token in the `Authorization` header and attaches the `current_user` object to the request.

---

## 5. Database Schema (MongoDB)

| Collection | Description |
| :--- | :--- |
| `users` | Stores accounts, hashed passwords, loyalty points, and tier status. |
| [flights](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/backend/blueprints/search.py#33-51) | Real-time flight schedule with prices, airlines, and status. |
| [airports](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/backend/blueprints/search.py#6-25) | Catalog of 50+ global airports with IATA codes. |
| [destinations](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/backend/blueprints/search.py#26-32)| Curated spots with descriptions, images, and emotion tags. |
| [bookings](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/backend/blueprints/booking.py#75-87) | Historical and upcoming trips linked to users and flights. |

---

## 6. Premium Features & Logic

### Loyalty System
- **Rate**: 1 Loyalty Point per $10 spent.
- **Tiers**:
  - **Silver**: Default status.
  - **Gold**: Automatically tracked in the profile.
  - **Platinum**: Reserved for top-tier travelers.

### Flight Status Tracker
The dashboard includes a mockup of a real-time tracker:
- **On Time** (Green Glow)
- **Delayed** (Accented/Red Glow)
- **Boarding** (Yellow Glow)

---

## 7. Setup & Development

### Seeding Data
The [seed.py](file:///c:/Users/Alby%20Anil/.gemini/antigravity/scratch/wingscape/backend/seed.py) script is a crucial tool for developers. It:
1. Clears existing data to prevent duplicates.
2. Seeds **54 Airports** across all continents.
3. Seeds **30 Curated Destinations** with reliable image URLs.
4. Generates **250+ Randomized Flights** to ensure the search results are always populated.

### Running with Docker
```bash
docker-compose up --build
```
This command spins up:
- **MongoDB**: The data store on port 27017.
- **Backend (Flask)**: Serving API on port 5000.
- **Frontend (React/Vite)**: Serving UI on port 5173.
