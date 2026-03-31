from flask import Blueprint, request, jsonify

try:
    from ..models import flights_collection, airports_collection, destinations_collection
except ImportError:
    from models import flights_collection, airports_collection, destinations_collection

search_bp = Blueprint('search', __name__)

@search_bp.route('/airports', methods=['GET'])
def get_airports():
    query = request.args.get('q', '').lower()
    if query:
        # Search by code, city, or name
        fil = {
            "$or": [
                {"code": {"$regex": query, "$options": "i"}},
                {"city": {"$regex": query, "$options": "i"}},
                {"name": {"$regex": query, "$options": "i"}}
            ]
        }
        airports = list(airports_collection.find(fil))
    else:
        airports = list(airports_collection.find())
        
    for a in airports:
        a["_id"] = str(a["_id"])
    return jsonify(airports), 200

@search_bp.route('/destinations', methods=['GET'])
def get_all_destinations():
    destinations = list(destinations_collection.find())
    for d in destinations:
        d["_id"] = str(d["_id"])
    return jsonify(destinations), 200

@search_bp.route('/flights/search', methods=['GET'])
def search_flights():
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    
    query = {}
    if origin:
        query["origin"] = origin.upper()
    if destination:
        query["destination"] = destination.upper()
        
    flights = list(flights_collection.find(query))
    
    # Auto-generate flights if none exist to ensure UI works seamlessly
    if len(flights) == 0 and (origin or destination):
        import random
        from datetime import datetime, timedelta
        
        new_flights = []
        airlines = ["Wingscape Air", "Global Jet", "Oceanic Flights", "Apex Airways", "Velocity Airlines", "SkyHigh", "Blue Horizon", "CloudNine"]
        default_origins = ["JFK", "LHR", "DXB", "LAX"]
        
        o = origin.upper() if origin else random.choice(default_origins)
        d = destination.upper() if destination else random.choice([x for x in default_origins if x != o])
        
        # Ensure they are different
        if o == d:
            d = random.choice([x for x in default_origins if x != o])
            
        for _ in range(random.randint(3, 8)):
            dept_time = datetime.now() + timedelta(days=random.randint(1, 60), hours=random.randint(0,23), minutes=random.randint(0,59))
            duration_mins = random.randint(60, 800)
            arr_time = dept_time + timedelta(minutes=duration_mins)
            
            f = {
                "flight_number": f"{random.choice(['WA', 'GJ', 'OF', 'AA', 'VA'])}{random.randint(100, 9999)}",
                "airline": random.choice(airlines),
                "origin": o,
                "destination": d,
                "departure": dept_time.isoformat() + "Z",
                "arrival": arr_time.isoformat() + "Z",
                "duration": f"{duration_mins // 60}h {duration_mins % 60}m",
                "stops": random.choices(["Direct", "1 Stop", "2 Stops"], weights=[70, 25, 5])[0],
                "price": random.randint(100, 1500),
                "seats_available": random.randint(5, 50),
                "status": random.choices(["On Time", "Delayed"], weights=[90, 10])[0]
            }
            new_flights.append(f)
            
        if new_flights:
            flights_collection.insert_many(new_flights)
            flights = list(flights_collection.find(query))

    for f in flights:
        f["_id"] = str(f["_id"])
        
    return jsonify(flights), 200
