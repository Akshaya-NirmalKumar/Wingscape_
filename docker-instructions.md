# Wingscape Docker Rebuild Instructions

To see the updated frontend with Glassmorphism and animations, follow these steps to rebuild the Docker container:

1. **Stop the running containers** (if any):
   ```bash
   docker-compose down
   ```

2. **Rebuild the frontend container**:
   Since we added a new dependency (`framer-motion`) to `package.json`, we need to force a rebuild of the frontend image.
   ```bash
   docker-compose build frontend
   ```
   *Alternatively, to rebuild everything without using the cache:*
   ```bash
   docker-compose build --no-cache
   ```

3. **Start the containers**:
   ```bash
   docker-compose up -d
   ```

4. **Verify**:
   Open `http://localhost:5173` in your browser. You should now see the premium Wingscape UI with Dark Glassmorphism themes, Poppins typography, and fluid Framer Motion animations!
