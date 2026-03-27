from flask import Blueprint, jsonify
from models import destinations_collection

emotion_bp = Blueprint('emotion', __name__)

@emotion_bp.route('/', methods=['GET'])
def get_emotions():
    pipeline = [
        {"$unwind": "$emotion_tags"},
        {"$group": {"_id": "$emotion_tags"}},
        {"$project": {"_id": 0, "emotion": "$_id"}}
    ]
    emotions = list(destinations_collection.aggregate(pipeline))
    return jsonify([e['emotion'] for e in emotions]), 200

@emotion_bp.route('/<emotion>/destinations', methods=['GET'])
def get_destinations_by_emotion(emotion):
    destinations = list(destinations_collection.find({"emotion_tags": emotion}))
    for d in destinations:
        d["_id"] = str(d["_id"])
    return jsonify(destinations), 200
