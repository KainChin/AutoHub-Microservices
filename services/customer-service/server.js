const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const setupSwagger = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'customer-service', status: 'UP', timestamp: new Date().toISOString() });
});

// Register Routes & Swagger UI
app.use('/api/customers', customerRoutes);
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`🚀 [Customer Service] Listening on http://localhost:${PORT}`);
  console.log(`📚 [Swagger UI] Available at http://localhost:${PORT}/swagger`);
});
