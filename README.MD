<img width="255" height="796" alt="image" src="https://github.com/user-attachments/assets/422de239-87ae-40c5-beac-d98f1125d062" />

# AI-Powered Dynamic Pricing Engine

A real-time pricing optimization tool that balances revenue maximization with customer fairness constraints.

## Table of Contents
- Problem Statement
- Key Features
- Tech Stack
- Installation & Setup
- How to Run
- Project Architecture
- Future Roadmap
- License
- Contributors

## Problem Statement

Retailers often struggle to price products effectively.

- Too High: Customers leave for competitors.
- Too Low: Revenue is left on the table.
- Volatile: Frequent price changes damage brand loyalty.

Our Solution: An AI engine that analyzes demand elasticity and competitor data to recommend the "Sweet Spot" price—maximizing profit while adhering to strict fairness guardrails (preventing price gouging).

## Key Features

- Demand Forecasting: Uses XGBoost to predict sales volume based on price, weekends, and promotions.
- Fairness Constraints: Automatically caps price recommendations within ±20% of the market average to protect customer trust.
- Interactive Dashboard: A React-based control center to simulate market scenarios (e.g., "What if the competitor drops their price to $90?").
- Revenue Visualization: Real-time chart comparison of Static Pricing vs. AI Optimized Pricing.

## Tech Stack

### Backend (The Brain)
- Language: Python 3
- Framework: Flask (REST API)
- ML Engine: XGBoost, Scikit-Learn, Pandas

### Frontend (The Face)
- Framework: React (Vite)
- UI Library: Material UI (MUI)
- Visualization: Chart.js

## Installation & Setup

### Prerequisites
- Node.js & npm installed
- Python 3.8+ installed

1. Clone the Repository

```
git clone https://github.com/joel-jain/pricing-engine-mvp.git
cd pricing-engine-mvp
```

2. Backend Setup

Navigate to the server folder, create a virtual environment, and install dependencies.

```
cd server

# Create Virtual Environment
python -m venv venv

# Activate Environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Dependencies
pip install flask flask-cors pandas scikit-learn xgboost
```

3. Frontend Setup

Open a new terminal, navigate to the client folder, and install node modules.

```
cd ../client
npm install
```

## How to Run

### Step 1: Wake up the AI (Backend)
Before running the server, generate synthetic data and train the model.

```
# Ensure you are inside /server with venv activated
python generate_data.py   # Generates 1,000 rows of retail history
python train_model.py     # Trains the XGBoost model (look for "MAE" score)
python app.py             # Starts the API
```

Server will start at: http://127.0.0.1:5000

### Step 2: Launch the Dashboard (Frontend)

In your second terminal (inside /client):

```
npm run dev
```

App will start at: http://localhost:5173

## Project Architecture

```
pricing-engine-mvp/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Dashboard & UI Logic
│   │   └── assets/
├── server/                 # Flask Backend
│   ├���─ app.py              # Application Entry Point
│   ├── routes.py           # API Endpoints (/predict, /optimize)
│   ├── services.py         # Business Logic & Inference Engine
│   ├── train_model.py      # ML Training Script
│   └── generate_data.py    # Data Simulation Utility
└── README.md
```

## Future Roadmap

- [ ] Docker Support: Containerize the application for easy deployment.
- [ ] Real Database: Replace CSV with PostgreSQL for persistent storage.
- [ ] Multi-Product Support: Scale the model to handle thousands of SKUs simultaneously.
- [ ] Reinforcement Learning: Implement RL agents to learn long-term pricing strategies.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- Joel George Jain - Full Stack Developer