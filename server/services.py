import xgboost as xgb
import pandas as pd
import numpy as np
import os

# Architectural Note: Singleton Pattern
# We load the model once globally so we don't reload it for every request.
_model = None

def get_model():
    global _model
    if _model is None:
        _model = xgb.XGBRegressor()
        # Robust Path Handling: Ensures we find the file regardless of where we run the command
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, 'model.json')
        _model.load_model(model_path)
    return _model

def predict_demand(my_price, competitor_price, is_weekend=0, promotion_active=0):
    """
    Feeds a specific scenario into the AI to guess sales volume.
    """
    model = get_model()
    
    # Prepare input dataframe matching training columns exactly
    input_data = pd.DataFrame({
        'my_price': [my_price],
        'competitor_price': [competitor_price],
        'is_weekend': [is_weekend],
        'promotion_active': [promotion_active]
    })
    
    prediction = model.predict(input_data)[0]
    return max(0, int(prediction)) # No negative sales allowed

def optimize_price(competitor_price, is_weekend=0, promotion_active=0):
    """
    Finds the 'Sweet Spot' price that maximizes revenue.
    """
    # 1. Define Fairness Constraints (The Guardrails)
    # We cannot go lower than 80% of competitor (loss leader limit)
    # We cannot go higher than 120% of competitor (fairness limit)
    min_price = competitor_price * 0.80
    max_price = competitor_price * 1.20
    
    # 2. Search Space
    # Test every price in this range with $1 steps
    possible_prices = np.arange(min_price, max_price, 1.0)
    
    best_price = competitor_price
    max_revenue = 0
    best_demand = 0
    
    # 3. Brute Force Optimization (Simulate each price)
    for price in possible_prices:
        predicted_sales = predict_demand(price, competitor_price, is_weekend, promotion_active)
        revenue = price * predicted_sales
        
        if revenue > max_revenue:
            max_revenue = revenue
            best_price = price
            best_demand = predicted_sales
            
    return {
        "optimized_price": round(best_price, 2),
        "predicted_demand": int(best_demand),
        "predicted_revenue": round(max_revenue, 2),
        "original_price": competitor_price # Comparison baseline
    }