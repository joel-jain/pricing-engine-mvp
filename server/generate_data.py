# server/generate_data.py
import pandas as pd
import numpy as np
import random
import os

# 1. Setup Data
# ---------------------------------------------------------
# Create 100 days of data
days = np.arange(100)
base_demand = 150
price_elasticity = -2.5

# Competitor Price (Randomly fluctuating around $100)
competitor_prices = np.random.normal(100, 15, 100)

# 2. Add Business Context (Weekend & Promotions)
# ---------------------------------------------------------
is_weekend = [1 if d % 7 >= 5 else 0 for d in days]
promotion = [1 if random.random() > 0.8 else 0 for d in days]

# 3. Calculate "My Price" and "Demand"
# ---------------------------------------------------------
my_prices = []
demands = []

for i in range(100):
    # Strategy: Match competitor but add small random variation
    my_price = competitor_prices[i] * (1 + np.random.uniform(-0.05, 0.10))
    
    # Demand Formula: Base - (Price Diff * Elasticity) + Boosts
    price_diff = my_price - competitor_prices[i]
    weekend_boost = 20 if is_weekend[i] else 0
    promo_boost = 30 if promotion[i] else 0
    
    # Calculate demand (ensure it doesn't go negative)
    demand = base_demand - (price_diff * price_elasticity) + weekend_boost + promo_boost
    demand = max(0, int(demand + np.random.normal(0, 5)))
    
    my_prices.append(my_price)
    demands.append(demand)

# 4. Save to CSV (The Robust Way)
# ---------------------------------------------------------
df = pd.DataFrame({
    'day_id': days,
    'competitor_price': competitor_prices,
    'is_weekend': is_weekend,
    'promotion_active': promotion,
    'my_price': my_prices,
    'demand': demands
})

# ARCHITECTURE FIX: Use absolute path to ensure file lands in 'server/'
base_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(base_dir, 'retail_data.csv')

df.to_csv(output_path, index=False)
print(f"Success! Data saved to {output_path}")