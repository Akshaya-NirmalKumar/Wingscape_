from flask import Blueprint, request, jsonify
from models import users_collection, price_alerts_collection
from middleware import token_required
from bson import ObjectId
import logging

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    try:
        user_id = ObjectId(current_user["_id"])
        user = users_collection.find_one({"_id": user_id}, {"password_hash": 0})
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        user["_id"] = str(user["_id"])
        return jsonify(user), 200
    except Exception as e:
        logging.error(f"Error fetching profile: {str(e)}")
        return jsonify({"error": "Failed fetching profile"}), 500

@user_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    try:
        user_id = ObjectId(current_user["_id"])
        data = request.json
        
        # Prevent manual points increase or password change via generic profile update
        restricted_keys = ['password_hash', 'points', 'points_tier']
        update_data = {k: v for k, v in data.items() if k not in restricted_keys}
        
        if not update_data:
            return jsonify({"error": "No valid data to update"}), 400
            
        users_collection.update_one({"_id": user_id}, {"$set": update_data})
        
        updated_user = users_collection.find_one({"_id": user_id}, {"password_hash": 0})
        updated_user["_id"] = str(updated_user["_id"])
        
        return jsonify(updated_user), 200
    except Exception as e:
        logging.error(f"Error updating profile: {str(e)}")
        return jsonify({"error": "Failed to update profile"}), 500

@user_bp.route('/alerts', methods=['GET'])
@token_required
def get_alerts(current_user):
    user_id = str(current_user["_id"])
    alerts = list(price_alerts_collection.find({"user_id": user_id}))
    for a in alerts:
        a["_id"] = str(a["_id"])
    return jsonify(alerts), 200

@user_bp.route('/alerts', methods=['POST'])
@token_required
def set_alert(current_user):
    try:
        data = request.json
        route = data.get("route")
        target_price = data.get("target_price")
        
        if not route or not target_price:
            return jsonify({"error": "Route and target price required"}), 400
            
        alert = {
            "user_id": str(current_user["_id"]),
            "route": route,
            "target_price": target_price,
            "active": True
        }
        
        result = price_alerts_collection.insert_one(alert)
        alert["_id"] = str(result.inserted_id)
        
        return jsonify(alert), 201
    except Exception as e:
        return jsonify({"error": f"Failed to set alert: {str(e)}"}), 500
