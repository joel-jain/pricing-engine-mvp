from flask import Blueprint, jsonify, request
from services import predict_demand, optimize_price

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Simple check to see if server is running."""
    return jsonify({'status': 'healthy', 'message': 'Pricing Engine API is active'})

@api_bp.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint: /api/predict
    Input: { "my_price": 100, "competitor_price": 95, "is_weekend": 1, "promotion_active": 0 }
    Output: { "predicted_demand": 120 }
    """
    try:
        data = request.get_json()
        
        # Extract parameters with safe defaults
        my_price = float(data.get('my_price'))
        competitor_price = float(data.get('competitor_price'))
        is_weekend = int(data.get('is_weekend', 0))
        promotion_active = int(data.get('promotion_active', 0))
        
        demand = predict_demand(my_price, competitor_price, is_weekend, promotion_active)
        
        return jsonify({
            "predicted_demand": demand,
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api_bp.route('/optimize', methods=['POST'])
def optimize():
    """
    Endpoint: /api/optimize
    Input: { "competitor_price": 100, "is_weekend": 1, "promotion_active": 0 }
    Output: { "optimized_price": 105, "predicted_revenue": 5000, ... }
    """
    try:
        data = request.get_json()
        
        competitor_price = float(data.get('competitor_price'))
        is_weekend = int(data.get('is_weekend', 0))
        promotion_active = int(data.get('promotion_active', 0))
        
        result = optimize_price(competitor_price, is_weekend, promotion_active)
        
        return jsonify({
            "result": result,
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400