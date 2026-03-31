from flask import Blueprint, request, jsonify
from bson import ObjectId
import uuid
import logging

try:
    from ..models import bookings_collection, flights_collection, users_collection
    from ..middleware import token_required
except ImportError:
    from models import bookings_collection, flights_collection, users_collection
    from middleware import token_required

booking_bp = Blueprint('booking', __name__)

@booking_bp.route('/create', methods=['POST'])
@token_required
def create_booking(current_user):
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No booking data provided"}), 400
        
        # Validation
        flight_id = data.get("flight_id")
        passengers = data.get("passengers", [])
        seats = data.get("seats", [])
        add_ons = data.get("add_ons", {})
        total_price = data.get("total_price", 0)

        if not flight_id or not passengers:
            return jsonify({"error": "flight_id and passengers are required"}), 400

        # Validate flight exists
        try:
            flight = flights_collection.find_one({"_id": ObjectId(flight_id)})
            if not flight:
                return jsonify({"error": "Flight not found"}), 404
        except Exception as e:
            return jsonify({"error": f"Invalid flight ID format: {str(e)}"}), 400

        # Create booking, generate PNR
        pnr_code = str(uuid.uuid4())[:6].upper()

        booking = {
            "user_id": str(current_user["_id"]),
            "flight_id": flight_id,
            "passengers": passengers,
            "seats": seats,
            "add_ons": add_ons,
            "total_price": total_price,
            "status": "Confirmed",
            "pnrcode": pnr_code,
            "flight_details": {
                "flight_number": flight.get("flight_number"),
                "airline": flight.get("airline"),
                "origin": flight.get("origin"),
                "destination": flight.get("destination"),
                "departure": flight.get("departure"),
                "arrival": flight.get("arrival")
            }
        }
        
        # Earn points logic (Loyalty program: 1 point per $10 spent)
        points_earned = int(total_price / 10)
        users_collection.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {"$inc": {"points": points_earned}}
        )

        result = bookings_collection.insert_one(booking)
        booking["_id"] = str(result.inserted_id)
        
        logging.info(f"Booking {pnr_code} created successfully for User {current_user['email']}")
        return jsonify(booking), 201

    except Exception as e:
        logging.error(f"Failed to create booking: {str(e)}")
        return jsonify({"error": "Internal server error during booking creation"}), 500

@booking_bp.route('/user', methods=['GET'])
@token_required
def get_user_bookings(current_user):
    try:
        user_id = str(current_user["_id"])
        bookings = list(bookings_collection.find({"user_id": user_id}))
        for b in bookings:
            b["_id"] = str(b["_id"])
        return jsonify(bookings), 200
    except Exception as e:
        logging.error(f"Error fetching bookings: {str(e)}")
        return jsonify({"error": "Server error"}), 500

@booking_bp.route('/<booking_id>', methods=['GET'])
@token_required
def get_booking(current_user, booking_id):
    try:
        booking = bookings_collection.find_one({"_id": ObjectId(booking_id), "user_id": str(current_user["_id"])})
        if not booking:
            return jsonify({"error": "Booking not found"}), 404
            
        booking["_id"] = str(booking["_id"])
        return jsonify(booking), 200
    except Exception as e:
        logging.error(f"Error fetching booking {booking_id}: {str(e)}")
        return jsonify({"error": "Invalid booking ID format"}), 400
