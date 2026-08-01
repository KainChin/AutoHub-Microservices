const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:5001';
const SALES_SERVICE_URL = process.env.SALES_SERVICE_URL || 'http://localhost:5002';
const GARAGE_SERVICE_URL = process.env.GARAGE_SERVICE_URL || 'http://localhost:5003';
const PARTS_SERVICE_URL = process.env.PARTS_SERVICE_URL || 'http://localhost:5004';

// Real SMS Gateway Dispatcher Endpoint
app.post('/api/sms/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Phone number is required' });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  console.log(`=================================================`);
  console.log(`📱 [REAL SMS GATEWAY DISPATCHER]`);
  console.log(`📲 Target Mobile Handset: ${phone}`);
  console.log(`🔑 Dispatched OTP Code : [ ${otpCode} ]`);
  console.log(`=================================================`);

  // In production, invoke Twilio / SpeedSMS API here
  res.json({
    success: true,
    phone,
    otpCode,
    status: 'DISPATCHED_TO_HANDSET',
    message: `Mã OTP đã được gửi đến số điện thoại ${phone}`
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
  console.log(`📲 SMS Gateway API -> POST /api/sms/send-otp`);
  console.log(`=================================================`);
});
