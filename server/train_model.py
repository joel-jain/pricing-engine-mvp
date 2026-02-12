# server/train_model.py
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import os

def train():
    print("Loading data...")
    # Robust Pathing: Always find data relative to *this script's* location
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, 'retail_data.csv')
    model_path = os.path.join(base_dir, 'model.json')

    # Load data
    df = pd.read_csv(data_path)

    # Features (X) and Target (y)
    X = df[['competitor_price', 'is_weekend', 'promotion_active']]
    y = df['demand']

    # Split data (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training XGBoost Regressor...")
    model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100)
    model.fit(X_train, y_train)

    # Evaluate
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)

    print("Model Training Complete!")
    print(f"Mean Absolute Error (MAE): {mae:.2f}")
    print("Interpretation: On average, our prediction is off by only +/- {:.0f} units.".format(mae))

    # Save the model using the Absolute Path
    # ARCHITECTURE NOTE: We use save_model (JSON) for compatibility/portability
    model.save_model(model_path)
    print(f"Success! Model saved to {model_path}")

if __name__ == "__main__":
    train()