from flask import Blueprint, jsonify

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Simple check to see if server is running."""
    return jsonify({'status': 'healthy', 'message': 'Pricing Engine API is active'})