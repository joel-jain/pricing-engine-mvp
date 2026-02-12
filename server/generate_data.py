# server/generate_data.py
import pandas as pd
import numpy as np
import random

# Architectural Note: 
# We use a fixed seed (42) to ensure 'reproducible randomness'.
# This means every time we run this, we get the same "random" numbers,
# which is crucial for debugging AI models.
np.random.seed(42)

def generate_retail_data(num_samples=1000):
    print("Generating simulated retail data...")
    
    # 1. Create base features
    data = {
        'day_id': np.arange(num_samples),
        'competitor_price': np.random.uniform(50, 150, num_samples), # Competitor ranges $50-$150
        'is_weekend': np.random.choice([0, 1], num_samples, p=[0.7, 0.3]), # 30% chance of weekend
        'promotion_active': np.random.choice([0, 1], num_samples, p=[0.8, 0.2]) # 20% chance of promo
    }
    
    df = pd.DataFrame(data)
    
    # 2. Define our "Own Price" strategy (Randomly fluctuate around competitor)
    # We want the model to learn that OUR price matters relative to THEIRS.
    df['my_price'] = df['competitor_price'] * np.random.uniform(0.85, 1.15, num_samples)
    
    # 3. Simulate Demand (The "Ground Truth" Formula)
    # Demand = Base - (Price Sensitivity * Price) + (Competitor Impact) + (Weekend Boost)
    # We add 'noise' (np.random.normal) to make it realistic.
    base_demand = 200
    price_sensitivity = 1.5
    competitor_sensitivity = 0.8
    
    df['demand'] = (
        base_demand 
        - (df['my_price'] * price_sensitivity) 
        + (df['competitor_price'] * competitor_sensitivity)
        + (df['is_weekend'] * 20) # Weekends sell more
        + (df['promotion_active'] * 30) # Promos sell more
        + np.random.normal(0, 10, num_samples) # Random noise
    )
    
    # Ensure demand doesn't go negative (business logic constraint)
    df['demand'] = df['demand'].clip(lower=0).astype(int)
    
    # 4. Save to CSV
    # This file acts as our "Database" for the Hackathon
    output_path = 'retail_data.csv'
    df.to_csv(output_path, index=False)
    print(f"Success! Data saved to {output_path}")
    print(df.head())

if __name__ == "__main__":
    generate_retail_data()