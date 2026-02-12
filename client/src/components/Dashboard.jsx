// client/src/components/Dashboard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, Grid, Paper, Typography, Box, 
  AppBar, Toolbar, Button, TextField, 
  FormControlLabel, Switch, Stack, Divider, 
  Card, CardContent, Tooltip, IconButton 
} from '@mui/material';
// ARCHITECTURE NOTE: Importing the standard Info icon for user education
import InfoIcon from '@mui/icons-material/Info'; 
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart components (Aliased ChartTooltip to avoid conflict with MUI Tooltip)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

export default function Dashboard() {
  const [competitorPrice, setCompetitorPrice] = useState(100);
  const [isWeekend, setIsWeekend] = useState(false);
  const [promotionActive, setPromotionActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/optimize', {
        competitor_price: Number(competitorPrice),
        is_weekend: isWeekend ? 1 : 0,
        promotion_active: promotionActive ? 1 : 0
      });
      setResult(response.data.result);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Error: Is the Python Server running?");
    }
    setLoading(false);
  };

  const chartData = result ? {
    labels: ['Competitor Strategy', 'AI Optimized Strategy'],
    datasets: [
      {
        label: 'Projected Revenue ($)',
        data: [result.baseline_revenue, result.predicted_revenue],
        backgroundColor: ['rgba(100, 100, 100, 0.6)', 'rgba(75, 192, 192, 0.8)'],
        borderColor: ['rgba(100, 100, 100, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  } : null;

  const calculateUplift = () => {
    if (!result || result.baseline_revenue === 0) return 0;
    const diff = result.predicted_revenue - result.baseline_revenue;
    return ((diff / result.baseline_revenue) * 100).toFixed(1);
  };

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
          {/* LEFT: Controls */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              
              {/* HEADER WITH TOOLTIP */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Simulation Config</Typography>
                <Tooltip title="The AI is constrained to ±20% of the competitor's price to prevent price wars and maintain 'Fairness'." arrow>
                  <IconButton color="primary" size="small">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider />

              <TextField label="Competitor Price ($)" type="number" value={competitorPrice} onChange={(e) => setCompetitorPrice(e.target.value)} fullWidth />
              <Stack direction="column" spacing={1}>
                <FormControlLabel control={<Switch checked={isWeekend} onChange={(e) => setIsWeekend(e.target.checked)} />} label="Is it the Weekend?" />
                <FormControlLabel control={<Switch checked={promotionActive} onChange={(e) => setPromotionActive(e.target.checked)} />} label="Promotion Active?" />
              </Stack>
              <Button variant="contained" size="large" onClick={handleRunSimulation} disabled={loading}>
                {loading ? "Optimizing..." : "Run Optimization AI"}
              </Button>
            </Paper>

            {/* METRICS CARD */}
            {result && (
              <Card sx={{ mt: 2, bgcolor: '#e3f2fd', border: '1px solid #90caf9' }}>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">Recommendation</Typography>
                  <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    ${result.optimized_price}
                  </Typography>
                  
                  <Box sx={{ mt: 2, p: 1, bgcolor: '#fff', borderRadius: 1 }}>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                      🚀 Revenue Uplift: +{calculateUplift()}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      (vs. Matching Competitor)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* RIGHT: Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', minHeight: 400 }}>
              <Typography variant="h6" gutterBottom>Revenue Projection</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {chartData ? <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Revenue Impact Analysis' } } }} /> : <Typography color="text.secondary">Enter simulation parameters...</Typography>}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}