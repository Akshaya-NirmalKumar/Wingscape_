import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://database:27017/")
client = MongoClient(MONGO_URI)
db = client["Wingscape"]

# Collections
users_collection = db["users"]
destinations_collection = db["destinations"]
flights_collection = db["flights"]
bookings_collection = db["bookings"]
price_alerts_collection = db["price_alerts"]
airports_collection = db["airports"]

def get_db():
    return db
