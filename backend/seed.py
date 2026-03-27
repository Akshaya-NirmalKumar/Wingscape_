import os
from models import users_collection, destinations_collection, flights_collection, bookings_collection, airports_collection, price_alerts_collection
from bson import ObjectId
import random
from datetime import datetime, timedelta

def create_airports():
    airports = [
        {"code": "JFK", "city": "New York", "country": "USA", "name": "John F. Kennedy International", "coordinates": [40.6413, -73.7781]},
        {"code": "LHR", "city": "London", "country": "UK", "name": "Heathrow Airport", "coordinates": [51.4700, -0.4543]},
        {"code": "DXB", "city": "Dubai", "country": "UAE", "name": "Dubai International Airport", "coordinates": [25.2532, 55.3657]},
        {"code": "BLR", "city": "Bangalore", "country": "India", "name": "Kempegowda International", "coordinates": [15.1958, 77.7068]},
        {"code": "SIN", "city": "Singapore", "country": "Singapore", "name": "Changi Airport", "coordinates": [1.3644, 103.9915]},
        {"code": "CDG", "city": "Paris", "country": "France", "name": "Charles de Gaulle Airport", "coordinates": [49.0097, 2.5479]},
        {"code": "HND", "city": "Tokyo", "country": "Japan", "name": "Haneda Airport", "coordinates": [35.5494, 139.7798]},
        {"code": "SYD", "city": "Sydney", "country": "Australia", "name": "Sydney Kingsford Smith", "coordinates": [-33.9399, 151.1753]},
        {"code": "FRA", "city": "Frankfurt", "country": "Germany", "name": "Frankfurt Airport", "coordinates": [50.0333, 8.5705]},
        {"code": "YYZ", "city": "Toronto", "country": "Canada", "name": "Toronto Pearson", "coordinates": [43.6777, -79.6248]},
        {"code": "LAX", "city": "Los Angeles", "country": "USA", "name": "Los Angeles International", "coordinates": [33.9416, -118.4085]},
        {"code": "AMS", "city": "Amsterdam", "country": "Netherlands", "name": "Amsterdam Airport Schiphol", "coordinates": [52.3105, 4.7683]},
        {"code": "ICN", "city": "Seoul", "country": "South Korea", "name": "Incheon International", "coordinates": [37.4602, 126.4407]},
        {"code": "BKK", "city": "Bangkok", "country": "Thailand", "name": "Suvarnabhumi Airport", "coordinates": [13.6900, 100.7501]},
        {"code": "DEL", "city": "New Delhi", "country": "India", "name": "Indira Gandhi International", "coordinates": [28.5562, 77.1000]},
        {"code": "MAD", "city": "Madrid", "country": "Spain", "name": "Adolfo Suárez Madrid–Barajas", "coordinates": [40.4839, -3.5680]},
        {"code": "IST", "city": "Istanbul", "country": "Turkey", "name": "Istanbul Airport", "coordinates": [41.2590, 28.7420]},
        {"code": "MEX", "city": "Mexico City", "country": "Mexico", "name": "Benito Juárez International", "coordinates": [19.4361, -99.0719]},
        {"code": "GRU", "city": "Sao Paulo", "country": "Brazil", "name": "Guarulhos International", "coordinates": [-23.4356, -46.4731]},
        {"code": "JNB", "city": "Johannesburg", "country": "South Africa", "name": "O. R. Tambo International", "coordinates": [-26.1367, 28.2411]},
        # Random fallback codes for extra cities up to 50 conceptually
    ]
    
    # Just generating remaining up to 50 generically 
    cities = ["Berlin", "Rome", "Athens", "Cairo", "Nairobi", "Mumbai", "Jakarta", "Manila", "Taipei", "Osaka", "Vancouver", "Montreal", "Chicago", "Miami", "Denver", "Seattle", "Houston", "Dallas", "Atlanta", "Boston", "Las Vegas", "Orlando", "San Francisco", "Honolulu", "Auckland", "Fiji", "Tahiti", "Rio de Janeiro", "Buenos Aires", "Lima", "Bogota", "Santiago", "Caracas", "Havana"]
    for i, city in enumerate(cities):
        code = city.replace(" ", "")[:3].upper()
        if len(code) == 3:
            airports.append({"code": code, "city": city, "country": "Global", "name": f"{city} Airport", "coordinates": [0,0]})

    return airports

