import os

try:
    from .seed import seed_data
    from .app import app
except ImportError:
    from seed import seed_data
    from app import app

# Ensure database is seeded on startup
seed_data()

# Bind to 0.0.0.0
app.run(host="0.0.0.0", port=5000)
