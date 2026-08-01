const express = require('express');
const cors = require('cors');
const garageRoutes = require('./routes/garageRoutes');
const setupSwagger = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'garage-service', status: 'UP', timestamp: new Date().toISOString() });
});

// Register Routes & Swagger UI
app.use('/api/garage', garageRoutes);
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`🚀 [Garage Service] Listening on http://localhost:${PORT}`);
  console.log(`📚 [Swagger UI] Available at http://localhost:${PORT}/swagger`);
});