def seed_data():
    # if airports_collection.count_documents({}) > 0:
    #     print("Database already seeded. Skipping...")
    #     return
        
    print("Clearing existing data...")
    users_collection.delete_many({})
    destinations_collection.delete_many({})
    flights_collection.delete_many({})
    bookings_collection.delete_many({})
    airports_collection.delete_many({})
    price_alerts_collection.delete_many({})

    # Seed Airports
    airports = create_airports()
    airports_collection.insert_many(airports)
    print(f"Seeded {len(airports)} airports.")

    # Seed Destinations
    destinations_data = [
        {"city": "Bali", "country": "Indonesia", "airport_code": "DPS", "emotion_tags": ["Peaceful", "Romantic", "Nature"], "description": "Serene beaches and lush jungles.", "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", "best_season": "April to October"},
        {"city": "Swiss Alps", "country": "Switzerland", "airport_code": "ZRH", "emotion_tags": ["Peaceful", "Adventure", "Family"], "description": "Quiet mountain peaks and fresh air.", "image_url": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80", "best_season": "December to March"},
        {"city": "Kyoto", "country": "Japan", "airport_code": "KIX", "emotion_tags": ["Peaceful", "Cultural", "Family"], "description": "Historic temples and zen gardens.", "image_url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", "best_season": "March to May"},
        {"city": "Queenstown", "country": "New Zealand", "airport_code": "ZQN", "emotion_tags": ["Adventure", "Nature"], "description": "Breathtaking landscapes and extreme sports.", "image_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80", "best_season": "December to February"},
        {"city": "Reykjavik", "country": "Iceland", "airport_code": "KEF", "emotion_tags": ["Adventure", "Nature", "Family"], "description": "Volcanoes, glaciers, and waterfalls.", "image_url": "https://images.unsplash.com/photo-1476610286381-420042eeb4d6?auto=format&fit=crop&w=800&q=80", "best_season": "June to August"},
        {"city": "Paris", "country": "France", "airport_code": "CDG", "emotion_tags": ["Romantic", "Cultural", "Foodie"], "description": "The city of love and lights.", "image_url": "https://images.unsplash.com/photo-1502602898657-3e907a5ea82c?auto=format&fit=crop&w=800&q=80", "best_season": "April to June"},
        {"city": "Santorini", "country": "Greece", "airport_code": "JTR", "emotion_tags": ["Romantic", "Peaceful"], "description": "Stunning sunsets and white-domed buildings.", "image_url": "https://images.unsplash.com/photo-1469796466635-455ede028aca?auto=format&fit=crop&w=800&q=80", "best_season": "September to October"},
        {"city": "New York City", "country": "USA", "airport_code": "JFK", "emotion_tags": ["Stressed", "City", "Foodie"], "description": "The hustle and bustle of the big apple.", "image_url": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80", "best_season": "September to November"},
        {"city": "Tokyo", "country": "Japan", "airport_code": "HND", "emotion_tags": ["Stressed", "Tech", "Foodie"], "description": "Fast-paced city life and neon lights.", "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80", "best_season": "March to May"},
        {"city": "Malé", "country": "Maldives", "airport_code": "MLE", "emotion_tags": ["Romantic", "Peaceful"], "description": "Crystal clear waters and overwater bungalows.", "image_url": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80", "best_season": "November to April"},
        {"city": "Venice", "country": "Italy", "airport_code": "VCE", "emotion_tags": ["Romantic", "Historic", "Foodie"], "description": "Canals, gondolas, and timeless romance.", "image_url": "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80", "best_season": "April to June"},
        {"city": "London", "country": "UK", "airport_code": "LHR", "emotion_tags": ["Stressed", "Historic", "Family"], "description": "Historic city with a fast-paced modern lifestyle.", "image_url": "https://images.unsplash.com/photo-1513635269975-5969336cd4f6?auto=format&fit=crop&w=800&q=80", "best_season": "May to September"},
        {"city": "Dubai", "country": "UAE", "airport_code": "DXB", "emotion_tags": ["Stressed", "Luxury", "Foodie"], "description": "Ultra-modern architecture and luxury shopping.", "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80", "best_season": "November to March"},
        {"city": "Florence", "country": "Italy", "airport_code": "FLR", "emotion_tags": ["Romantic", "Art", "Foodie"], "description": "Birthplace of the Renaissance and fine art.", "image_url": "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80", "best_season": "May to September"},
        {"city": "Los Angeles", "country": "USA", "airport_code": "LAX", "emotion_tags": ["Stressed", "Entertainment", "Family"], "description": "Hollywood dreams and infamous traffic.", "image_url": "https://images.unsplash.com/photo-1580659324482-4fdb8caee6ac?auto=format&fit=crop&w=800&q=80", "best_season": "March to May"}
    ]
    # Add more destinations properly to ensure tags align
    for city in ["Singapore", "Bangkok", "Sydney", "Rome", "Toronto", "Chicago", "Seoul", "Madrid", "Berlin", "Honolulu", "Miami"]:
        tags = ["Adventure", "Stressed", "Romantic", "Family", "Foodie", "Peaceful"]
        random.shuffle(tags)
        
        destinations_data.append({
            "city": city,
            "country": "Global",
            "airport_code": city[:3].upper(),
            "emotion_tags": tags[:3],
            "description": f"Amazing scenery and vibes in {city}.",
            "image_url": f"https://loremflickr.com/800/600/{city.replace(' ', '')},travel/all",
            "best_season": "All year"
        })

    destinations_collection.insert_many(destinations_data)
    print(f"Seeded {len(destinations_data)} destinations.")

    # Seed Flights (200+ flights)
    airlines = ["Wingscape Air", "Global Jet", "Oceanic Flights", "Apex Airways", "Velocity Airlines", "SkyHigh", "Blue Horizon", "CloudNine"]
    airport_codes = [a["code"] for a in airports]
    
    flights = []
    
    for _ in range(250):
        origin = random.choice(airport_codes)
        dest = random.choice([ac for ac in airport_codes if ac != origin])
        dept_time = datetime.now() + timedelta(days=random.randint(1, 60), hours=random.randint(0,23), minutes=random.randint(0,59))
        duration_mins = random.randint(60, 800)
        arr_time = dept_time + timedelta(minutes=duration_mins)
        
        flights.append({
            "flight_number": f"{random.choice(['WA', 'GJ', 'OF', 'AA', 'VA'])}{random.randint(100, 9999)}",
            "airline": random.choice(airlines),
            "origin": origin,
            "destination": dest,
            "departure": dept_time.isoformat() + "Z",
            "arrival": arr_time.isoformat() + "Z",
            "duration": f"{duration_mins // 60}h {duration_mins % 60}m",
            "stops": random.choices(["Direct", "1 Stop", "2 Stops"], weights=[70, 25, 5])[0],
            "price": random.randint(100, 1500),
            "seats_available": random.randint(0, 50),
            "status": random.choices(["On Time", "Delayed", "Boarding"], weights=[80, 15, 5])[0]
        })
            
    flights_collection.insert_many(flights)
    print(f"Seeded {len(flights)} flights successfully!")

if __name__ == "__main__":
    seed_data()
