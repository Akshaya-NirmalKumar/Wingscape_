# Wingscape

Wingscape is a premium flight booking and emotion-based discovery platform. It features an emotionally intelligent search layer atop a high-performance booking engine, mapping travel decisions to user emotions. 

## 🚀 Features

*   **Emotional Recommendation Engine:** Discover destinations tailored to your current mood (e.g., Stressed, Adventurous, Romantic).
*   **Direct Flight Booking:** A robust, multi-step booking process with PNR generation and status tracking.
*   **Loyalty Dashboard:** Earn points with flights and unlock tiered rewards (Bronze, Silver, Gold).
*   **Modern UI:** Glassmorphism design system built with React, Vite, Tailwind CSS, and Framer Motion.
*   **High Performance API:** Flask backend optimized for high-speed search and transactional integrity.
*   **Docker Containerization:** Fully containerized setup ensuring identical development and production environments.

## 📁 Repository Structure

*   `frontend/` - React application built with Vite
*   `backend/` - Flask API backend 
*   `docker-compose.yml` - Container orchestration
*   `Wingscape_Official_Documentation.md` - Comprehensive technical documentation
*   `wingscape_documentation.md` - Additional project documentation

## 🛠️ Tech Stack

**Frontend:** React, Vite, Framer Motion, Tailwind CSS
**Backend:** Flask, Python
**Database:** MongoDB
**Infrastructure:** Docker, Docker Compose

## ⚡ Quick Start (Docker)

To run the application locally, make sure you have Docker and Docker Compose installed.

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd wingscape
   ```

2. Setup Environment Variables:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   (Alternatively, create a `.env` file in the root directory based on `.env.example`)

3. Build and Run Container Services:
   ```bash
   docker-compose up --build
   ```

4. Access the Application:
   *   **Frontend UI:** `http://localhost:5173`
   *   **Backend API:** `http://localhost:5000`

## 📖 Complete Documentation

For detailed insights into the architecture, backend logic, schemas, and extensive developer guides, please refer to the [Wingscape Official Documentation](Wingscape_Official_Documentation.md).

## 📄 License

This project is open-source and available under the terms of the MIT License.
