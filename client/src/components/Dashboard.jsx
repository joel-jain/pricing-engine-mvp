// client/src/components/Dashboard.jsx
import React, { useState } from 'react';
import axios from 'axios'; // For making API calls
import { 
  Container, Grid, Paper, Typography, Box, 
  AppBar, Toolbar, Button, TextField, 
  FormControlLabel, Switch, Stack, Divider, 
  Card, CardContent 
} from '@mui/material';

// Chart.js Setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart components so they can be drawn
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // 1. State Variables
  const [competitorPrice, setCompetitorPrice] = useState(100);
  const [isWeekend, setIsWeekend] = useState(false);
  const [promotionActive, setPromotionActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // Stores the API response

  // 2. The API Call Handler
  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      // Connect to our Flask Backend
      const response = await axios.post('http://localhost:5000/api/optimize', {
        competitor_price: Number(competitorPrice),
        is_weekend: isWeekend ? 1 : 0,
        promotion_active: promotionActive ? 1 : 0
      });

      // Save the result to state so we can display it
      setResult(response.data.result);
      
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Error: Is the Python Server running?");
    }
    setLoading(false);
  };

  // 3. Prepare Chart Data (Only if we have a result)
  const chartData = result ? {
    labels: ['Competitor Strategy', 'AI Optimized Strategy'],
    datasets: [
      {
        label: 'projected Revenue ($)',
        data: [
          // We estimate competitor revenue roughly for comparison (Price * Demand)
           result.original_price * (result.predicted_revenue / result.optimized_price), 
           result.predicted_revenue
        ],
        backgroundColor: ['rgba(100, 100, 100, 0.6)', 'rgba(75, 192, 192, 0.8)'],
        borderColor: ['rgba(100, 100, 100, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Dynamic Pricing Engine
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          
          {/* LEFT COLUMN: Controls */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Simulation Config
              </Typography>
              <Divider />
              
              <TextField
                label="Competitor Price ($)"
                type="number"
                value={competitorPrice}
                onChange={(e) => setCompetitorPrice(e.target.value)}
                fullWidth
              />

              <Stack direction="column" spacing={1}>
                <FormControlLabel
                  control={<Switch checked={isWeekend} onChange={(e) => setIsWeekend(e.target.checked)} />}
                  label="Is it the Weekend?"
                />
                <FormControlLabel
                  control={<Switch checked={promotionActive} onChange={(e) => setPromotionActive(e.target.checked)} />}
                  label="Promotion Active?"
                />
              </Stack>

              <Button 
                variant="contained" 
                size="large"
                onClick={handleRunSimulation}
                disabled={loading}
              >
                {loading ? "Optimizing..." : "Run Optimization AI"}
              </Button>
            </Paper>

            {/* Metrics Card */}
            {result && (
              <Card sx={{ mt: 2, bgcolor: '#e3f2fd' }}>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Recommendation
                  </Typography>
                  <Typography variant="h4">
                    ${result.optimized_price}
                  </Typography>
                  <Typography variant="body2">
                    Predicted Sales: {result.predicted_demand} units
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* RIGHT COLUMN: Visualization */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', minHeight: 400 }}>
              <Typography variant="h6" gutterBottom>
                Revenue Projection
              </Typography>
              
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {chartData ? (
                  <Bar 
                    data={chartData} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Revenue Impact Analysis' },
                      },
                    }} 
                  />
                ) : (
                  <Typography color="text.secondary">
                    Enter simulation parameters and click "Run" to see the AI impact.
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        
        </Grid>
      </Container>
    </Box>
  );
}