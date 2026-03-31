from flask import Blueprint, jsonify

try:
    from ..models import destinations_collection
except ImportError:
    from models import destinations_collection

emotion_bp = Blueprint('emotion', __name__)

@emotion_bp.route('/', methods=['GET'])
def get_emotions():
    emotions = sorted(
        {
            emotion
            for destination in destinations_collection.find({})
            for emotion in destination.get("emotion_tags", [])
        }
    )
    return jsonify(emotions), 200

@emotion_bp.route('/<emotion>/destinations', methods=['GET'])
def get_destinations_by_emotion(emotion):
    destinations = list(destinations_collection.find({"emotion_tags": emotion}))
    for d in destinations:
        d["_id"] = str(d["_id"])
    return jsonify(destinations), 200
