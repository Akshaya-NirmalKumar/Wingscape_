from flask import Blueprint, request, jsonify
from models import destinations_collection, flights_collection
from bson import ObjectId

travel_bp = Blueprint('travel', __name__)

@travel_bp.route("/destinations", methods=["GET"])
def get_destinations():
    emotion = request.args.get("emotion")
    if emotion:
        query = {"emotion": emotion}
    else:
        query = {}
    
    destinations = list(destinations_collection.find(query))
    for d in destinations:
        d["_id"] = str(d["_id"])
    return jsonify(destinations)

@travel_bp.route("/flights", methods=["GET"])
def get_flights():
    destination_id = request.args.get("destination_id")
    if destination_id:
        query = {"destination_id": destination_id}
    else:
        query = {}
    
    # Get all flights for the destination
    flights = list(flights_collection.find(query))
    
    for f in flights:
        f["_id"] = str(f["_id"])
        
    # Optional logic: could filter here to return cheapest and fastest if multiple exist
    # For now, we'll return all and let frontend display/sort or just rely on seed generating distinct ones
        
    return jsonify(flights)
