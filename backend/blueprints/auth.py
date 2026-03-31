from flask import Blueprint, request, jsonify
import bcrypt
import jwt
import os
import datetime

try:
    from ..models import users_collection
except ImportError:
    from models import users_collection

auth_bp = Blueprint('auth', __name__)
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key-wingscape-123")

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User with this email already exists"}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    new_user = {
        "name": name,
        "email": email,
        "password": hashed_password.decode('utf-8'),
        "phone": "",
        "passport": "",
        "points": 0,
        "points_tier": "Silver",
        "saved_passengers": []
    }
    
    result = users_collection.insert_one(new_user)
    
    return jsonify({"message": "User registered successfully", "user_id": str(result.inserted_id)}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"error": "Missing email or password"}), 400

    user = users_collection.find_one({"email": email})
    
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": str(user['_id']),
                "name": user['name'],
                "email": user['email']
            }
        }), 200
        
    return jsonify({"error": "Invalid email or password"}), 401

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
        
    user = users_collection.find_one({"email": email})
    if not user:
        # Simulate generic response for security
        return jsonify({"message": "If an account with that email exists, a password reset link has been sent."}), 200
        
    # Simulate email sending
    return jsonify({"message": "If an account with that email exists, a password reset link has been sent."}), 200
