const express = require('express');
const cors = require('cors');
const partsRoutes = require('./routes/partsRoutes');
const setupSwagger = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'parts-service', status: 'UP', timestamp: new Date().toISOString() });
});

// Register Routes & Swagger UI
app.use('/api/parts', partsRoutes);
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`🚀 [Parts Service] Listening on http://localhost:${PORT}`);
  console.log(`📚 [Swagger UI] Available at http://localhost:${PORT}/swagger`);
});
