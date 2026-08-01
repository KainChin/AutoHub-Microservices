const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Target microservice host definitions (env or localhost fallback)
const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:5001';
const SALES_SERVICE_URL = process.env.SALES_SERVICE_URL || 'http://localhost:5002';
const GARAGE_SERVICE_URL = process.env.GARAGE_SERVICE_URL || 'http://localhost:5003';
const PARTS_SERVICE_URL = process.env.PARTS_SERVICE_URL || 'http://localhost:5004';

// Helper function to query health of microservice
function checkServiceHealth(serviceName, url) {
  return new Promise((resolve) => {
    const healthUrl = `${url}/health`;
    http.get(healthUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ service: serviceName, url, status: 'UP', details: parsed });
        } catch {
          resolve({ service: serviceName, url, status: 'UP', raw: data });
        }
      });
    }).on('error', (err) => {
      resolve({ service: serviceName, url, status: 'DOWN', error: err.message });
    });
  });
}

// Global System Health Aggregator
app.get('/health', async (req, res) => {
  const results = await Promise.all([
    checkServiceHealth('Customer Service', CUSTOMER_SERVICE_URL),
    checkServiceHealth('Sales & Cars Service', SALES_SERVICE_URL),
    checkServiceHealth('Garage Service', GARAGE_SERVICE_URL),
    checkServiceHealth('Parts & Inventory Service', PARTS_SERVICE_URL)
  ]);

  const allUp = results.every(r => r.status === 'UP');
  res.status(allUp ? 200 : 207).json({
    gateway: 'API Gateway (Port 5000)',
    status: allUp ? 'HEALTHY' : 'PARTIAL_OUTAGE',
    timestamp: new Date().toISOString(),
    microservices: results
  });
});

// Route Proxying
app.use('/api/customers', proxy(CUSTOMER_SERVICE_URL, {
  proxyReqPathResolver: (req) => '/api/customers' + req.url
}));

app.use('/api/sales', proxy(SALES_SERVICE_URL, {
  proxyReqPathResolver: (req) => '/api/sales' + req.url
}));

app.use('/api/garage', proxy(GARAGE_SERVICE_URL, {
  proxyReqPathResolver: (req) => '/api/garage' + req.url
}));

app.use('/api/parts', proxy(PARTS_SERVICE_URL, {
  proxyReqPathResolver: (req) => '/api/parts' + req.url
}));

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 [API Gateway] Listening on http://localhost:${PORT}`);
  console.log(`📍 Route Proxy -> /api/customers -> ${CUSTOMER_SERVICE_URL}`);
  console.log(`📍 Route Proxy -> /api/sales     -> ${SALES_SERVICE_URL}`);
  console.log(`📍 Route Proxy -> /api/garage    -> ${GARAGE_SERVICE_URL}`);
  console.log(`📍 Route Proxy -> /api/parts     -> ${PARTS_SERVICE_URL}`);
  console.log(`=================================================`);
});
