from flask import Flask, jsonify
from flask_cors import CORS
import logging

from blueprints.auth import auth_bp
from blueprints.search import search_bp
from blueprints.booking import booking_bp
from blueprints.user import user_bp
from blueprints.emotion import emotion_bp

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(search_bp, url_prefix='/api')
app.register_blueprint(booking_bp, url_prefix='/api/bookings')
app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(emotion_bp, url_prefix='/api/emotions')

# Global Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.route('/health')
def health_check():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
