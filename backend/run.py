import os
from seed import seed_data
from app import app

# Ensure database is seeded on startup
seed_data()

# Bind to 0.0.0.0
app.run(host="0.0.0.0", port=5000)
