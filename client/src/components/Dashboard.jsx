// client/src/components/Dashboard.jsx
import React, { useState } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, 
  AppBar, Toolbar, Button, TextField, 
  FormControlLabel, Switch, Stack, Divider 
} from '@mui/material';

export default function Dashboard() {
  // 1. State Variables (The "Memory" of our form)
  const [competitorPrice, setCompetitorPrice] = useState(100);
  const [isWeekend, setIsWeekend] = useState(false);
  const [promotionActive, setPromotionActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Placeholder function for Step 10
  const handleRunSimulation = () => {
    setLoading(true);
    console.log("Simulating with:", { competitorPrice, isWeekend, promotionActive });
    // We will connect the API here in the next step
    setTimeout(() => setLoading(false), 1000); 
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
      {/* Top Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Dynamic Pricing Engine
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          
          {/* Left Column: Input Controls */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Simulation Config
              </Typography>
              <Divider />
              
              {/* Input 1: Competitor Price */}
              <TextField
                label="Competitor Price ($)"
                type="number"
                value={competitorPrice}
                onChange={(e) => setCompetitorPrice(Number(e.target.value))}
                fullWidth
                variant="outlined"
              />

              {/* Input 2: Boolean Flags */}
              <Stack direction="column" spacing={1}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={isWeekend} 
                      onChange={(e) => setIsWeekend(e.target.checked)} 
                    />
                  }
                  label="Is it the Weekend?"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={promotionActive} 
                      onChange={(e) => setPromotionActive(e.target.checked)} 
                    />
                  }
                  label="Is Promotion Active?"
                />
              </Stack>

              <Divider sx={{ my: 1 }} />

              {/* Action Button */}
              <Button 
                variant="contained" 
                size="large"
                onClick={handleRunSimulation}
                disabled={loading}
              >
                {loading ? "Calculating..." : "Run Optimization AI"}
              </Button>

            </Paper>
          </Grid>

          {/* Right Column: Results Placeholder */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', minHeight: 400 }}>
              <Typography variant="h6" gutterBottom>
                Revenue Projection
              </Typography>
              <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#f5f5f5',
                borderRadius: 1
              }}>
                <Typography color="text.secondary">
                  Chart will appear here in Step 10
                </Typography>
              </Box>
            </Paper>
          </Grid>
        
        </Grid>
      </Container>
    </Box>
  );
}