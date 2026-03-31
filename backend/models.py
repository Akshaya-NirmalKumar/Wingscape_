import os
import certifi
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://database:27017/")
client = MongoClient(
    MONGO_URI,
    tlsCAFile=certifi.where(),
    server_api=ServerApi("1"),
    serverSelectionTimeoutMS=10000,
)
db = client["backenddb"]

# Collections
users_collection = db["users"]
destinations_collection = db["destinations"]
flights_collection = db["flights"]
bookings_collection = db["bookings"]
price_alerts_collection = db["price_alerts"]
airports_collection = db["airports"]

def get_db():
    return db
