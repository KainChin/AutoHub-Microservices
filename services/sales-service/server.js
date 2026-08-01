const express = require('express');
const cors = require('cors');
const salesRoutes = require('./routes/salesRoutes');
const setupSwagger = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'sales-service', status: 'UP', timestamp: new Date().toISOString() });
});

// Register Routes & Swagger UI
app.use('/api/sales', salesRoutes);
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`🚀 [Sales Service] Listening on http://localhost:${PORT}`);
  console.log(`📚 [Swagger UI] Available at http://localhost:${PORT}/swagger`);
});
