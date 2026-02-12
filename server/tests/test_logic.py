import pytest
import sys
import os

# Architectural Note: Path Hacking
# We need to tell Python where to find 'services.py' since it is in the parent folder.
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services import optimize_price, predict_demand

def test_fairness_constraints():
    """
    Ensure the AI never recommends a price > 20% higher 
    or < 20% lower than the competitor.
    """
    competitor_price = 100
    result = optimize_price(competitor_price, is_weekend=0, promotion_active=0)
    
    recommended_price = result['optimized_price']
    
    # Assertions: These must be TRUE for the test to pass
    assert recommended_price <= 120, "Price is too high! Gouging detected."
    assert recommended_price >= 80,  "Price is too low! Loss leader detected."

def test_demand_sanity():
    """
    Ensure demand is never negative.
    """
    demand = predict_demand(my_price=1000, competitor_price=10) # Nobody should buy this
    assert demand >= 0, "Demand cannot be negative!"
    assert isinstance(demand, int), "Demand must be an integer."

def test_revenue_calculation():
    """
    Ensure revenue is calculated correctly (Price * Demand).
    """
    competitor_price = 100
    result = optimize_price(competitor_price)
    
    expected_revenue = result['optimized_price'] * result['predicted_demand']
    
    # We use 'approx' for float comparisons to avoid tiny decimal errors
    assert result['predicted_revenue'] == pytest.approx(expected_revenue, 0.01)